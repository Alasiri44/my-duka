import React from "react";
import NoDataFallback from "../utils/NoDataFallback";

const StockMovementTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <NoDataFallback message="No stock data available." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Product</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Stock In</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Stock Out</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-900 border-b">{item.product || "N/A"}</td>
              <td className="px-4 py-2 text-sm text-gray-900 border-b">{Number(item.stock_in || 0).toLocaleString()}</td>
              <td className="px-4 py-2 text-sm text-gray-900 border-b">{Number(item.stock_out || 0).toLocaleString()}</td>
              <td className="px-4 py-2 text-sm text-gray-900 border-b">{Number(item.balance || 0).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockMovementTable;