import React, { useState, useRef, useEffect } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { BsFiletypeCsv } from "react-icons/bs";
import { GrDocumentPdf } from "react-icons/gr";

pdfMake.vfs = pdfFonts.vfs;

const ReportExportButton = ({
  onCsvExport,
  tableData = [],
  reportTitle = "Report",
  filters = {},
  businessName = "Business",
  stores = [],
  columnLabels = {},
  formatters = {},
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getColumns = () => {
    if (!tableData || tableData.length === 0) return [];
    return Object.keys(tableData[0]);
  };

  const getColumnLabel = (key) => {
    return columnLabels[key] || key.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
  };

  const formatValue = (key, value) => {
    if (formatters[key]) {
      return formatters[key](value);
    }
    if (typeof value === "number") {
      return Number(value).toLocaleString();
    }
    return value || "N/A";
  };

  const handleExportCSV = () => {
    try {
      onCsvExport();
      setDropdownOpen(false);
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

      const columns = getColumns();
      if (columns.length === 0) {
        throw new Error("No data available for export");
      }

      const docDefinition = {
        content: [
          { text: `${businessName} - Duka Smart`, style: "businessHeader" },
          { text: reportTitle, style: "reportHeader", margin: [0, 5, 0, 5] },
          { text: `Store: ${storeFilter}`, style: "subHeader", margin: [0, 0, 0, 5] },
          { text: `Period: ${dateRange}`, style: "subHeader", margin: [0, 0, 0, 10] },
          {
            table: {
              headerRows: 1,
              widths: columns.map(() => "*"),
              body: [
                columns.map(key => getColumnLabel(key)),
                ...tableData.map(row => columns.map(key => formatValue(key, row[key]))),
              ],
            },
          },
        ],
        styles: {
          businessHeader: {
            fontSize: 18,
            bold: true,
            alignment: "center",
            color: "#011638",
          },
          reportHeader: {
            fontSize: 16,
            bold: true,
            alignment: "center",
            color: "#011638",
          },
          subHeader: {
            fontSize: 12,
            italic: true,
            alignment: "center",
            color: "#5e574d",
          },
        },
      };
      pdfMake.createPdf(docDefinition).download(`${reportTitle.toLowerCase().replace(/\s+/g, "_")}.pdf`);
      setDropdownOpen(false);
    } catch (err) {
      console.error("PDF Table Export failed:", err);
      alert("Failed to export PDF table. Please try again.");
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        className="bg-[#ec4e20] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#d43f1a] transition"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        Export ▼
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="p-1">
            <button
              onClick={handleExportCSV}
              className="w-full text-left px-4 py-2 text-sm text-[#03a629] hover:bg-[#f3f4f6] flex items-center gap-2"
            >
              <BsFiletypeCsv className="text-[#03a629] text-lg" />
              Export CSV
            </button>
            <button
              onClick={handleExportPDFTable}
              className="w-full text-left px-4 py-2 text-sm text-[#fa0505] hover:bg-[#f3f4f6] flex items-center gap-2"
            >
              <GrDocumentPdf className="text-[#fa0505] text-lg" />
              Export PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportExportButton;