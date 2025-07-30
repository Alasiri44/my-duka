import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000"; 

const ProductStatusChart = ({ storeId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;

    setLoading(true);

    Promise.all([
      axios.get(`${API_BASE_URL}/store/${storeId}/products`),
      axios.get(`${API_BASE_URL}/stock_exits`),
    ])
      .then(([productsRes, exitsRes]) => {
        const products = productsRes.data;
        const exits = exitsRes.data;

        const statusMap = {};
        products.forEach((p) => {
          statusMap[p.id] = {
            name: p.name,
            Sold: 0,
            Spoilt: 0,
          };
        });

        // Aggregate exits
        exits.forEach((exit) => {
          const pid = exit.product_id;
          if (!statusMap[pid]) return; // skip unknown products

          if (exit.reason === "sold") {
            statusMap[pid].Sold += exit.quantity;
          } else if (
            exit.reason === "expired" ||
            exit.reason === "damaged"
          ) {
            statusMap[pid].Spoilt += exit.quantity;
          }
        });

        setData(Object.values(statusMap));
      })
      .catch((err) => {
        console.error("Error fetching product status data:", err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [storeId]);

  if (loading) return <p>Loading product status chart...</p>;
  if (data.length === 0) return <p>No product status data available.</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Sold" fill="#4CAF50" />
        <Bar dataKey="Spoilt" fill="#F44336" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProductStatusChart;