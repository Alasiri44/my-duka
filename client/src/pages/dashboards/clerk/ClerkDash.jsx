import React, { useEffect, useState } from 'react';
import StatCard from '../../../components/clerk/StatCard';
import {
  FaDropbox, FaLayerGroup, FaTruck, FaExclamationTriangle,
  FaMoneyBill, FaThLarge
} from 'react-icons/fa';
import axios from 'axios';

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
  const [recentExits, setRecentExits] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          categoriesRes,
          productsRes,
          stockEntriesRes,
          stockExitsRes,
          batchesRes,
          mpesaRes
        ] = await Promise.all([
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/stock_entries`),
          axios.get(`${API_URL}/stock_exits`),
          axios.get(`${API_URL}/batches`),
          axios.get(`${API_URL}/mpesa_transactions`)
        ]);

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
          .slice(-10) // get latest 10 in case some products repeat
          .reverse()
          .map(entry => {
            const product = productsRes.data.find(p => p.id === entry.product_id);
            return {
              id: entry.id,
              name: product?.name || 'Unknown Product',
              stock: entry.quantity_received,
              value: entry.quantity_received * entry.buying_price,
              spoilt: entry.spoilt || 0,
              status: entry.payment_status || 'unpaid',
              created_at: entry.created_at,
            };
          })
          .slice(0, 4); // only show the latest 4 items


        setRecentProducts(recentEntries);
        setRecentExits(stockExitsRes.data.slice(-5).reverse());

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Clerk Dashboard</h1>
      <p className="text-gray-400">Manage your Inventory and Track your Stock Records</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Products" value={stats.products} icon={<FaDropbox />} desc="Items in the inventory" bg="bg-white-100" text="text-blue-500" />
        <StatCard title="Inventory Value" value={`KES ${stats.inventoryValue.toLocaleString()}`} icon={<FaMoneyBill />} desc="current stock value" bg="bg-white-100" text="text-green-700" />
        <StatCard title="Spoilt Items" value={stats.spoiltItems} icon={<FaExclamationTriangle />} desc="damaged/ expired items" bg="bg-white-100" text="text-rose-900" />
        <StatCard title="Pending Txns" value={stats.pendingTxns} icon={<FaMoneyBill />} desc="transactions that haven't been cleared" bg="bg-white-100" text="text-orange-900" />
      </div>
      {/* Record Form & Recent Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Record New Items Form */}
        <div className="bg-white border border-gray-300 rounded-xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-1">Record New Items</h2>
          <p className="text-xs text-gray-500 mb-2">Enter details for newly received inventory items</p>

          <form className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700">Product Name *</label>
              <input type="text" className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm" placeholder="Enter product name" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Items Received *</label>
              <input type="number" className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm" defaultValue={0} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Spoilt Items</label>
              <input type="number" className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm" defaultValue={0} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Payment Status *</label>
              <select className="mt-1 w-full border border-gray-300 rounded-md p-1.5 text-sm">
                <option>Unpaid</option>
                <option>Paid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Buying Price ($)</label>
              <input type="number" className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm" step="0.01" defaultValue={0.00} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Selling Price ($)</label>
              <input type="number" className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm" step="0.01" defaultValue={0.00} />
            </div>

            <div className="col-span-full">
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1.5 rounded-md mt-1 text-sm">
                Record Item
              </button>
            </div>
          </form>
        </div>

        {/* Recent Inventory Display */}
        <div className="bg-white border border-gray-300 rounded-xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-1 text-black">Recent Inventory</h2>
          <p className="text-xs text-gray-500 mb-2">Latest items added to inventory</p>

          <div className="space-y-3">
            {recentProducts.slice(0, 4).map(item => (
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

