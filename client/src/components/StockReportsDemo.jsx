import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Chart from "chart.js/auto";

// Mock Data
const mockStores = [
  { id: "", name: "All Stores" },
  { id: "1", name: "Nairobi Branch" },
  { id: "2", name: "Mombasa Branch" },
  { id: "3", name: "Kisumu Branch" },
];

const initialStockData = [
  { product: "Laptop", stock_in: 100, stock_out: 50, balance: 50 },
  { product: "Phone", stock_in: 200, stock_out: 150, balance: 50 },
  { product: "Tablet", stock_in: 150, stock_out: 80, balance: 70 },
  { product: "Headphones", stock_in: 300, stock_out: 200, balance: 100 },
  { product: "Charger", stock_in: 400, stock_out: 300, balance: 100 },
  { product: "Mouse", stock_in: 250, stock_out: 100, balance: 150 },
  { product: "Keyboard", stock_in: 180, stock_out: 90, balance: 90 },
  { product: "Monitor", stock_in: 120, stock_out: 60, balance: 60 },
  { product: "Speaker", stock_in: 90, stock_out: 40, balance: 50 },
  { product: "Webcam", stock_in: 60, stock_out: 30, balance: 30 },
];

// Simplified ReportsFilters
const ReportsFilters = ({ stores, onChange, onClick }) => {
  const [storeId, setStoreId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilterChange = () => {
    onChange({ storeId, startDate, endDate });
    onClick();
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <select
        value={storeId}
        onChange={(e) => setStoreId(e.target.value)}
        onBlur={handleFilterChange}
        className="border border-gray-300 rounded px-3 py-2 text-[#011638]"
        aria-label="Select store"
      >
        {stores.map((store) => (
          <option key={store.id} value={store.id}>{store.name}</option>
        ))}
      </select>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        onBlur={handleFilterChange}
        className="border border-gray-300 rounded px-3 py-2 text-[#011638]"
        aria-label="Start date"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        onBlur={handleFilterChange}
        className="border border-gray-300 rounded px-3 py-2 text-[#011638]"
        aria-label="End date"
      />
    </div>
  );
};

// Simplified ReportsTabToggle
const ReportsTabToggle = ({ value, onToggle, onClick }) => (
  <div className="flex gap-4 mb-4">
    <button
      onClick={() => { onClick(); onToggle(false); }}
      className={`px-4 py-2 rounded ${!value ? "bg-[#ec4e20] text-white" : "bg-gray-200 text-[#011638]"}`}
      aria-label="Show table"
    >
      Table
    </button>
    <button
      onClick={() => { onClick(); onToggle(true); }}
      className={`px-4 py-2 rounded ${value ? "bg-[#ec4e20] text-white" : "bg-gray-200 text-[#011638]"}`}
      aria-label="Show chart"
    >
      Chart
    </button>
  </div>
);

// Simplified NoDataFallback
const NoDataFallback = ({ message }) => (
  <p className="text-[#5e574d] text-center">{message}</p>
);

// Simplified ReportCard
const ReportCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="text-[#011638] font-bold">{title}</h3>
    <p className="text-[#5e574d] text-lg">{value}</p>
  </div>
);

// Simplified ReportExportButton
const ReportExportButton = ({ onCsvExport, onClick }) => (
  <button
    onClick={() => { onClick(); onCsvExport(); }}
    className="bg-[#ec4e20] text-white px-4 py-2 rounded hover:bg-[#d43f00]"
    aria-label="Export stock report as CSV"
  >
    Export CSV
  </button>
);

// Simplified StockMovementTable
const StockMovementTable = ({ data, onRemoveProduct, onClick }) => (
  <div className="bg-white p-4 rounded shadow overflow-x-auto">
    <table className="w-full text-[#011638]">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-left">Product</th>
          <th className="p-2 text-right">Stock In</th>
          <th className="p-2 text-right">Stock Out</th>
          <th className="p-2 text-right">Balance</th>
          <th className="p-2 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} className="border-t">
            <td className="p-2">{item.product}</td>
            <td className="p-2 text-right">{item.stock_in}</td>
            <td className="p-2 text-right">{item.stock_out}</td>
            <td className="p-2 text-right">{item.balance}</td>
            <td className="p-2 text-right">
              <button
                onClick={() => { onClick(); onRemoveProduct(index); }}
                className="text-red-600 hover:text-red-800"
                aria-label={`Remove ${item.product}`}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Simplified StockCharts
const StockCharts = ({ data, chartRefs }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    chartRefs.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map(item => item.product),
        datasets: [
          {
            label: "Stock In",
            data: data.map(item => item.stock_in),
            backgroundColor: "#ec4e20",
          },
          {
            label: "Stock Out",
            data: data.map(item => item.stock_out),
            backgroundColor: "#011638",
          },
          {
            label: "Balance",
            data: data.map(item => item.balance),
            backgroundColor: "#5e574d",
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } },
      },
    });

    return () => {
      if (chartRefs.current) chartRefs.current.destroy();
    };
  }, [data, chartRefs]);

  return <canvas ref={canvasRef} />;
};

// StockReportsDemo Component
const StockReportsDemo = () => {
  const [filters, setFilters] = useState({ storeId: "", startDate: "", endDate: "" });
  const [stockData, setStockData] = useState(initialStockData);
  const [filteredData, setFilteredData] = useState(initialStockData);
  const [showChart, setShowChart] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", stockIn: "", stockOut: "" });
  const chartRefs = useRef({});
  const chartContainerRef = useRef();
  const { pathname } = useLocation();
  const showToggle = pathname.includes("stock");
  const businessName = "Duka Smart Demo";

  const totalStockBalance = filteredData.reduce((sum, entry) => sum + (Number(entry.balance) || 0), 0);

  const handleClick = () => {
    if (clickCount >= 9) {
      setIsLocked(true);
    } else {
      setClickCount(prev => prev + 1);
    }
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["Product,Stock In,Stock Out,Balance", ...filteredData.map(e => `${e.product},${e.stock_in},${e.stock_out},${e.balance}`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "stock_report_demo.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.stockIn && newProduct.stockOut) {
      const newItem = {
        product: newProduct.name,
        stock_in: Number(newProduct.stockIn),
        stock_out: Number(newProduct.stockOut),
        balance: Number(newProduct.stockIn) - Number(newProduct.stockOut),
      };
      setStockData([...stockData, newItem]);
      setNewProduct({ name: "", stockIn: "", stockOut: "" });
      handleClick();
    }
  };

  const handleRemoveProduct = (index) => {
    setStockData(stockData.filter((_, i) => i !== index));
  };

  useEffect(() => {
    let filtered = stockData;
    if (filters.storeId) {
      filtered = filtered.map(item => ({
        ...item,
        stock_in: Math.round(item.stock_in * (filters.storeId === "1" ? 0.8 : filters.storeId === "2" ? 0.9 : 1.0)),
        stock_out: Math.round(item.stock_out * (filters.storeId === "1" ? 0.8 : filters.storeId === "2" ? 0.9 : 1.0)),
        balance: Math.round((item.stock_in - item.stock_out) * (filters.storeId === "1" ? 0.8 : filters.storeId === "2" ? 0.9 : 1.0)),
      }));
    }
    if (filters.startDate) {
      filtered = filtered.map(item => ({ ...item, stock_in: Math.round(item.stock_in * 0.9), stock_out: Math.round(item.stock_out * 0.9), balance: Math.round(item.balance * 0.9) }));
    }
    if (filters.endDate) {
      filtered = filtered.map(item => ({ ...item, stock_in: Math.round(item.stock_in * 0.95), stock_out: Math.round(item.stock_out * 0.95), balance: Math.round(item.balance * 0.95) }));
    }
    setFilteredData(filtered);
  }, [filters, stockData]);

  return (
    <div className="relative max-w-5xl mx-auto p-4">
      {isLocked && (
        <div className="absolute inset-0 bg-black/50  flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-[#011638] text-xl font-bold mb-4">Enjoying the tools?</h2>
            <p className="text-[#5e574d] mb-4">Create your account to get the full experience with even more powerful features!</p>
            <Link
              to="/signup"
              className="bg-[#ec4e20] text-white px-6 py-2 rounded hover:bg-[#d43f00]"
              aria-label="Sign up for Duka Smart"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      )}
      <div className={isLocked ? "pointer-events-none opacity-50" : ""}>
        <h1 className="text-2xl font-bold text-[#011638] mb-4">Stock Reports Demo</h1>
        <div className="mb-4">
          <ReportsFilters stores={mockStores} onChange={setFilters} onClick={handleClick} />
        </div>
        <div className="mb-4">
          <form onSubmit={handleAddProduct} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 text-[#011638]"
              aria-label="New product name"
            />
            <input
              type="number"
              placeholder="Stock In"
              value={newProduct.stockIn}
              onChange={(e) => setNewProduct({ ...newProduct, stockIn: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 text-[#011638]"
              aria-label="Stock in quantity"
            />
            <input
              type="number"
              placeholder="Stock Out"
              value={newProduct.stockOut}
              onChange={(e) => setNewProduct({ ...newProduct, stockOut: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 text-[#011638]"
              aria-label="Stock out quantity"
            />
            <button
              type="submit"
              onClick={handleClick}
              className="bg-[#ec4e20] text-white px-4 py-2 rounded hover:bg-[#d43f00]"
              aria-label="Add new product"
            >
              Add Product
            </button>
          </form>
        </div>
        {filteredData.length > 0 && showToggle && (
          <ReportsTabToggle value={showChart} onToggle={(value) => { handleClick(); setShowChart(value); }} onClick={handleClick} />
        )}
        {filteredData.length === 0 ? (
          <NoDataFallback message="No stock data available. Add a product to start!" />
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
              <ReportCard title="Total Stock Balance" value={`${totalStockBalance.toLocaleString()} units`} />
              <div>
                <ReportExportButton onCsvExport={handleExportCSV} onClick={handleClick} />
              </div>
            </div>
            <div className={`${showChart ? "relative" : "absolute"} w-full ${showChart ? "" : "h-0 overflow-hidden"}`}>
              <div ref={chartContainerRef} className="bg-white p-4 rounded shadow w-full box-border">
                <StockCharts data={filteredData} chartRefs={chartRefs} />
              </div>
            </div>
            {showChart || <StockMovementTable data={filteredData} onRemoveProduct={handleRemoveProduct} onClick={handleClick} />}
          </>
        )}
      </div>
    </div>
  );
};

export default StockReportsDemo;