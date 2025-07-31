import React, { useRef } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Title
);

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const SalesCharts = ({ data, chartRefs }) => {
  const lineRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);

  // Update chartRefs with the refs
  if (chartRefs) {
    chartRefs.lineRef = lineRef;
    chartRefs.pieRef = pieRef;
    chartRefs.barRef = barRef;
  }

  if (!data || !data.trend || data.trend.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          color: "#6b7280",
          border: "1px dashed #d1d5db",
          borderRadius: "0.375rem",
          padding: "1.5rem",
        }}
      >
        No chart data available
      </div>
    );
  }

  const lineData = {
    labels: data.trend.map(e => e.date || "N/A"),
    datasets: [
      {
        label: "Total Sales",
        data: data.trend.map(e => Number(e.total_sales) || 0),
        fill: false,
        borderColor: "#2563eb",
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: data.by_payment.map(e => e.method || "Unknown"),
    datasets: [
      {
        label: "Total",
        data: data.by_payment.map(e => Number(e.total) || 0),
        backgroundColor: COLORS,
      },
    ],
  };

  const barData = {
    labels: data.by_store.map(e => e.store_name || "Unknown"),
    datasets: [
      {
        label: "Total Sales",
        data: data.by_store.map(e => {
          const value = Number(e.total_sales);
          console.log("Bar Data Value:", e.store_name, e.total_sales, value);
          return Number.isNaN(value) ? 0 : value;
        }),
        backgroundColor: "#10b981",
      },
    ],
  };

  console.log("barData:", barData);

  const lineOptions = {
    responsive: true,
    animation: false, // Disable animations for reliable export
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => {
            const value = ctx.parsed.y || ctx.parsed || 0;
            console.log("Line/Pie Tooltip Value:", ctx.dataset.label, value, ctx.raw);
            return `KES ${Number(value).toLocaleString()}`;
          },
        },
      },
      legend: { display: true },
    },
    scales: {
      y: {
        ticks: {
          callback: val => `KES ${Number(val).toLocaleString()}`,
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    indexAxis: "y",
    animation: false, // Disable animations for reliable export
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => {
            const value = ctx.parsed.x || 0;
            console.log("Bar Tooltip Value:", ctx.dataset.label, value, ctx.raw);
            return `KES ${Number(value).toLocaleString()}`;
          },
        },
      },
      legend: { display: true },
    },
    scales: {
      x: {
        ticks: {
          callback: val => `KES ${Number(val).toLocaleString()}`,
        },
      },
      y: {
        ticks: {
          callback: val => val,
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    animation: false, // Disable animations for reliable export
    plugins: { legend: { display: true } },
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        color: "#000000",
        padding: "1rem",
        borderRadius: "0.5rem",
      }}
    >
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4">
        <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem" }}>
          <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Sales Over Time</h3>
          <div style={{ height: "500px" }}>
            <Line ref={lineRef} data={lineData} options={lineOptions} />
          </div>
        </div>

        {data.by_payment.length > 0 && (
          <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem" }}>
            <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Sales by Payment Method</h3>
            <div style={{ height: "500px" }}>
              <Pie ref={pieRef} data={pieData} options={pieOptions} />
            </div>
          </div>
        )}

        {data.by_store.length > 0 && (
          <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem", width: "100%" }}>
            <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Sales by Store</h3>
            <div style={{ height: "400px", width: "100%" }}>
              <Bar ref={barRef} data={barData} options={barOptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesCharts;