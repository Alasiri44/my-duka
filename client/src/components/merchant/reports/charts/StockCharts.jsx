
import React, { useRef, useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import axios from "@/utils/axiosConfig";
import { useOutletContext } from "react-router-dom";

ChartJS.register(
  BarElement,
  ArcElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title
);

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const StockCharts = ({ data, chartRefs }) => {
  const { businessId, stores } = useOutletContext();
  const [stockExitsData, setStockExitsData] = useState([]);
  const [filters, setFilters] = useState({ storeId: "", startDate: "", endDate: "" });
  const barRef = useRef(null);
  const pieRef = useRef(null);
  const exitBarRef = useRef(null);

  // Update chartRefs with the refs
  if (chartRefs) {
    chartRefs.barRef = barRef;
    chartRefs.pieRef = pieRef;
    chartRefs.exitBarRef = exitBarRef;
  }

  useEffect(() => {
    const fetchStockExitsData = async () => {
      const params = new URLSearchParams();
      if (filters.storeId) params.append("store_id", filters.storeId);
      if (filters.startDate) params.append("start_date", filters.startDate);
      if (filters.endDate) params.append("end_date", filters.endDate);

      try {
        const response = await axios.get(`/business/${businessId}/reports/stock-exits?${params}`);
        setStockExitsData(
          Array.isArray(response.data)
            ? response.data.map(item => ({
                reason: item.reason || "Unknown",
                total: Number.isNaN(Number(item.total)) ? 0 : Number(item.total),
              }))
            : []
        );
      } catch (err) {
        console.error("Failed to fetch stock exits data:", err);
        setStockExitsData([]);
      }
    };

    fetchStockExitsData();
  }, [businessId, filters]);

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

  const barData = {
    labels: data.map(e => e.product || "N/A"),
    datasets: [
      {
        label: "Stock In",
        data: data.map(e => Number(e.stock_in) || 0),
        backgroundColor: "#2563eb",
      },
      {
        label: "Stock Out",
        data: data.map(e => Number(e.stock_out) || 0),
        backgroundColor: "#ef4444",
      },
      {
        label: "Balance",
        data: data.map(e => Number(e.balance) || 0),
        backgroundColor: "#10b981",
      },
    ],
  };

  const pieData = {
    labels: data.map(e => e.product || "N/A"),
    datasets: [
      {
        label: "Stock Balance",
        data: data.map(e => Number(e.balance) || 0),
        backgroundColor: COLORS,
      },
    ],
  };

  const exitBarData = {
    labels: ["Stock Exits"],
    datasets: stockExitsData.map((item, index) => ({
      label: item.reason || "Unknown",
      data: [item.total || 0],
      backgroundColor: COLORS[index % COLORS.length],
    })),
  };

  const barOptions = {
    responsive: true,
    animation: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => {
            const value = ctx.parsed.y || 0;
            return `${ctx.dataset.label}: ${Number(value).toLocaleString()} units`;
          },
        },
      },
      legend: { display: true },
      title: {
        display: true,
        text: "Stock Movement by Product",
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: val => `${Number(val).toLocaleString()} units`,
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    animation: false,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: "Stock Balance Distribution",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: ctx => {
            const value = ctx.parsed || 0;
            return `${ctx.label}: ${Number(value).toLocaleString()} units`;
          },
        },
      },
    },
  };

  const exitBarOptions = {
    responsive: true,
    animation: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => {
            const value = ctx.parsed.y || 0;
            return `${ctx.dataset.label}: ${Number(value).toLocaleString()} units`;
          },
        },
      },
      legend: { display: true },
      title: {
        display: true,
        text: "Stock Exits by Reason",
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        stacked: true,
        ticks: {
          callback: val => `${Number(val).toLocaleString()} units`,
        },
      },
      x: {
        stacked: true,
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
        <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem" }}>
          <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Stock Movement by Product</h3>
          <div style={{ height: "500px" }}>
            <Bar ref={barRef} data={barData} options={barOptions} />
          </div>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem" }}>
          <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Stock Balance Distribution</h3>
          <div style={{ height: "500px" }}>
            <Pie ref={pieRef} data={pieData} options={pieOptions} />
          </div>
        </div>

        {stockExitsData.length > 0 && (
          <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem", gridColumn: "span 2" }}>
            <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Stock Exits by Reason</h3>
            <div style={{ height: "400px" }}>
              <Bar ref={exitBarRef} data={exitBarData} options={exitBarOptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockCharts;
