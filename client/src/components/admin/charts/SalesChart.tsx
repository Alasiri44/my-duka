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

type SaleData = {
  week: string;
  sales: number;
};

type Props = {
  storeId: number;
};

const SalesChart: React.FC<Props> = ({ storeId }) => {
  const [data, setData] = useState<SaleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;

    const fetchSales = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/sales?store_id=${storeId}`);
        const salesByWeek = res.data.reduce((acc: any, sale: any) => {
          const date = new Date(sale.date);
          const week = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
          acc[week] = (acc[week] || 0) + sale.amount;
          return acc;
        }, {});

        const formatted = Object.entries(salesByWeek).map(([week, sales]) => ({
          week,
          sales,
        }));

        setData(formatted);
        setLoading(false);
      } catch (err) {
        console.error("Error loading sales data", err);
        setLoading(false);
      }
    };

    fetchSales();
  }, [storeId]);

  if (loading) return <p className="p-4">Loading sales data...</p>;
  if (!data.length) return <p className="p-4 text-gray-500">No sales data available.</p>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Weekly Sales</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
