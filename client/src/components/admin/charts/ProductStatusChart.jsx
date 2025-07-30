
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import axios from "axios";

const ProductStatusChart = ({ storeId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3001/stocks?store_id=${storeId}`)
      .then((res) => {
        const sold = res.data.reduce((sum, item) => sum + (item.sold || 0), 0);
        const spoilt = res.data.reduce((sum, item) => sum + (item.spoilt || 0), 0);
        setData([{ name: "Product Status", Sold: sold, Spoilt: spoilt }]);
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
