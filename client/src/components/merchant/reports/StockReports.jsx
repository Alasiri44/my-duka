import React, { useEffect, useState, useRef } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import axios from "@/utils/axiosConfig";
import ReportsFilters from "./ReportsFilters";
import ReportsTabToggle from "./utils/ReportsTabToggle";
import NoDataFallback from "./utils/NoDataFallback";
import ReportCard from "./utils/ReportCard";
import ReportExportButton from "./utils/ReportExportButton";
import StockCharts from "./charts/StockCharts";
import StockMovementTable from "./tables/StockMovementTable";

const StockReports = () => {
  const { businessId, stores } = useOutletContext();
  const [filters, setFilters] = useState({ storeId: "", startDate: "", endDate: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [businessName, setBusinessName] = useState("Business");
  const chartRefs = useRef({});
  const { pathname } = useLocation();
  const showToggle = pathname.includes("stock");

  const chartContainerRef = useRef();

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

    const fetchStockData = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.storeId) params.append("store_id", filters.storeId);
      if (filters.startDate) params.append("start_date", filters.startDate);
      if (filters.endDate) params.append("end_date", filters.endDate);

      try {
        const response = await axios.get(`/business/${businessId}/reports/product-performance?${params}`);
        const data = Array.isArray(response.data)
          ? response.data.map(item => ({
              product: item.product || "Unknown",
              stock_in: Number.isNaN(Number(item.stock_in)) ? 0 : Number(item.stock_in),
              stock_out: Number.isNaN(Number(item.stock_out)) ? 0 : Number(item.stock_out),
              balance: Number.isNaN(Number(item.balance)) ? 0 : Number(item.balance),
            }))
          : [];
        setStockData(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load stock report data");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
    fetchStockData();
  }, [businessId, filters]);

  const totalStockBalance = stockData.reduce((sum, entry) => sum + (Number(entry.balance) || 0), 0);

  const handleExportCSV = () => {
    try {
      const csvContent = "data:text/csv;charset=utf-8," +
        ["Product,Stock In,Stock Out,Balance", ...stockData.map(e => `${e.product},${e.stock_in},${e.stock_out},${e.balance}`)].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "stock_report.csv");
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
        <ReportsFilters stores={stores} onChange={setFilters} />
      </div>

      {stockData.length > 0 && showToggle && (
        <ReportsTabToggle value={showChart} onToggle={setShowChart} />
      )}

      {loading ? (
        <p className="text-[#5e574d]">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : stockData.length === 0 ? (
        <NoDataFallback message="No stock data found for this period." />
      ) : (
        <>
          <div className="flex justify-between items-center gap-4 mb-4">
            <ReportCard title="Total Stock Balance" value={`${totalStockBalance.toLocaleString()} units`} />
            <div>
              <ReportExportButton
                onCsvExport={handleExportCSV}
                tableData={stockData}
                reportTitle="Stock Report"
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
              ref={chartContainerRef}
              className="bg-white p-4 rounded shadow w-full box-border"
            >
              <StockCharts data={stockData} chartRefs={chartRefs.current} />
            </div>
          </div>

          {showChart || <StockMovementTable data={stockData} />}
        </>
      )}
    </div>
  );
};

export default StockReports;