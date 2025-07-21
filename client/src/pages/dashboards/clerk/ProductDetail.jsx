import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart, Line,
  PieChart, Pie, Cell,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d'];

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [entries, setEntries] = useState([]);
  const [exits, setExits] = useState([]);
  const [batches, setBatches] = useState([]);
  const [mpesa, setMpesa] = useState([]);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    const fetchData = async () => {
      const productRes = await axios.get(`http://localhost:3001/products/${productId}`);
      const entriesRes = await axios.get(`http://localhost:3001/stock_entries?product_id=${productId}`);
      const exitsRes = await axios.get(`http://localhost:3001/stock_exits?product_id=${productId}`);
      const batchesRes = await axios.get('http://localhost:3001/batches');
      const mpesaRes = await axios.get('http://localhost:3001/mpesa_transactions');

      const productBatches = batchesRes.data.filter(b => 
        entriesRes.data.some(e => e.batch_id === b.id || b.product_id === productId)
      );
      const productMpesa = mpesaRes.data.filter(tx =>
        entriesRes.data.some(entry => entry.id === tx.stock_entry_id)
      );

      setProduct(productRes.data);
      setEntries(entriesRes.data);
      setExits(exitsRes.data);
      setBatches(productBatches);
      setMpesa(productMpesa);
    };

    fetchData();
  }, [productId]);

  if (!product) return <p className="p-4">Loading...</p>;

  const chartData = [
    { name: 'Buys', quantity: entries.reduce((sum, e) => sum + e.quantity_received, 0) },
    { name: 'Sales', quantity: exits.reduce((sum, e) => sum + e.quantity, 0) }
  ];

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="quantity" stroke="#8884d8" fillOpacity={1} fill="url(#colorQty)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'pie':
      default:
        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Tooltip />
              <Pie data={chartData} dataKey="quantity" nameKey="name" outerRadius={100} label>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-gray-800 font-semibold mt-2">KES {product.selling_price?.toFixed(2)}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Stock Entries (Buys)</h3>
          <ul className="space-y-1">
            {entries.map(entry => (
              <li key={entry.id} className="text-sm text-gray-700 border-b py-1">
                {entry.quantity_received} units at KES {entry.buying_price} - {entry.payment_status}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Stock Exits (Sales)</h3>
          <ul className="space-y-1">
            {exits.map(exit => (
              <li key={exit.id} className="text-sm text-gray-700 border-b py-1">
                {exit.quantity} units at KES {exit.selling_price}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Batches</h3>
          <ul className="space-y-1">
            {batches.map(batch => (
              <li key={batch.id} className="text-sm text-gray-700 border-b py-1">
                {batch.party} - {batch.direction}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">MPESA Transactions</h3>
          <ul className="space-y-1">
            {mpesa.map(tx => (
              <li key={tx.id} className={`text-sm border-b py-1 ${tx.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.transaction_code} - {tx.status.toUpperCase()} (KES {tx.amount})
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-md p-4">
        <div className="mb-4">
          <label className="block text-sm text-gray-600 font-medium mb-1">Chart Type</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="area">Area Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>
        <div className="w-full h-[250px]">
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
