import React from "react";
import {
  ResponsiveContainer,
  LineChart,
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
  const {
    stock_in_by_day = [],
    top_products = [],
    restock_priority = [],
    weekly_spend = [],
    stock_breakdown_by_date = {},
  } = charts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
      {/* Chart 1: Stock In (last 30 days) */}
      <div className="bg-white p-4 rounded-xl border border-[#f2f0ed] shadow-sm col-span-1 xl:col-span-2">
        <h3 className="text-sm font-semibold text-[#011638] mb-2">Stock In (last 30 days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={stock_in_by_day}>
            <defs>
              <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#011638" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#011638" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const breakdown = stock_breakdown_by_date[label];
                  return (
                    <div className="bg-white p-2 shadow rounded border text-sm">
                      <p className="font-semibold text-[#011638]">{label}</p>
                      <p className="text-[#011638]">Total: {payload[0].value}</p>
                      {breakdown && (
                        <ul className="mt-1">
                          {Object.entries(breakdown).map(([name, qty]) => (
                            <li key={name} className="text-[#5e574d]">
                              {name}: {qty}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area type="monotone" dataKey="quantity" stroke="#011638" fillOpacity={1} fill="url(#colorQty)" />
          </AreaChart>
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
    </div>
  );
};

export default StoreCharts;
