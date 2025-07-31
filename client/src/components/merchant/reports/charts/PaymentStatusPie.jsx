import React, { useRef } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const PaymentStatusPie = ({ data, chartRefs }) => {
  const pieRef = useRef(null);

  // Update chartRefs with the ref
  if (chartRefs) {
    chartRefs.pieRef = pieRef;
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
        No payment status data available
      </div>
    );
  }

  const pieData = {
    labels: data.map(e => e.payment_status || "Unknown"),
    datasets: [
      {
        label: "Total Amount",
        data: data.map(e => Number.isNaN(Number(e.total)) ? 0 : Number(e.total)),
        backgroundColor: COLORS,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    animation: false, // Disable animations for reliable export
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
      <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Payment Status Distribution</h3>
      <div style={{ height: "500px" }}>
        <Pie ref={pieRef} data={pieData} options={pieOptions} />
      </div>
    </div>
  );
};

export default PaymentStatusPie;