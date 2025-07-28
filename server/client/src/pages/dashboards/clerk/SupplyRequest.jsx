import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SupplyRequestsPage = ({ clerkId }) => {
  const [requests, setRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [users, setUsers] = useState([]);
  const [storeId, setStoreId] = useState(null);
  const [filter, setFilter] = useState('my');
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [reqRes, prodRes, supRes, usersRes] = await Promise.all([
          axios.get('http://localhost:3001/supply_requests'),
          axios.get('http://localhost:3001/products'),
          axios.get('http://localhost:3001/suppliers'),
          axios.get('http://localhost:3001/users'),
        ]);
        setRequests(reqRes.data);
        setProducts(prodRes.data);
        setSuppliers(supRes.data);
        setUsers(usersRes.data);

        const currentClerk = usersRes.data.find(u => u.id === clerkId);
        if (currentClerk) setStoreId(currentClerk.store_id);
      } catch (err) {
        console.error('Error fetching supply request data', err);
      }
    };

    fetchAll();
  }, [clerkId]);

  const getProduct = id => products.find(p => p.id === id);
  const getProductName = id => getProduct(id)?.name || '—';
  const getSupplierName = id => suppliers.find(s => s.id === id)?.name || '—';
  const getUserName = id => users.find(u => u.id === id)?.name || '—';

  const cancelRequest = async id => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      try {
        await axios.delete(`http://localhost:3001/supply_requests/${id}`);
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
        filter === 'my' ? req.requested_by === clerkId : product.store_id === storeId;

      const productName = getProductName(req.product_id).toLowerCase();
      const supplierName = getSupplierName(req.supplier_id).toLowerCase();
      const clerkName = getUserName(req.requested_by).toLowerCase();
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
              const unitPrice = product?.buying_price || 0;
              const total = unitPrice * req.quantity;

              return (
                <tr key={req.id} className="border-t">
                  <td className="px-4 py-2">{getProductName(req.product_id)}</td>
                  <td className="px-4 py-2">{getSupplierName(req.supplier_id)}</td>
                  <td className="px-4 py-2">{req.quantity}</td>
                  <td className="px-4 py-2">KES {total.toFixed(2)}</td>
                  <td className="px-4 py-2">{getUserName(req.requested_by)}</td>
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
                    {req.reviewed_by ? getUserName(req.reviewed_by) : '—'}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {req.status === 'pending' && req.requested_by === clerkId ? (
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
