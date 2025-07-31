import React, { useRef } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const TopSuppliersChart = ({ data, chartRefs }) => {
  const barRef = useRef(null);
  const pieRef = useRef(null);

  if (chartRefs) {
    chartRefs.barRef = barRef;
    chartRefs.pieRef = pieRef;
  }

  if (!data || !data.supplier_payments || data.supplier_payments.length === 0) {
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

  const barData = {
    labels: data.supplier_payments.map(s => s.supplier || "Unknown"),
    datasets: [
      {
        label: "Total Paid Amount",
        data: data.supplier_payments.map(s => Number(s.amount) || 0),
        backgroundColor: "#10b981",
      },
    ],
  };

  const pieData = {
    labels: data.procurement_spend.map(s => s.supplier || "Unknown"),
    datasets: [
      {
        label: "Total Spent",
        data: data.procurement_spend.map(s => Number(s.total_spent) || 0),
        backgroundColor: COLORS,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    indexAxis: "y",
    animation: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => {
            const value = ctx.parsed.x || 0;
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
    animation: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => {
            const value = ctx.parsed || 0;
            return `KES ${Number(value).toLocaleString()}`;
          },
        },
      },
      legend: { display: true },
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
        <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem" }}>
          <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Supplier Payments</h3>
          <div style={{ height: "400px", width: "100%" }}>
            <Bar ref={barRef} data={barData} options={barOptions} />
          </div>
        </div>

        {data.procurement_spend.length > 0 && (
          <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem" }}>
            <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Procurement Spend by Supplier</h3>
            <div style={{ height: "400px" }}>
              <Pie ref={pieRef} data={pieData} options={pieOptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopSuppliersChart;