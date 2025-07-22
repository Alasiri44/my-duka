import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import SupplyRequestModal from "../../../components/clerk/SupplyRequestModal";

const COLORS = ['#8884d8', '#82ca9d'];
const loggedInClerkId = 2;
const storeId = 1;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date) ? '—' : date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

const InfoCard = ({ title, children }) => (
  <div className="bg-white p-4 rounded shadow-md border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
    <div className="space-y-2 text-sm text-gray-700">{children}</div>
  </div>
);

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [entries, setEntries] = useState([]);
  const [exits, setExits] = useState([]);
  const [batches, setBatches] = useState([]);
  const [mpesa, setMpesa] = useState([]);
  const [clerks, setClerks] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [viewMode, setViewMode] = useState('clerk');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [
        productRes, entriesRes, exitsRes, batchesRes, mpesaRes, clerksRes
      ] = await Promise.all([
        axios.get(`http://localhost:3001/products/${productId}`),
        axios.get(`http://localhost:3001/stock_entries?product_id=${productId}`),
        axios.get(`http://localhost:3001/stock_exits?product_id=${productId}`),
        axios.get('http://localhost:3001/batches'),
        axios.get('http://localhost:3001/mpesa_transactions'),
        axios.get('http://localhost:3001/users?role=clerk')
      ]);
      setProduct(productRes.data);
      setEntries(entriesRes.data);
      setExits(exitsRes.data);
      setBatches(batchesRes.data);
      setMpesa(mpesaRes.data);
      setClerks(clerksRes.data);
    };
    fetchData();
  }, [productId]);

  const batchMap = useMemo(() => Object.fromEntries(batches.map(b => [b.id, b])), [batches]);
  const clerkMap = useMemo(() => Object.fromEntries(clerks.map(c => [c.id, c.name])), [clerks]);

  const filteredEntries = entries.filter(entry => {
    const batch = batchMap[entry.batch_id];
    if (viewMode === 'clerk') return entry.clerk_id === loggedInClerkId;
    if (viewMode === 'store') return batch?.store_id === storeId;
    return true;
  });

  const filteredExits = exits.filter(exit => {
    const batch = batchMap[exit.batch_id];
    if (viewMode === 'clerk') return exit.recorded_by === loggedInClerkId;
    if (viewMode === 'store') return batch?.store_id === storeId;
    return true;
  });

  const chartDataByDate = useMemo(() => {
    const dateMap = {};
    filteredEntries.forEach(entry => {
      const date = entry.created_at.slice(0, 10);
      if (!dateMap[date]) dateMap[date] = { date, Buys: 0, Sales: 0 };
      dateMap[date].Buys += entry.quantity_received;
    });
    filteredExits.forEach(exit => {
      const date = exit.created_at.slice(0, 10);
      if (!dateMap[date]) dateMap[date] = { date, Buys: 0, Sales: 0 };
      dateMap[date].Sales += exit.quantity;
    });
    return Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredEntries, filteredExits]);

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartDataByDate}>
              <XAxis dataKey="date" fontSize={10} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Buys" fill="#2D9CDB" />
              <Bar dataKey="Sales" fill="#ec4e20" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartDataByDate}>
              <defs>
                <linearGradient id="colorBuys" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2D9CDB" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2D9CDB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4e20" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ec4e20" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" fontSize={10} />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="Buys" stroke="#2D9CDB" fill="url(#colorBuys)" />
              <Area type="monotone" dataKey="Sales" stroke="#ec4e20" fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartDataByDate}>
              <XAxis dataKey="date" fontSize={10} />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Buys" stroke="#2D9CDB" />
              <Line type="monotone" dataKey="Sales" stroke="#ec4e20" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
      default:
        const summary = {
          Buys: filteredEntries.reduce((sum, e) => sum + e.quantity_received, 0),
          Sales: filteredExits.reduce((sum, e) => sum + e.quantity, 0),
        };
        const pieData = [
          { name: 'Buys', value: summary.Buys },
          { name: 'Sales', value: summary.Sales }
        ];
        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Tooltip />
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  if (!product) return <p className="p-6 text-lg">Loading product details...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="bg-white p-6 rounded shadow border">
        <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-gray-900 font-semibold mt-2 text-lg">Selling price: KES {product.selling_price?.toFixed(2)}</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 font-medium">Viewing:</label>
          <select value={viewMode} onChange={e => setViewMode(e.target.value)} className="border rounded px-2 py-1">
            <option value="clerk">Only My Transactions</option>
            <option value="store">All Store Transactions</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 font-medium">Chart Type:</label>
          <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="border rounded px-2 py-1">
            <option value="line">Line</option>
            <option value="bar">Bar</option>
            <option value="area">Area</option>
            <option value="pie">Pie</option>
          </select>
        </div>

        <button className="px-4 py-2 bg-indigo-600 text-white rounded shadow" onClick={() => setShowModal(true)}>
          Request Supply
        </button>
      </div>

      <InfoCard title="Stock Entries">
        <div className="grid grid-cols-7 gap-2 font-semibold text-gray-700 mb-2 text-sm">
          <div>Qty</div><div>Buy Price</div><div>Clerk</div><div>MPESA</div><div>Batch</div><div>Payment</div><div>Date</div>
        </div>
        {filteredEntries.map(entry => {
          const tx = mpesa.find(tx => Number(tx.stock_entry_id) === entry.id);
          const batch = batchMap[entry.batch_id] || {};
          const clerk = clerkMap[entry.clerk_id] || '—';
          return (
            <div key={entry.id} className="grid grid-cols-7 gap-2 text-sm border-b py-1">
              <div>{entry.quantity_received}</div>
              <div>KES {entry.buying_price}</div>
              <div>{clerk}</div>
              <div>{tx?.transaction_code || '—'}</div>
              <div>{batch.party || '—'}</div>
              <div>{entry.payment_status}</div>
              <div>{formatDate(entry.created_at)}</div>
            </div>
          );
        })}
      </InfoCard>

      <InfoCard title="Stock Exits">
        <div className="grid grid-cols-6 gap-2 font-semibold text-gray-700 mb-2 text-sm">
          <div>Qty</div><div>Sell Price</div><div>Clerk</div><div>Reason</div><div>Batch</div><div>Date</div>
        </div>
        {filteredExits.map(exit => {
          const batch = batchMap[exit.batch_id] || {};
          const clerk = clerkMap[exit.recorded_by] || '—';
          return (
            <div key={exit.id} className="grid grid-cols-6 gap-2 text-sm border-b py-1">
              <div>{exit.quantity}</div>
              <div>KES {exit.selling_price}</div>
              <div>{clerk}</div>
              <div>{exit.reason}</div>
              <div>{batch.party || '—'}</div>
              <div>{formatDate(exit.created_at)}</div>
            </div>
          );
        })}
      </InfoCard>

      <InfoCard title="Sales vs Buys">
        {renderChart()}
      </InfoCard>

      <SupplyRequestModal
        product={product}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default ProductDetail;

