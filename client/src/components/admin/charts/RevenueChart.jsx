import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import axios from "axios";

const API_BASE = "http://127.0.0.1:5000"; // Adjust port as needed

const RevenueChart = ({ storeId }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Optionally add storeId as a query param if your backend supports filtering by store
    const entriesUrl = `${API_BASE}/stock_entries${storeId ? `?store_id=${storeId}` : ""}`;
    const exitsUrl = `${API_BASE}/stock_exits${storeId ? `?store_id=${storeId}` : ""}`;

    Promise.all([
      axios.get(entriesUrl),
      axios.get(exitsUrl)
    ])
      .then(([entriesRes, exitsRes]) => {
        // Calculate total buying from stock_entries
        const totalBuying = entriesRes.data.reduce(
          (sum, item) => sum + ((item.buying_price || 0) * (item.quantity || 0)),
          0
        );
        // Calculate total selling from stock_exits
        const totalSelling = exitsRes.data.reduce(
          (sum, item) => sum + ((item.selling_price || 0) * (item.quantity || 0)),
          0
        );
        setChartData([
          { name: "Revenue", Buying: totalBuying, Selling: totalSelling }
        ]);
      })
      .catch((err) => {
        console.error("Error fetching revenue data:", err);
        setChartData([]);
      })
      .finally(() => setLoading(false));
  }, [storeId]);

  if (loading) return <p>Loading revenue chart...</p>;
  if (chartData.length === 0) return <p>No revenue data available.</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Buying" fill="#2196F3" />
        <Bar dataKey="Selling" fill="#FFC107" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;