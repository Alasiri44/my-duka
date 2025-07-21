import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [entries, setEntries] = useState([]);
  const [exits, setExits] = useState([]);
  const [batches, setBatches] = useState([]);
  const [chartType, setChartType] = useState('bar'); // bar | pie | line

  useEffect(() => {
    const fetchData = async () => {
      const productRes = await axios.get(`http://localhost:3001/products/${productId}`);
      const entriesRes = await axios.get(`http://localhost:3001/stock_entries?product_id=${productId}`);
      const exitsRes = await axios.get(`http://localhost:3001/stock_exits?product_id=${productId}`);
      const batchesRes = await axios.get('http://localhost:3001/batches');

      setProduct(productRes.data);
      setEntries(entriesRes.data);
      setExits(exitsRes.data);

      const relatedBatchIds = [...new Set([...entriesRes.data, ...exitsRes.data].map(e => e.batch_id))];
      const relatedBatches = batchesRes.data.filter(b => relatedBatchIds.includes(b.id));
      setBatches(relatedBatches);
    };

    fetchData();
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  const totalReceived = entries.reduce((sum, e) => sum + e.quantity_received, 0);
  const totalSold = exits.reduce((sum, e) => sum + e.quantity, 0);
  const currentStock = totalReceived - totalSold;

  const chartData = {
    labels: ['Received', 'Sold'],
    datasets: [
      {
        label: 'Quantity',
        data: [totalReceived, totalSold],
        backgroundColor: ['#3b82f6', '#f87171'],
        borderColor: ['#3b82f6', '#f87171'],
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: chartType !== 'pie' },
      title: { display: true, text: 'Stock Overview' },
    },
  };

  const renderChart = () => {
    if (chartType === 'bar') return <Bar data={chartData} options={chartOptions} />;
    if (chartType === 'pie') return <Pie data={chartData} options={chartOptions} />;
    if (chartType === 'line') return <Line data={chartData} options={chartOptions} />;
    return null;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{product.name}</h1>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-sm text-gray-700 mb-4">
        <strong>Selling Price:</strong> KES {product.selling_price}
      </p>

      <div className="mb-4">
        <label htmlFor="chartType" className="mr-2 font-medium">Select Chart:</label>
        <select
          id="chartType"
          className="border border-gray-300 rounded px-3 py-1"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="line">Line Chart</option>
        </select>
      </div>

      <div className="mb-6">
        {renderChart()}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Stock Summary</h2>
        <p>Total Received: {totalReceived}</p>
        <p>Total Sold: {totalSold}</p>
        <p>Current Stock: {currentStock}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Stock Entries</h2>
        <ul className="list-disc list-inside">
          {entries.map(entry => (
            <li key={entry.id}>
              Qty: {entry.quantity_received}, Status: {entry.payment_status}, Method: {entry.payment_method}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Stock Exits</h2>
        <ul className="list-disc list-inside">
          {exits.map(exit => (
            <li key={exit.id}>
              Qty: {exit.quantity}, Reason: {exit.reason}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Related Batches</h2>
        <ul className="list-disc list-inside">
          {batches.map(batch => (
            <li key={batch.id}>
              Batch ID: {batch.id}, Direction: {batch.direction}, Party: {batch.party}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductDetail;
