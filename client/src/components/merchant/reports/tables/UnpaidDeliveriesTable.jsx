import React from "react";
import NoDataFallback from "../utils/NoDataFallback";

const UnpaidDeliveriesTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <NoDataFallback message="No unpaid deliveries data available." />;
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-[#011638] mb-2">Unpaid Deliveries</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Entry ID</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Product</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Quantity</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Buying Price (KES)</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Supplier</th>
              <th className="py-2 pxula-4 border-b text-left text-sm font-semibold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.entry_id || index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-sm text-gray-900">{row.entry_id || "N/A"}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-900">{row.product || "N/A"}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-900">{row.quantity || 0}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-900">
                  KES {Number(row.buying_price || 0).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-sm text-gray-900">{row.supplier || "N/A"}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-900">{row.date || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnpaidDeliveriesTable;