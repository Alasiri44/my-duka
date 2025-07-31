import React, { useEffect, useState, useRef } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import axios from "@/utils/axiosConfig";
import ReportsFilters from "./ReportsFilters";
import ReportsTabToggle from "./utils/ReportsTabToggle";
import NoDataFallback from "./utils/NoDataFallback";
import ReportCard from "./utils/ReportCard";
import ReportExportButton from "./utils/ReportExportButton";
import StoreComparisonChart from "./charts/StoreComparisonChart";
import StorePerformanceTable from "./tables/StorePerformanceTable";

const StorePerformance = () => {
  const { businessId, stores } = useOutletContext();
  const [filters, setFilters] = useState({ storeId: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [businessName, setBusinessName] = useState("Business");
  const chartRefs = useRef({});
  const { pathname } = useLocation();
  const showToggle = pathname.includes("stores");

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await axios.get(`/business/${businessId}`);
        setBusinessName(response.data.name || "Business");
      } catch (err) {
        console.error("Failed to fetch business data:", err);
        setBusinessName("Business");
      }
    };

    const fetchStorePerformanceData = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.storeId) params.append("store_id", filters.storeId);

      try {
        const response = await axios.get(`/business/${businessId}/reports/store-performance?${params}`);
        const data = Array.isArray(response.data) ? response.data : [];
        setChartData(data);
        setTableData(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load store performance data");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
    fetchStorePerformanceData();
  }, [businessId, filters]);

  const totalSales = tableData.reduce((sum, entry) => sum + (Number(entry.total_sales) || 0), 0);
  const totalEntries = tableData.reduce((sum, entry) => sum + (Number(entry.total_entries) || 0), 0);
  const totalExits = tableData.reduce((sum, entry) => sum + (Number(entry.total_exits) || 0), 0);

  const handleExportCSV = () => {
    try {
      const csvContent = "data:text/csv;charset=utf-8," +
        ["Store Name,Total Entries,Total Exits,Total Sales (KES)", ...tableData.map(e =>
          `${e.store_name || "Unknown"},${e.total_entries || 0},${e.total_exits || 0},${Number(e.total_sales || 0)}`
        )].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "store_performance_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("CSV Export failed:", err);
      alert("Failed to export CSV. Please try again.");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <ReportsFilters stores={stores} onChange={setFilters} showDateFilters={false} />
      </div>

      {tableData.length > 0 && showToggle && (
        <ReportsTabToggle value={showChart} onToggle={setShowChart} />
      )}

      {loading ? (
        <p className="text-[#5e574d]">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : tableData.length === 0 ? (
        <NoDataFallback message="No store performance data found." />
      ) : (
        <>
          <div className="flex justify-between items-center gap-4 mb-4">
            <div className="flex gap-4">
              <ReportCard title="Total Sales" value={`KES ${totalSales.toLocaleString()}`} />
              <ReportCard title="Total Stock Entries" value={totalEntries.toLocaleString()} />
              <ReportCard title="Total Stock Exits" value={totalExits.toLocaleString()} />
            </div>
            <div>
              <ReportExportButton
                onCsvExport={handleExportCSV}
                tableData={tableData}
                reportTitle="Store Performance Report"
                filters={filters}
                businessName={businessName}
                stores={stores}
              />
            </div>
          </div>

          <div
            className={`${
              showChart ? "relative" : "absolute"
            } w-full ${showChart ? "" : "h-0 overflow-hidden"}`}
          >
            <div
              className="bg-white p-4 rounded shadow w-full box-border"
            >
              <StoreComparisonChart data={chartData} chartRefs={chartRefs.current} />
            </div>
          </div>

          {showChart || <StorePerformanceTable data={tableData} />}
        </>
      )}
    </div>
  );
};

export default StorePerformance;