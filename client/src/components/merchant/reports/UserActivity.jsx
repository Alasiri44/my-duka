import React, { useEffect, useState, useRef } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import axios from "@/utils/axiosConfig";
import ReportsFilters from "./ReportsFilters";
import ReportsTabToggle from "./utils/ReportsTabToggle";
import NoDataFallback from "./utils/NoDataFallback";
import ReportCard from "./utils/ReportCard";
import ReportExportButton from "./utils/ReportExportButton";
import UserActivityTable from "./tables/UserActivityTable";
import UserActivityCharts from "./charts/UserActivityCharts";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

const UserActivity = () => {
  const { businessId, stores } = useOutletContext();
  const [filters, setFilters] = useState({ storeId: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [userActivityData, setUserActivityData] = useState([]);
  const [businessName, setBusinessName] = useState("Business");
  const chartRefs = useRef({});
  const { pathname } = useLocation();
  const showToggle = pathname.includes("users");

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

    const fetchUserActivityData = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.storeId) params.append("store_id", filters.storeId);

      try {
        const response = await axios.get(`/business/${businessId}/reports/user-activity?${params}`);
        setUserActivityData(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load user activity data");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
    fetchUserActivityData();
  }, [businessId, filters]);

  const totalUsers = userActivityData.length;

  const handleExportCSV = () => {
    try {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [
          "User,Email,Role,Created At,Stock Entries Made,Stock Exits Made,Supply Requests Made",
          ...userActivityData.map((e) =>
            [
              e.user || "N/A",
              e.email || "N/A",
              e.role || "N/A",
              e.created_at || "N/A",
              e.entries_made || 0,
              e.exits_made || 0,
              e.requests_made || 0,
            ].join(",")
          ),
        ].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "user_activity_report.csv");
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
        ? stores.find((store) => store.id === Number(filters.storeId))?.name || "Unknown Store"
        : "All Stores";

      const truncateText = (text, maxLength = 40) =>
        typeof text === "string" && text.length > maxLength
          ? text.substring(0, maxLength - 3) + "..."
          : text || "N/A";

      const docDefinition = {
        pageSize: "A4",
        pageOrientation: "landscape",
        pageMargins: [10, 10, 10, 10],
        content: [
          { text: businessName, style: "businessHeader" },
          { text: "User Activity Report", style: "reportHeader", margin: [0, 3, 0, 3] },
          { text: `Store: ${storeFilter}`, style: "subHeader", margin: [0, 0, 0, 5] },
          {
            table: {
              headerRows: 1,
              widths: [120, 160, 80, 100, 70, 70, 70],
              body: [
                [
                  { text: "User", style: "tableHeader" },
                  { text: "Email", style: "tableHeader" },
                  { text: "Role", style: "tableHeader" },
                  { text: "Date", style: "tableHeader" },
                  { text: "Entries", style: "tableHeader" },
                  { text: "Exits", style: "tableHeader" },
                  { text: "Req.", style: "tableHeader" },
                ],
                ...userActivityData.map((row) => [
                  { text: truncateText(row.user, 35), style: "tableCell", noWrap: false },
                  { text: truncateText(row.email, 50), style: "tableCell", noWrap: false },
                  { text: row.role || "N/A", style: "tableCell", noWrap: false },
                  { text: row.created_at || "N/A", style: "tableCell", noWrap: false },
                  { text: String(row.entries_made || 0), style: "tableCell", alignment: "right" },
                  { text: String(row.exits_made || 0), style: "tableCell", alignment: "right" },
                  { text: String(row.requests_made || 0), style: "tableCell", alignment: "right" },
                ]),
              ],
            },
            layout: {
              hLineWidth: () => 0.2,
              vLineWidth: () => 0.2,
              hLineColor: () => "#ccc",
              vLineColor: () => "#ccc",
              paddingLeft: () => 1,
              paddingRight: () => 1,
              paddingTop: () => 1,
              paddingBottom: () => 1,
            },
          },
        ],
        styles: {
          businessHeader: { fontSize: 12, bold: true, alignment: "center", margin: [0, 0, 0, 3] },
          reportHeader: { fontSize: 10, bold: true, alignment: "center", margin: [0, 0, 0, 3] },
          subHeader: { fontSize: 8, italic: true, alignment: "center", margin: [0, 0, 0, 3] },
          tableHeader: { fontSize: 7, bold: true, fillColor: "#f3f4f6", margin: [0, 1, 0, 1] },
          tableCell: { fontSize: 6, margin: [1, 1, 1, 1] },
        },
        defaultStyle: { fontSize: 6 },
      };

      pdfMake.createPdf(docDefinition).download("user_activity_report.pdf");
    } catch (err) {
      console.error("PDF Table Export failed:", err);
      alert("Failed to export PDF table. Please try again.");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <ReportsFilters stores={stores} onChange={setFilters} dateFilters={false} />
      </div>

      {userActivityData.length > 0 && showToggle && (
        <ReportsTabToggle value={showChart} onToggle={setShowChart} />
      )}

      {loading ? (
        <p className="text-[#5e574d]">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : userActivityData.length === 0 ? (
        <NoDataFallback message="No user activity data found." />
      ) : (
        <>
          <div className="flex justify-between items-center gap-4 mb-4">
            <ReportCard title="Total Users" value={totalUsers} />
            <div>
              <ReportExportButton
                onCsvExport={handleExportCSV}
                tableData={userActivityData}
                reportTitle="User Activity Report"
                filters={filters}
                businessName={businessName}
                stores={stores}
                onPdfExport={handleExportPDFTable}
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
              <UserActivityCharts data={userActivityData} chartRefs={chartRefs.current} />
            </div>
          </div>

          {showChart || <UserActivityTable data={userActivityData} />}
        </>
      )}
    </div>
  );
};

export default UserActivity;