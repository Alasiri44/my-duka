import React, { useMemo } from "react";
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
import { startOfWeek, endOfWeek, format, parseISO } from "date-fns";

const StoreCharts = ({ entries = [], products = [] }) => {
  const {
    stockInOutChart,
    topProductsChart,
    restockPriorityChart,
    weeklySpendChart,
    stockBreakdownByDate,
  } = useMemo(() => {
    const stockByDay = {};
    const spendByWeek = {};
    const productTotals = {};
    const currentStock = {};
    const productMap = Object.fromEntries(products.map((p) => [Number(p.id), p.name]));
    const breakdownByDate = {};

    entries.forEach((entry) => {
      const date = new Date(entry.created_at);
      const dayKey = date.toISOString().slice(0, 10);
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
      const weekKey = `${format(weekStart, "MMM d")} – ${format(weekEnd, "MMM d")}`;

      // Stock in chart
      stockByDay[dayKey] = (stockByDay[dayKey] || 0) + entry.quantity_received;

      // Weekly spend
      if (!spendByWeek[weekKey]) {
        spendByWeek[weekKey] = { week: weekKey, paid: 0, unpaid: 0 };
      }
      const spendAmount = entry.quantity_received * entry.buying_price;
      if (entry.payment_status === "paid") {
        spendByWeek[weekKey].paid += spendAmount;
      } else if (entry.payment_status === "unpaid") {
        spendByWeek[weekKey].unpaid += spendAmount;
      }

      // Top products by entry quantity
      productTotals[entry.product_id] = (productTotals[entry.product_id] || 0) + entry.quantity_received;

      // For restock: track current quantity (assumes net received)
      currentStock[entry.product_id] = (currentStock[entry.product_id] || 0) + entry.quantity_received;

      // Breakdown by date for stock-in chart
      if (!breakdownByDate[dayKey]) breakdownByDate[dayKey] = {};
      const name = productMap[Number(entry.product_id)] || "Unknown";
      breakdownByDate[dayKey][name] = (breakdownByDate[dayKey][name] || 0) + entry.quantity_received;
    });

    const stockInOutChart = Object.entries(stockByDay)
      .sort()
      .map(([date, quantity]) => ({ date, quantity }));

    const weeklySpendChart = Object.values(spendByWeek).sort((a, b) =>
      a.week.localeCompare(b.week)
    );

    const topProductsChart = Object.entries(productTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([productId, quantity]) => {
        const name = productMap[Number(productId)] || "Unknown";
        return { name, quantity };
      });

    const restockPriorityChart = Object.entries(currentStock)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 5)
      .map(([productId, quantity]) => {
        const name = productMap[Number(productId)] || "Unknown";
        return { name, quantity };
      });

    return {
      stockInOutChart,
      topProductsChart,
      restockPriorityChart,
      weeklySpendChart,
      stockBreakdownByDate: breakdownByDate,
    };
  }, [entries, products]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
      {/* Chart 1: Stock In */}
      <div className="bg-white p-4 rounded-xl border border-[#f2f0ed] shadow-sm col-span-1 xl:col-span-2">
        <h3 className="text-sm font-semibold text-[#011638] mb-2">Stock In (last 30 days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={stockInOutChart}>
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
                  const breakdown = stockBreakdownByDate[label];
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
          <BarChart layout="vertical" data={topProductsChart}>
            <XAxis type="number" fontSize={10} />
            <YAxis type="category" dataKey="name" fontSize={10} width={80} />
            <Tooltip />
            <Bar dataKey="quantity" fill="#ec4e20" />
          </BarChart>
        </ResponsiveContainer>
      </div>



      {/* Chart 4: Weekly Spend */}
      <div className="bg-white p-4 rounded-xl border border-[#f2f0ed] shadow-sm col-span-1 md:col-span-2">
        <h3 className="text-sm font-semibold text-[#011638] mb-2">Weekly Spend (KES)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weeklySpendChart}>
            <XAxis dataKey="week" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="paid" stroke="#2D9CDB" strokeWidth={2} name="Paid" />
            <Line type="monotone" dataKey="unpaid" stroke="#ec4e20" strokeWidth={2} name="Unpaid" />
          </LineChart>
        </ResponsiveContainer>
      </div>

            {/* Chart 3: Restock Priority */}
      <div className="bg-white p-4 rounded-xl border border-[#f2f0ed] shadow-sm">
        <h3 className="text-sm font-semibold text-[#2d9cdb] mb-2">Restock Priority</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart layout="vertical" data={restockPriorityChart}>
            <XAxis type="number" fontSize={10} />
            <YAxis type="category" dataKey="name" fontSize={10} width={80} />
            <Tooltip />
            <Bar dataKey="quantity" fill="#2D9CDB" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StoreCharts;
