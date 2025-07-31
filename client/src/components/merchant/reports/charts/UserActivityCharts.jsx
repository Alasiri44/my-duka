import React, { useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const COLORS = ["#2563eb", "#10b981", "#f59e0b"];

const UserActivityCharts = ({ data, chartRefs }) => {
  const barRef = useRef(null);

  // Update chartRefs with the ref
  if (chartRefs) {
    chartRefs.barRef = barRef;
  }

  // Filter data for clerks only
  const clerkData = data.filter((user) => user.role?.toLowerCase() === "clerk");

  if (!clerkData || clerkData.length === 0) {
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
        No clerk activity data available for charting
      </div>
    );
  }

  const chartData = {
    labels: clerkData.map((e) => e.user || "Unknown"),
    datasets: [
      {
        label: "Stock Entries Made",
        data: clerkData.map((e) => Number(e.entries_made) || 0),
        backgroundColor: COLORS[0],
      },
      {
        label: "Stock Exits Made",
        data: clerkData.map((e) => Number(e.exits_made) || 0),
        backgroundColor: COLORS[1],
      },
      {
        label: "Supply Requests Made",
        data: clerkData.map((e) => Number(e.requests_made) || 0),
        backgroundColor: COLORS[2],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    animation: false, // Disable animations for reliable export
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
        },
      },
      title: {
        display: true,
        text: "Clerk Activity Overview",
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        stacked: true,
        title: { display: true, text: "Clerks" },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: { display: true, text: "Activity Count" },
        ticks: {
          callback: (value) => Number(value).toLocaleString(),
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
      <div style={{ height: "400px", width: "100%" }}>
        <Bar ref={barRef} data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default UserActivityCharts;