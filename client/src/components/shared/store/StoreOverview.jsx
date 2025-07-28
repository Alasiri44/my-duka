import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import StoreCharts from "./StoreCharts";

const StoreOverview = () => {
  const { store } = useOutletContext();
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("All");

  useEffect(() => {
    fetch(`http://localhost:5000/store/${store.id}/overview`)
      .then((res) => res.json())
      .then((data) => {
        setSummary(data.summary);
        setCharts(data.charts);
      });
  }, [store.id]);

  if (!summary || !charts) {
    return <p className="text-center p-6 text-[#5e574d]">Loading overview...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#011638] mb-2">Store Overview</h2>
      <p className="text-sm text-[#5e574d] mb-4">
        Welcome to <span className="font-medium">{store.name}</span>'s dashboard.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div className="bg-[#f2f0ed] border border-[#d7d0c8] p-4 rounded shadow-sm">
          <p className="text-[#5e574d]">Location</p>
          <p className="text-[#011638] font-medium">{store.location}</p>
        </div>

        <div className="bg-[#f2f0ed] border border-[#d7d0c8] p-4 rounded shadow-sm">
          <p className="text-[#5e574d]">Created</p>
          <p className="text-[#011638] font-medium">
            {new Date(store.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-[#f2f0ed] border border-[#d7d0c8] p-4 rounded shadow-sm">
          <p className="text-[#5e574d]">Total Products</p>
          <p className="text-[#011638] font-medium">{summary.total_products}</p>
        </div>

          {/* Filterable Total Sales Card */}
           <div className="bg-[#f2f0ed] border border-[#d7d0c8] p-4 rounded shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[#5e574d]">Total Sales</p>
            <p className="text-[#011638] text-lg font-semibold">
              KES{" "}
              {(
                selectedMethod === "All"
                  ? summary.total_sales
                  : charts.sales_by_payment_method.find((m) => m.method === selectedMethod)?.amount || 0
              ).toLocaleString()}
            </p>
          </div>
        
          <div className="flex justify-center mt-4 space-x-2">
            {["All", ...charts.sales_by_payment_method.map((m) => m.method)].map((method) => (
              <button
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`px-2 py-1 text-xs rounded border ${
                  selectedMethod === method
                    ? "bg-[#011638] text-white border-[#011638]"
                    : "text-[#011638] border-[#d7d0c8] bg-white"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#f2f0ed] border border-[#d7d0c8] p-4 rounded shadow-sm">
          <p className="text-[#5e574d]">Admins</p>
          <p className="text-[#011638] font-medium">{summary.admin_count}</p>
        </div>

        <div className="bg-[#f2f0ed] border border-[#d7d0c8] p-4 rounded shadow-sm">
          <p className="text-[#5e574d]">Clerks</p>
          <p className="text-[#011638] font-medium">{summary.clerk_count}</p>
        </div>

        <div className="bg-[#f2f0ed] border border-[#d7d0c8] p-4 rounded shadow-sm">
          <p className="text-[#5e574d]">Unpaid Deliveries</p>
          <p className="text-[#ec4e20] font-semibold">{summary.unpaid_deliveries}</p>
        </div>
      </div>

      {/* Chart Section */}
      <StoreCharts charts={charts} />
    </div>
  );
};

export default StoreOverview;
