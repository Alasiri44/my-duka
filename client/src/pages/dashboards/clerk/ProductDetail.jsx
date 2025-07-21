import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart, Line, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#4CAF50', '#F44336']; 

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [entries, setEntries] = useState([]);
  const [exits, setExits] = useState([]);
  const [batches, setBatches] = useState([]);
  const [supplyRequests, setSupplyRequests] = useState([]);
  const [mpesaTransactions, setMpesaTransactions] = useState([]);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    const fetchAll = async () => {
      const [productRes, entryRes, exitRes, batchRes, requestRes, mpesaRes] = await Promise.all([
        axios.get(`http://localhost:3001/products/${productId}`),
        axios.get(`http://localhost:3001/stock_entries?product_id=${productId}`),
        axios.get(`http://localhost:3001/stock_exits?product_id=${productId}`),
        axios.get(`http://localhost:3001/batches`),
        axios.get(`http://localhost:3001/supply_requests?product_id=${productId}`),
        axios.get(`http://localhost:3001/mpesa_transactions`)
      ]);

      setProduct(productRes.data);
      setEntries(entryRes.data);
      setExits(exitRes.data);
      setBatches(batchRes.data);
      setSupplyRequests(requestRes.data);

      const relatedTransactions = mpesaRes.data.filter(
        tx => entryRes.data.find(entry => entry.id === tx.stock_entry_id)
      );
      setMpesaTransactions(relatedTransactions);
    };

    fetchAll();
  }, [productId]);

  const chartData = [
    { name: 'Stock In', value: entries.reduce((sum, e) => sum + e.quantity_received, 0) },
    { name: 'Stock Out', value: exits.reduce((sum, e) => sum + e.quantity, 0) }
  ];

  return (
    <div className="flex flex-col md:flex-row p-6 gap-6">
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{product?.name}</h2>
        <p className="text-gray-600 mb-4">{product?.description}</p>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-600">Transactions</h3>
            <ul className="list-disc pl-6 text-sm text-gray-700">
              {entries.map(e => (
                <li key={`entry-${e.id}`}>
                  Entry: {e.quantity_received} pcs @ KES {e.buying_price} (Paid: {e.payment_status})
                </li>
              ))}
              {exits.map(e => (
                <li key={`exit-${e.id}`}>
                  Exit: {e.quantity} pcs @ KES {e.selling_price} ({e.reason})
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-600">Supply Requests</h3>
            <ul className="list-disc pl-6 text-sm text-gray-700">
              {supplyRequests.map(r => (
                <li key={r.id}>Qty: {r.quantity} (Status: {r.status})</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-600">MPESA Transactions</h3>
            <ul className="list-disc pl-6 text-sm text-gray-700">
              {mpesaTransactions.map(tx => (
                <li key={tx.id}>
                  {tx.transaction_code} - {tx.amount} ({tx.status})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full md:w-[400px]">
        <div className="mb-4">
          <label htmlFor="chartType" className="text-sm font-medium text-gray-700 mr-2">
            Chart Type:
          </label>
          <select
            id="chartType"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>

        <div className="bg-white shadow rounded p-4">
          {chartType === 'line' ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
