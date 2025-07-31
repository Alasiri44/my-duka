import React, { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "@/utils/axiosConfig";
import ReportsFilters from "./ReportsFilters";
import ReportsTabToggle from "./utils/ReportsTabToggle";
import NoDataFallback from "./utils/NoDataFallback";
import ReportCard from "./utils/ReportCard";
import ReportExportButton from "./utils/ReportExportButton";
import TopSuppliersChart from "./charts/TopSuppliersChart";
import SupplierPaymentsTable from "./tables/SupplierPaymentsTable";

const SupplierReports = () => {
  const { businessId, stores } = useOutletContext();
  const [filters, setFilters] = useState({ storeId: "", startDate: "", endDate: "", productId: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState({ 
    supplier_payments: [],
    procurement_spend: [] 
  });
  const [tableData, setTableData] = useState([]);
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

    const fetchSupplierData = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.storeId) params.append("store_id", filters.storeId);
      if (filters.startDate) params.append("start_date", filters.startDate);
      if (filters.endDate) params.append("end_date", filters.endDate);
      if (filters.productId) params.append("product_id", filters.productId);

      try {
        const [paymentsRes, spendRes] = await Promise.all([
          axios.get(`/business/${businessId}/reports/supplier-payments?${params}`),
          axios.get(`/business/${businessId}/reports/procurement-spend?${params}`)
        ]);

        const paymentsData = Array.isArray(paymentsRes.data)
          ? paymentsRes.data.map(p => ({
              supplier: p.supplier || "Unknown",
              amount: Number.isNaN(Number(p.amount)) ? 0 : Number(p.amount),
              last_payment_date: p.last_payment_date
            }))
          : [];

        const spendData = Array.isArray(spendRes.data)
          ? spendRes.data
              .filter(s => paymentsData.some(p => p.supplier === s.supplier)) // Only include suppliers from payments
              .map(s => ({
                supplier: s.supplier || "Unknown",
                total_spent: Number.isNaN(Number(s.total_spent)) ? 0 : Number(s.total_spent)
              }))
          : [];

        setChartData({
          supplier_payments: paymentsData,
          procurement_spend: spendData
        });
        setTableData(paymentsData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load supplier report data");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
    fetchSupplierData();
  }, [businessId, filters]);

  const totalSpend = chartData.procurement_spend.reduce(
    (sum, entry) => sum + (Number(entry.total_spent) || 0), 
    0
  );

  const handleExportCSV = () => {
    try {
      const csvContent = "data:text/csv;charset=utf-8," +
        ["Supplier,Amount (KES),Last Payment Date", 
         ...tableData.map(e => 
           `${e.supplier || "N/A"},${Number(e.amount || 0)},${e.last_payment_date || "N/A"}`
         )
        ].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "supplier_payments_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("CSV Export failed:", err);
      alert("Failed to export CSV. Please try again.");
    }
  };

  const handleExportPDFTable = () => {
    try {
      const storeFilter = filters.storeId
        ? stores.find(store => store.id === Number(filters.storeId))?.name || "Unknown Store"
        : "All Stores";

      const dateRange = filters.startDate && filters.endDate
        ? `From ${filters.startDate} to ${filters.endDate}`
        : filters.startDate
        ? `From ${filters.startDate}`
        : filters.endDate
        ? `Until ${filters.endDate}`
        : "All Time";

      const productFilter = filters.productId
        ? `Product ID: ${filters.productId}`
        : "All Products";

      const docDefinition = {
        content: [
          { text: businessName, style: "businessHeader" },
          { text: "Supplier Payments Report", style: "reportHeader", margin: [0, 5, 0, 5] },
          { text: `Store: ${storeFilter}`, style: "subHeader", margin: [0, 0, 0, 5] },
          { text: `Period: ${dateRange}`, style: "subHeader", margin: [0, 0, 0, 5] },
          { text: productFilter, style: "subHeader", margin: [0, 0, 0, 10] },
          {
            table: {
              headerRows: 1,
              widths: ["*", "*", "*"],
              body: [
                ["Supplier", "Amount (KES)", "Last Payment Date"],
                ...tableData.map(row => [
                  row.supplier || "N/A", 
                  `KES ${Number(row.amount || 0).toLocaleString()}`, 
                  row.last_payment_date || "N/A"
                ]),
              ],
            },
          },
        ],
        styles: {
          businessHeader: { fontSize: 18, bold: true, alignment: "center" },
          reportHeader: { fontSize: 16, bold: true, alignment: "center" },
          subHeader: { fontSize: 12, italic: true, alignment: "center" },
        },
      };
      pdfMake.createPdf(docDefinition).download("supplier_payments_report.pdf");
    } catch (err) {
      console.error("PDF Table Export failed:", err);
      alert("Failed to export PDF table. Please try again.");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <ReportsFilters 
          stores={stores} 
          onChange={setFilters} 
          showProductFilter={true} 
        />
      </div>

      {tableData.length > 0 && (
        <ReportsTabToggle value={showChart} onToggle={setShowChart} />
      )}

      {loading ? (
        <p style={{ color: "#6b7280" }}>Loading...</p>
      ) : error ? (
        <p style={{ color: "#ef4444" }}>{error}</p>
      ) : tableData.length === 0 ? (
        <NoDataFallback message="No supplier data found for this period." />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div className="flex justify-between items-center gap-4 mb-4">
            <ReportCard
              title="Total Procurement Spend"
              value={`KES ${totalSpend.toLocaleString()}`}
            />
              <ReportExportButton
                onCsvExport={handleExportCSV}
                tableData={tableData}
                reportTitle="Supplier Payments Report"
                filters={filters}
                businessName={businessName}
                stores={stores}
                onPdfExport={handleExportPDFTable}
              />
            </div>
          </div>


          <div
            style={{
              position: showChart ? "relative" : "absolute",
              visibility: showChart ? "visible" : "hidden",
              height: showChart ? "auto" : 0,
              overflow: "hidden",
              width: "100%",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                color: "#000000",
                padding: "1rem",
                fontFamily: "sans-serif",
                borderRadius: "0.5rem",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <TopSuppliersChart data={chartData} chartRefs={chartRefs.current} />
            </div>
          </div>

          {showChart || <SupplierPaymentsTable data={tableData} />}
        </>
      )}
    </div>
  );
};

export default SupplierReports;