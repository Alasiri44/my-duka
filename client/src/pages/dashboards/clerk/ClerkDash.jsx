import React, { useEffect, useState } from 'react';
import StatCard from '../../../components/clerk/StatCard';
import {
  FaDropbox, FaExclamationTriangle, FaMoneyBill, FaBoxOpen
} from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import QuickActions from '../../../components/clerk/QuickActionClerk';

const API_URL = 'http://127.0.0.1:5000';

const ClerkDash = () => {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    stockEntries: 0,
    stockExits: 0,
    batches: 0,
    inventoryValue: 0,
    spoiltItems: 0,
  });

  const [recentProducts, setRecentProducts] = useState([]);
  const [clerk, setClerk] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const getQuantityColor = (qty) => {
    if (qty < 10) return 'text-red-600';
    if (qty >= 10 && qty <= 20) return 'text-orange-500';
    return 'text-black';
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          return;
        }
        const user = JSON.parse(userStr);
        setClerk(user);

        // Get store details
        const storeRes = await axios.get(`${API_URL}/store/${user.store_id}`);
        const store = storeRes.data;
        setStore(store);

        const storeId = user.store_id;

        const [
          categoriesRes,
          productsRes,
          stockEntriesRes,
          stockExitsRes,
          batchesRes
        ] = await Promise.all([
          axios.get(`${API_URL}/category`), // No store filter in backend, fetch all
          axios.get(`${API_URL}/product/store/${storeId}`),
          axios.get(`${API_URL}/stock_entries?store_id=${storeId}`),
          axios.get(`${API_URL}/stock_exits?store_id=${storeId}`),
          axios.get(`${API_URL}/batches?store_id=${storeId}`)
        ]);

        setProducts(productsRes.data);

        const inventoryValue = stockEntriesRes.data.reduce((total, entry) => {
          return total + (entry.quantity_received * entry.buying_price);
        }, 0);

        const spoiltItems = stockExitsRes.data.filter(exit =>
          exit.reason?.toLowerCase().includes('damage') || exit.reason?.toLowerCase().includes('spoil')
        ).length;

        const totalStockQty = productsRes.data.reduce((sum, p) => {
          return sum + (p.quantity || 0);
        }, 0);


        setStats({
          categories: categoriesRes.data.length,
          products: totalStockQty,
          stockEntries: stockEntriesRes.data.length,
          stockExits: stockExitsRes.data.length,
          batches: batchesRes.data.length,
          inventoryValue,
          spoiltItems,
        });

        // Get low stock products
        const lowStock = productsRes.data.filter(
          p => p.stock_quantity !== undefined && p.stock_quantity <= 20
        );
        setLowStockProducts(lowStock);

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

  const handleGoToProductDetail = (productId) => {
    navigate(`/clerk/inventory/products/${productId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Clerk Dashboard</h1>
          <p className="text-gray-400">Manage your Inventory and Track your Stock Records</p>
        </div>
      </div>

      {clerk && store && (
        <div className="mb-4 text-sm text-gray-600">
          <span className="font-medium">Welcome {clerk.first_name} {clerk.last_name}</span> &mdash; working at <span className="font-semibold text-indigo-600">{store.name}</span>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Products" value={stats.products} icon={<FaDropbox />} desc="Items in the inventory" bg="bg-white-100" text="text-blue-500" />
        <StatCard title="Inventory Value" value={`KES ${stats.inventoryValue.toLocaleString()}`} icon={<FaMoneyBill />} desc="Current stock value" bg="bg-white-100" text="text-green-700" />
        <StatCard title="Spoilt Items" value={stats.spoiltItems} icon={<FaExclamationTriangle />} desc="Damaged/Expired items" bg="bg-white-100" text="text-rose-900" />
      </div>

      {/* Low Stock & Recent Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Low Stock List */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <FaBoxOpen /> Low Stock Products
          </h2>

          {lowStockProducts.length === 0 ? (
            <p className="text-gray-500">All products are well stocked.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-2 border">Product Name</th>
                    <th className="p-2 border">Stock Quantity</th>
                    <th className="p-2 border">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="p-2 border">{product.name}</td>
                      <td className={`p-2 border font-bold ${getQuantityColor(product.stock_quantity)}`}>
                        {product.stock_quantity}
                      </td>
                      <td className="p-2 border">{product.category || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
      <QuickActions/>
    </div>
  );
};

export default ClerkDash;
