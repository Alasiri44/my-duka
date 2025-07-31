import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import { getISOWeek, getYear } from "date-fns";

const SalesChart = ({ storeId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!storeId) return;

    const fetchSales = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
        const res = await axios.get(
          `${API_BASE_URL}/sales?store_id=${storeId}`
        );

        // Debug: Log raw data
        console.log("Raw sales data:", res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
          console.log("First sale object:", res.data[0]);
        }

        const validSales = Array.isArray(res.data)
          ? res.data.filter(
              (sale) => {
                const dateField = sale.date || sale.created_at;
                const amountField = sale.total_amount;
                return (
                  sale &&
                  dateField &&
                  !isNaN(new Date(dateField)) &&
                  (typeof amountField === "number" || !isNaN(Number(amountField)))
                );
              }
            )
          : [];

        const salesByWeek = validSales.reduce((acc, sale) => {
          const dateField = sale.date || sale.created_at;
          const date = new Date(dateField);
          const week = `${getYear(date)}-W${getISOWeek(date)}`;
          const amount = typeof sale.total_amount === "number"
            ? sale.total_amount
            : Number(sale.total_amount);
          acc[week] = (acc[week] || 0) + amount;
          return acc;
        }, {});

        const formatted = Object.entries(salesByWeek)
          .sort(([weekA], [weekB]) => (weekA > weekB ? 1 : -1))
          .map(([week, sales]) => ({ week, sales }));

        setData(formatted);
      } catch (err) {
        setError("Failed to load sales data. Please try again later.");
        setData([]);
        console.error("Error loading sales data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [storeId]);

  if (loading) return <p className="p-4">Loading sales data...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!data.length)
    return <p className="p-4 text-gray-500">No sales data available.</p>;

  const totalSales = data.reduce((sum, d) => sum + d.sales, 0);
  if (totalSales === 0)
    return <p className="p-4 text-gray-500">No meaningful sales data yet.</p>;

  const renderChart = () => (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Weekly Sales</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="week"
            tickFormatter={(week) => {
              const [year, weekNum] = week.split("-W");
              return `W${weekNum}/${year.slice(2)}`;
            }}
          />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return renderChart();
};

export default SalesChart;