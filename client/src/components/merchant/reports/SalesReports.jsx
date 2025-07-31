import React, { useEffect, useState, useRef } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import axios from "@/utils/axiosConfig";
import ReportsFilters from "./ReportsFilters";
import ReportsTabToggle from "./utils/ReportsTabToggle";
import NoDataFallback from "./utils/NoDataFallback";
import ReportCard from "./utils/ReportCard";
import ReportExportButton from "./utils/ReportExportButton";
import SalesCharts from "./charts/SalesCharts";
import SalesTable from "./tables/SalesTable";

const SalesReports = () => {
  const { businessId, stores } = useOutletContext();
  const [filters, setFilters] = useState({ storeId: "", startDate: "", endDate: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState({ trend: [], by_payment: [], by_store: [] });
  const [salesTableData, setSalesTableData] = useState([]);
  const [businessName, setBusinessName] = useState("Business");
  const chartRefs = useRef({});

  const { pathname } = useLocation();
  const showToggle = pathname.includes("sales");

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

    const fetchSalesData = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.storeId) params.append("store_id", filters.storeId);
      if (filters.startDate) params.append("start_date", filters.startDate);
      if (filters.endDate) params.append("end_date", filters.endDate);

      try {
        const [trendRes, paymentRes, storeRes] = await Promise.all([
          axios.get(`/business/${businessId}/reports/sales-summary?${params}`),
          axios.get(`/business/${businessId}/reports/sales-by-payment-method?${params}`),
          axios.get(`/business/${businessId}/reports/store-performance?${params}`)
        ]);

        console.log("Store Response:", storeRes.data);
        const newChartData = {
          trend: Array.isArray(trendRes.data) ? trendRes.data : [],
          by_payment: Array.isArray(paymentRes.data)
            ? paymentRes.data.map(p => ({
                method: p.payment_method || "Unknown",
                total: Number.isNaN(Number(p.total)) ? 0 : Number(p.total)
              }))
            : [],
          by_store: Array.isArray(storeRes.data)
            ? storeRes.data.map(s => {
                const total_sales = Number(s.total_sales);
                console.log("Mapping store:", s.store_name, "total_sales:", total_sales);
                return {
                  store_name: s.store_name || "Unknown",
                  total_sales: Number.isNaN(total_sales) ? 0 : total_sales
                };
              })
            : []
        };
        console.log("Mapped by_store Data:", newChartData.by_store);
        setChartData(newChartData);
        setSalesTableData(Array.isArray(trendRes.data) ? trendRes.data : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load sales report data");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
    fetchSalesData();
  }, [businessId, filters]);

  const totalSales = salesTableData.reduce((sum, entry) => sum + (Number(entry.total_sales) || 0), 0);

  const handleExportCSV = () => {
    try {
      const csvContent = "data:text/csv;charset=utf-8," +
        ["Date,Total Sales (KES)", ...salesTableData.map(e => `${e.date || "N/A"},${Number(e.total_sales || 0)}`)].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "sales_report.csv");
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

      {salesTableData.length > 0 && showToggle && (
        <ReportsTabToggle value={showChart} onToggle={setShowChart} />
      )}

      {loading ? (
        <p className="text-[#5e574d]">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : salesTableData.length === 0 ? (
        <NoDataFallback message="No sales data found for this period." />
      ) : (
        <>
          <div className="flex justify-between items-center gap-4 mb-4">
            <ReportCard title="Total Sales" value={`KES ${totalSales.toLocaleString()}`} />
            <div>
              <ReportExportButton
                onCsvExport={handleExportCSV}
                tableData={salesTableData}
                reportTitle="Sales Report"
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
              <SalesCharts data={chartData} chartRefs={chartRefs.current} />
            </div>
          </div>

          {showChart || <SalesTable data={salesTableData} />}
        </>
      )}
    </div>
  );
};

export default SalesReports;