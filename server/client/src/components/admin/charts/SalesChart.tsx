import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import dayjs from 'dayjs';

interface SalesChartProps {
  storeId: number;
}

interface SalePoint {
  name: string;
  stock: number;
}

const SalesChart: React.FC<SalesChartProps> = ({ storeId }) => {
  const [chartData, setChartData] = useState<SalePoint[]>([]);

  useEffect(() => {
    const fetchStoreSalesData = async () => {
      try {
        const [productsRes, exitsRes] = await Promise.all([
          axios.get('http://localhost:3000/products'),
          axios.get('http://localhost:3000/stock_exits'),
        ]);

        // Get product IDs for this store
        const storeProductIds = productsRes.data
          .filter((product: any) => product.store_id === storeId)
          .map((product: any) => product.id);

        // Get stock exits of type "sold" for those products
        const storeSales = exitsRes.data.filter(
          (exit: any) =>
            exit.reason === 'sold' && storeProductIds.includes(exit.product_id)
        );

        // Group and sum sales by month
        const monthlySales = storeSales.reduce((acc: any, sale: any) => {
          const month = dayjs(sale.created_at).format('MMM');
          const total = sale.quantity * sale.selling_price;
          acc[month] = (acc[month] || 0) + total;
          return acc;
        }, {});

        // Structure data in order of calendar months
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedData: SalePoint[] = monthOrder.map(month => ({
          name: month,
          stock: parseFloat((monthlySales[month] || 0).toFixed(2)),
        }));

        setChartData(formattedData);
      } catch (err) {
        console.error('Error loading sales data:', err);
      }
    };

    if (storeId) {
      fetchStoreSalesData();
    }
  }, [storeId]);

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-2">Monthly Sales Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="stock" stroke="#2D9CDB" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
