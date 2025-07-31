import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const colors = ['#011638', '#faae2b', '#4e8098', '#95a78d', '#e4572e'];

const BusinessOverview = () => {
  const { businessId } = useOutletContext();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/business/${businessId}/summary`)
      .then(res => {
        setSummary(res.data);
        setLoading(false);
      });
  }, [businessId]);

  if (loading || !summary) {
    return <div className="p-10 text-center text-gray-400 text-lg">Loading business overview...</div>;
  }

  const { business } = summary;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#011638]">{business.name}</h1>
        <p className="text-gray-600">
          {business.industry} business based in <strong>{business.location}</strong><br />
          Created on <span className="text-sm">{business.created_at}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Products" value={summary.total_products} />
        <Stat title="Stock Entries" value={summary.total_stock_entries} />
        <Stat title="Stock Exits" value={summary.total_stock_exits} />
        <Stat title="Stock Value" value={`KES ${summary.total_stock_value.toLocaleString()}`} />
        <Stat title="Stores" value={summary.total_stores} />
        <Stat title="Suppliers" value={summary.total_suppliers} />
        <Stat title="Users" value={summary.total_users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Stock Entries by Month">
          <BarChart width={400} height={250} data={summary.stock_entries_by_month}>
            <XAxis dataKey="month" stroke="#6e6d7a" />
            <YAxis stroke="#6e6d7a" />
            <Tooltip />
            <Bar dataKey="count" fill={colors[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Exits by Reason">
          <PieChart width={400} height={250}>
            <Pie
              data={summary.exits_by_reason}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {summary.exits_by_reason.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>
      </div>
      <div className="flex flex-col lg:flex-row gap-even justify-evenly border-lg:rounded-xl shadow-lg border border-[#d7d0c8] p-6 space-y-6 lg:space-y-0 lg:space-x-6">
        <ChartCard title="Top Products in Stock">
          <BarChart layout="vertical" width={500} height={300} data={summary.top_products}>
            <XAxis type="number" stroke="#6e6d7a" />
            <YAxis dataKey="name" type="category" width={120} stroke="#6e6d7a" />
            <Tooltip />
            <Bar dataKey="value" fill={colors[2]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Low Stock Products">
          <BarChart layout="vertical" width={500} height={300} data={summary.low_stock_products}>
            <XAxis type="number" stroke="#6e6d7a" />
            <YAxis dataKey="name" type="category" width={120} stroke="#6e6d7a" />
            <Tooltip />
            <Bar dataKey="value" fill="#e4572e" />
          </BarChart>
        </ChartCard>
      </div>

      <div className="bg-white rounded-xl shadow border p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#011638]">Stores Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2">Store</th>
                <th className="px-4 py-2">Users</th>
                <th className="px-4 py-2">Entries</th>
                <th className="px-4 py-2">Exits</th>
                <th className="px-4 py-2">Stock Value</th>
              </tr>
            </thead>
            <tbody>
              {summary.stores_summary.map((store) => (
                <tr key={store.store_id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{store.store_name}</td>
                  <td className="px-4 py-2">{store.total_users}</td>
                  <td className="px-4 py-2">{store.total_entries}</td>
                  <td className="px-4 py-2">{store.total_exits}</td>
                  <td className="px-4 py-2">KES {store.total_stock_value.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow border p-4 text-center">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-xl font-bold text-[#011638] mt-1">{value}</div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow border p-6">
    <h2 className="text-lg font-semibold text-[#011638] mb-3">{title}</h2>
    <div className="flex justify-center">{children}</div>
  </div>
);

export default BusinessOverview;