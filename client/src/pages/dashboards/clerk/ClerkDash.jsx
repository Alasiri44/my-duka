import React, { useEffect, useState } from 'react';
import StatCard from '../../../components/clerk/StatCard';
import {
  FaDropbox, FaLayerGroup, FaTruck, FaExclamationTriangle,
  FaMoneyBill, FaThLarge
} from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const API_URL = 'http://localhost:3001';

const ClerkDash = () => {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    stockEntries: 0,
    stockExits: 0,
    batches: 0,
    mpesaTransactions: 0,
    inventoryValue: 0,
    spoiltItems: 0,
    pendingTxns: 0,
  });

  const [recentProducts, setRecentProducts] = useState([]);
  const [clerk, setClerk] = useState(null);
  const [store, setStore] = useState(null);
  const [form, setForm] = useState({
    product_id: '',
    quantity_received: '',
    buying_price: '',
    spoilt: '',
    payment_status: 'unpaid',
  });

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const clerkId = 2; // Hardcoded clerk
        const userRes = await axios.get(`${API_URL}/users/${clerkId}`);
        const user = userRes.data;
        setClerk(user);

        const storeRes = await axios.get(`${API_URL}/stores/${user.store_id}`);
        const store = storeRes.data;
        setStore(store);

        const storeId = user.store_id;

        const [
          categoriesRes,
          productsRes,
          stockEntriesRes,
          stockExitsRes,
          batchesRes,
          mpesaRes
        ] = await Promise.all([
          axios.get(`${API_URL}/categories?store_id=${storeId}`),
          axios.get(`${API_URL}/products?store_id=${storeId}`),
          axios.get(`${API_URL}/stock_entries?store_id=${storeId}`),
          axios.get(`${API_URL}/stock_exits?store_id=${storeId}`),
          axios.get(`${API_URL}/batches?store_id=${storeId}`),
          axios.get(`${API_URL}/mpesa_transactions?store_id=${storeId}`)
        ]);

        setProducts(productsRes.data);

        const inventoryValue = stockEntriesRes.data.reduce((total, entry) => {
          return total + (entry.quantity_received * entry.buying_price);
        }, 0);

        const spoiltItems = stockExitsRes.data.filter(exit =>
          exit.reason?.toLowerCase().includes('damage') || exit.reason?.toLowerCase().includes('spoil')
        ).length;

        const pendingTxns = mpesaRes.data.filter(txn =>
          txn.status?.toLowerCase() === 'pending'
        ).length;

        setStats({
          categories: categoriesRes.data.length,
          products: productsRes.data.length,
          stockEntries: stockEntriesRes.data.length,
          stockExits: stockExitsRes.data.length,
          batches: batchesRes.data.length,
          mpesaTransactions: mpesaRes.data.length,
          inventoryValue,
          spoiltItems,
          pendingTxns,
        });

        const recentEntries = stockEntriesRes.data
          .slice(-10)
          .reverse()
          .map(entry => {
            const product = productsRes.data.find(p => String(p.id) === String(entry.product_id));
            return {
              id: entry.id,
              product_id: entry.product_id,
              name: product?.name || 'Unknown Product',
              stock: entry.quantity_received,
              value: entry.quantity_received * entry.buying_price,
              spoilt: entry.spoilt || 0,
              status: entry.payment_status || 'unpaid',
              created_at: entry.created_at,
            };
          })
          .slice(0, 4);

        setRecentProducts(recentEntries);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        store_id: clerk?.store_id,
        quantity_received: Number(form.quantity_received),
        buying_price: Number(form.buying_price),
        spoilt: Number(form.spoilt),
        created_at: new Date().toISOString(),
      };

      await axios.post(`${API_URL}/stock_entries`, payload);
      alert("Stock entry recorded successfully");
      setForm({
        product_id: '',
        quantity_received: '',
        buying_price: '',
        spoilt: '',
        payment_status: 'unpaid',
      });
    } catch (err) {
      console.error('Error submitting stock entry:', err);
      alert("Failed to submit stock entry");
    }
  };

  // Handler for navigating to product detail page
  const handleGoToProductDetail = (productId) => {
    navigate(`/inventory/products/${productId}`);
  };

  // Handler for the top button (go to first product detail)
  const handleGoToFirstProductDetail = () => {
    if (products.length > 0) {
      navigate(`/inventory/products/${products[0].id}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Clerk Dashboard</h1>
          <p className="text-gray-400">Manage your Inventory and Track your Stock Records</p>
        </div>
        <button
          onClick={handleGoToFirstProductDetail}
          disabled={products.length === 0}
          className={`bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition ${
            products.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Go to First Product Detail
        </button>
      </div>

      {clerk && store && (
        <div className="mb-4 text-sm text-gray-600">
          <span className="font-medium">Welcome {clerk.first_name} {clerk.last_name}</span> &mdash; working at <span className="font-semibold text-indigo-600">{store.name}</span>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Products" value={stats.products} icon={<FaDropbox />} desc="Items in the inventory" bg="bg-white-100" text="text-blue-500" />
        <StatCard title="Inventory Value" value={`KES ${stats.inventoryValue.toLocaleString()}`} icon={<FaMoneyBill />} desc="current stock value" bg="bg-white-100" text="text-green-700" />
        <StatCard title="Spoilt Items" value={stats.spoiltItems} icon={<FaExclamationTriangle />} desc="damaged/ expired items" bg="bg-white-100" text="text-rose-900" />
        <StatCard title="Pending Txns" value={stats.pendingTxns} icon={<FaMoneyBill />} desc="transactions that haven't been cleared" bg="bg-white-100" text="text-orange-900" />
      </div>

      {/* Record Form & Recent Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Record New Stock Entry Form */}
        <div className="bg-white border border-gray-300 rounded-xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-2 text-black">Record New Stock</h2>
          <form className="space-y-3 text-sm" onSubmit={handleFormSubmit}>
            <div>
              <label className="block mb-1 text-gray-600">Product</label>
              <select
                name="product_id"
                value={form.product_id}
                onChange={handleFormChange}
                required
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option value="">-- Select Product --</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-gray-600">Qty Received</label>
                <input
                  type="number"
                  name="quantity_received"
                  value={form.quantity_received}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-600">Buying Price</label>
                <input
                  type="number"
                  name="buying_price"
                  value={form.buying_price}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-gray-600">Spoilt</label>
                <input
                  type="number"
                  name="spoilt"
                  value={form.spoilt}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-600">Payment Status</label>
                <select
                  name="payment_status"
                  value={form.payment_status}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Record Stock
            </button>
          </form>
        </div>

        {/* Recent Inventory Section */}
        <div className="bg-white border border-gray-300 rounded-xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-1 text-black">Recent Inventory</h2>
          <p className="text-xs text-gray-500 mb-2">Latest items added to inventory</p>

          <div className="space-y-3">
            {recentProducts.map(item => (
              <div key={item.id} className="border border-gray-300 rounded-md p-3 flex justify-between items-start bg-white">
                <div>
                  <h3 className="font-semibold text-base text-black">{item.name}</h3>
                  <p className="text-xs text-gray-500">Stock: <span className="font-medium">{item.stock || 0}</span></p>
                  <p className="text-xs text-gray-500">Value: <span className="font-medium">KES {(item.value || 0).toLocaleString()}</span></p>
                  {item.spoilt > 0 && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      ⚠️ {item.spoilt} spoilt item{item.spoilt > 1 && 's'}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    item.status === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.status || 'unpaid'}
                  </span>
                  <span className="text-[10px] text-gray-400">{item.created_at?.split('T')[0]}</span>
                  <button
                    onClick={() => handleGoToProductDetail(item.product_id)}
                    className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClerkDash;