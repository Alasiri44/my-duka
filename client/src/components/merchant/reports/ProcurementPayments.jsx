import React, { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "@/utils/axiosConfig";
import ReportsFilters from "./ReportsFilters";
import ReportsTabToggle from "./utils/ReportsTabToggle";
import NoDataFallback from "./utils/NoDataFallback";
import ReportCard from "./utils/ReportCard";
import ReportExportButton from "./utils/ReportExportButton";
import PaymentStatusPie from "./charts/PaymentStatusPie";
import SupplierPaymentsTable from "./tables/SupplierPaymentsTable";
import UnpaidDeliveriesTable from "./tables/UnpaidDeliveriesTable";

const ProcurementPayments = () => {
  const { businessId, stores } = useOutletContext();
  const [filters, setFilters] = useState({ storeId: "", startDate: "", endDate: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState({ payment_status: [] });
  const [supplierPaymentsData, setSupplierPaymentsData] = useState([]);
  const [unpaidEntriesData, setUnpaidEntriesData] = useState([]);
  const [businessName, setBusinessName] = useState("Business");
  const chartRefs = useRef({});

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

    const fetchProcurementData = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.storeId) params.append("store_id", filters.storeId);
      if (filters.startDate) params.append("start_date", filters.startDate);
      if (filters.endDate) params.append("end_date", filters.endDate);

      try {
        const [paymentStatusRes, supplierPaymentsRes, unpaidEntriesRes] = await Promise.all([
          axios.get(`/business/${businessId}/reports/payment-status?${params}`),
          axios.get(`/business/${businessId}/reports/supplier-payments?${params}`),
          axios.get(`/business/${businessId}/reports/unpaid-entries?${params}`)
        ]);

        setChartData({
          payment_status: Array.isArray(paymentStatusRes.data)
            ? paymentStatusRes.data.map(p => ({
                payment_status: p.payment_status || "Unknown",
                total: Number.isNaN(Number(p.total)) ? 0 : Number(p.total)
              }))
            : []
        });
        setSupplierPaymentsData(Array.isArray(supplierPaymentsRes.data) ? supplierPaymentsRes.data : []);
        setUnpaidEntriesData(Array.isArray(unpaidEntriesRes.data) ? unpaidEntriesRes.data : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load procurement and payments data");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
    fetchProcurementData();
  }, [businessId, filters]);

  const totalPayments = supplierPaymentsData.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
  const totalUnpaid = unpaidEntriesData.reduce((sum, entry) => sum + (Number(entry.quantity) * Number(entry.buying_price) || 0), 0);

  const handleExportCSV = (data, filename) => {
    try {
      const csvContent = "data:text/csv;charset=utf-8," +
        (data === supplierPaymentsData
          ? ["Supplier,Amount (KES),Last Payment Date", ...data.map(e => `${e.supplier},${Number(e.amount || 0)},${e.last_payment_date || "N/A"}`)].join("\n")
          : ["Entry ID,Product,Quantity,Buying Price (KES),Supplier,Date", ...data.map(e => `${e.entry_id},${e.product},${e.quantity},${e.buying_price},${e.supplier},${e.date || "N/A"}`)].join("\n"));
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", filename);
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

      {(supplierPaymentsData.length > 0 || unpaidEntriesData.length > 0) && (
        <ReportsTabToggle value={showChart} onToggle={setShowChart} />
      )}

      {loading ? (
        <p className="text-[#5e574d]">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : supplierPaymentsData.length === 0 && unpaidEntriesData.length === 0 ? (
        <NoDataFallback message="No procurement or payment data found for this period." />
      ) : (
        <>
          <div className="flex justify-between items-center gap-4 mb-4">
            <div className="flex flex-col gap-4">
              <ReportCard title="Total Payments" value={`KES ${totalPayments.toLocaleString()}`} />
              <ReportCard title="Total Unpaid" value={`KES ${totalUnpaid.toLocaleString()}`} />
            </div>
            <div className="flex gap-4">
              <ReportExportButton
                onCsvExport={() => handleExportCSV(supplierPaymentsData, "supplier_payments.csv")}
                tableData={supplierPaymentsData}
                reportTitle="Supplier Payments Report"
                filters={filters}
                businessName={businessName}
                stores={stores}
              />
              <ReportExportButton
                onCsvExport={() => handleExportCSV(unpaidEntriesData, "unpaid_entries.csv")}
                tableData={unpaidEntriesData}
                reportTitle="Unpaid Deliveries Report"
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
              <PaymentStatusPie data={chartData.payment_status} chartRefs={chartRefs.current} />
            </div>
          </div>

          {showChart || (
            <div>
              <SupplierPaymentsTable data={supplierPaymentsData} />
              <UnpaidDeliveriesTable data={unpaidEntriesData} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProcurementPayments;