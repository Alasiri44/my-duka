import React, { useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title
);

const COLORS = ["#2563eb", "#10b981", "#f59e0b"];

const StoreComparisonChart = ({ data, chartRefs }) => {
  const salesRef = useRef(null);
  const entriesRef = useRef(null);
  const exitsRef = useRef(null);

  if (chartRefs) {
    chartRefs.salesRef = salesRef;
    chartRefs.entriesRef = entriesRef;
    chartRefs.exitsRef = exitsRef;
  }

  if (!data || data.length === 0) {
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

  const salesData = {
    labels: data.map(e => e.store_name || "Unknown"),
    datasets: [
      {
        label: "Total Sales",
        data: data.map(e => Number(e.total_sales) || 0),
        backgroundColor: COLORS[0],
      },
    ],
  };

  const entriesData = {
    labels: data.map(e => e.store_name || "Unknown"),
    datasets: [
      {
        label: "Total Stock Entries",
        data: data.map(e => Number(e.total_entries) || 0),
        backgroundColor: COLORS[1],
      },
    ],
  };

  const exitsData = {
    labels: data.map(e => e.store_name || "Unknown"),
    datasets: [
      {
        label: "Total Stock Exits",
        data: data.map(e => Number(e.total_exits) || 0),
        backgroundColor: COLORS[2],
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: "y",
    animation: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => {
            const value = ctx.parsed.x || 0;
            const label = ctx.dataset.label;
            return label === "Total Sales"
              ? `KES ${Number(value).toLocaleString()}`
              : value.toLocaleString();
          },
        },
      },
      legend: { display: true },
    },
    scales: {
      x: {
        ticks: {
          callback: val => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val),
        },
      },
      y: {
        ticks: {
          callback: val => val,
        },
      },
    },
  };

  const salesOptions = {
    ...options,
    scales: {
      ...options.scales,
      x: {
        ticks: {
          callback: val => `KES ${Number(val).toLocaleString()}`,
        },
      },
    },
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
        <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem", width: "100%" }}>
          <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Sales by Store</h3>
          <div style={{ height: "400px", width: "100%" }}>
            <Bar ref={salesRef} data={salesData} options={salesOptions} />
          </div>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem", width: "100%" }}>
          <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Stock Entries by Store</h3>
          <div style={{ height: "400px", width: "100%" }}>
            <Bar ref={entriesRef} data={entriesData} options={options} />
          </div>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem", width: "100%" }}>
          <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Stock Exits by Store</h3>
          <div style={{ height: "400px", width: "100%" }}>
            <Bar ref={exitsRef} data={exitsData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreComparisonChart;