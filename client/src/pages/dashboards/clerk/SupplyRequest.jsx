import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const SupplyRequestsPage = () => {
  const { user } = useSelector(state => state.auth);
  const clerkId = user?.id;
  const [requests, setRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [users, setUsers] = useState([]);
  const [latestPrices, setLatestPrices] = useState({});
  const [storeId, setStoreId] = useState(null);
  const [filter, setFilter] = useState('my');
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [reqRes, prodRes, supRes, usersRes] = await Promise.all([
          axios.get('http://127.0.0.1:5000/supply_request'),
          axios.get('http://127.0.0.1:5000/product'),
          axios.get('http://127.0.0.1:5000/supplier'),
          axios.get('http://127.0.0.1:5000/user/clerks'),
        ]);
        setRequests(reqRes.data);
        setProducts(prodRes.data);
        setSuppliers(supRes.data);
        setUsers(usersRes.data);

        console.log('Fetched requests:', reqRes.data);
        console.log('Fetched products:', prodRes.data);
        console.log('Fetched suppliers:', supRes.data);
        console.log('Fetched users:', usersRes.data);
        console.log('clerkId:', clerkId);

        const currentClerk = usersRes.data.find(u => u.id === clerkId);
        if (currentClerk) setStoreId(currentClerk.store_id);
        console.log('storeId:', currentClerk ? currentClerk.store_id : null);

        const prices = {};
        await Promise.all(
          prodRes.data.map(async product => {
            const res = await axios.get(`http://127.0.0.1:5000/stock_entries?product_id=${product.id}`);
            if (res.data.length > 0) {
              const latestEntry = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
              const price = Number(latestEntry.buying_price);
              prices[product.id] = isNaN(price) ? 0 : price;
            } else {
              prices[product.id] = 0;
            }
          })
        );
        setLatestPrices(prices);
      } catch (err) {
        console.error('Error fetching supply request data', err);
      }
    };

    fetchAll();
  }, [clerkId]);

  const getProduct = id => products.find(p => p.id === id);
  const getProductName = id => getProduct(id)?.name || '—';
  const getSupplierName = id => suppliers.find(s => s.id === id)?.name || '—';
  const getUserName = id => {
    const user = users.find(u => u.id === id);
    if (!user) return '—';
    return user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || '—';
  };

  const cancelRequest = async id => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      try {
        await axios.delete(`http://127.0.0.1:5000/supply_request/${id}`);
        setRequests(prev => prev.filter(r => r.id !== id));
      } catch (err) {
        console.error('Failed to cancel request', err);
      }
    }
  };

  const filteredRequests = requests
    .filter(req => {
      const product = getProduct(req.product_id);
      if (!product) return false;

      const matchesFilter =
        filter === 'my'
          ? req.requester_id === clerkId
          : (product.store_id === storeId || req.requester_id === clerkId);

      const productName = getProductName(req.product_id).toLowerCase();
      const supplierName = getSupplierName(req.supplier_id).toLowerCase();
      const clerkName = getUserName(req.requester_id).toLowerCase();
      const searchLower = search.toLowerCase();

      const matchesSearch =
        productName.includes(searchLower) ||
        supplierName.includes(searchLower) ||
        clerkName.includes(searchLower);

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const requestSort = key => {
    setSortConfig(prev => {
      const direction = prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc';
      return { key, direction };
    });
  };

  const renderSortArrow = key => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Supply Requests</h1>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="space-x-4">
          <label>
            <input
              type="radio"
              value="my"
              checked={filter === 'my'}
              onChange={() => setFilter('my')}
              className="mr-1"
            />
            My Requests
          </label>
          <label>
            <input
              type="radio"
              value="store"
              checked={filter === 'store'}
              onChange={() => setFilter('store')}
              className="mr-1"
            />
            All Store Requests
          </label>
        </div>
        <input
          type="text"
          placeholder="Search by product, supplier, clerk"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 px-3 py-1 rounded-md text-sm w-80"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm bg-white shadow rounded">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => requestSort('product_id')}>
                Product{renderSortArrow('product_id')}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => requestSort('supplier_id')}>
                Supplier{renderSortArrow('supplier_id')}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => requestSort('quantity')}>
                Quantity{renderSortArrow('quantity')}
              </th>
              <th className="px-4 py-2 text-left">Total (KES)</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => requestSort('requested_by')}>
                Requested By{renderSortArrow('requested_by')}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => requestSort('status')}>
                Status{renderSortArrow('status')}
              </th>
              <th className="px-4 py-2 text-left">Reviewed By</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => requestSort('created_at')}>
                Request Date{renderSortArrow('created_at')}
              </th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(req => {
              const product = getProduct(req.product_id);
              const unitPrice = latestPrices[product?.id] || 0;
              const total = unitPrice * req.quantity;

              return (
                <tr key={req.id} className="border-t">
                  <td className="px-4 py-2">{getProductName(req.product_id)}</td>
                  <td className="px-4 py-2">{getSupplierName(req.supplier_id)}</td>
                  <td className="px-4 py-2">{req.quantity}</td>
                  <td className="px-4 py-2">KES {total.toFixed(2)}</td>
                  <td className="px-4 py-2">{`${req.requester_first_name || ''} ${req.requester_last_name || ''}`.trim() || '—'}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        req.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : req.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {req.reviewer_id ? `${req.reviewer_first_name || ''} ${req.reviewer_last_name || ''}`.trim() : '—'}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {req.status === 'pending' && req.requester_id === clerkId ? (
                      <button
                        onClick={() => cancelRequest(req.id)}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Cancel
                      </button>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No supply requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplyRequestsPage;
