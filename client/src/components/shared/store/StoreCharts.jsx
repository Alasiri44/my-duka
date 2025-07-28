import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  PieChart,
  Legend,
  Pie,
  Cell,
  BarChart,
  AreaChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const StoreCharts = ({ charts }) => {
  const COLORS = ["#2D9CDB", "#ec4e20", "#011638", "#f4a261", "#6a0572", "#5e574d"];
  const {
    stock_in_by_day = [],
    top_products = [],
    restock_priority = [],
    weekly_spend = [],
    stock_breakdown_by_date = {},
  } = charts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
      {/* Chart 1: Daily Sales (last 30 days) */}
<div className="bg-white p-4 rounded-xl border border-[#f2f0ed] shadow-sm col-span-1 xl:col-span-2">
  <h3 className="text-sm font-semibold text-[#011638] mb-2">Sales (last 30 days)</h3>
  <ResponsiveContainer width="100%" height={200}>
    <LineChart data={charts.daily_sales_last_30_days}>
      <XAxis dataKey="date" fontSize={10} />
      <YAxis fontSize={10} />
      <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
      <CartesianGrid strokeDasharray="3 3" />
      <Line type="monotone" dataKey="amount" stroke="#2D9CDB" strokeWidth={2} name="Sales" />
    </LineChart>
  </ResponsiveContainer>
</div>

      {/* Chart 2: Top Products */}
      <div className="bg-white p-4 rounded-xl border border-[#f2f0ed] shadow-sm">
        <h3 className="text-sm font-semibold text-[#011638] mb-2">Top 5 Products</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart layout="vertical" data={top_products}>
            <XAxis type="number" fontSize={10} />
            <YAxis type="category" dataKey="name" fontSize={10} width={80} />
            <Tooltip />
            <Bar dataKey="quantity" fill="#ec4e20" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 3: Restock Priority */}
      <div className="bg-white p-4 rounded-xl border border-[#f2f0ed] shadow-sm">
        <h3 className="text-sm font-semibold text-[#2d9cdb] mb-2">Restock Priority</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart layout="vertical" data={restock_priority}>
            <XAxis type="number" fontSize={10} />
            <YAxis type="category" dataKey="name" fontSize={10} width={80} />
            <Tooltip />
            <Bar dataKey="quantity" fill="#2D9CDB" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 4: Weekly Spend */}
      <div className="bg-white p-4 rounded-xl border border-[#f2f0ed] shadow-sm col-span-1 md:col-span-2">
        <h3 className="text-sm font-semibold text-[#011638] mb-2">Weekly Spend (KES)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weekly_spend}>
            <XAxis dataKey="week" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="paid" stroke="#2D9CDB" strokeWidth={2} name="Paid" />
            <Line type="monotone" dataKey="unpaid" stroke="#ec4e20" strokeWidth={2} name="Unpaid" />
          </LineChart>
        </ResponsiveContainer>
      </div>

        {/* Chart 5: Sales by Payment Method */}
        <div className="bg-white p-4 rounded-xl border border-[#f2f0ed] shadow-sm">
          <h3 className="text-sm font-semibold text-[#011638] mb-2">Sales by Payment Method</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={charts.sales_by_payment_method}
                dataKey="amount"
                nameKey="method"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={({ method, percent }) =>
                  `${method} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {charts.sales_by_payment_method.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `KES ${value.toLocaleString()}`}
                contentStyle={{ fontSize: "0.85rem" }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                iconType="circle"
                formatter={(value) => <span className="text-xs text-[#5e574d]">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      


    </div>
  );
};

export default StoreCharts;
