import React from "react";

const SupplierPaymentsTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        No supplier payments data available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Supplier</th>
            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Amount (KES)</th>
            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Last Payment Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-sm text-gray-900">{row.supplier || "N/A"}</td>
              <td className="py-2 px-4 border-b text-sm text-gray-900">
                KES {Number(row.amount || 0).toLocaleString()}
              </td>
              <td className="py-2 px-4 border-b text-sm text-gray-900">{row.last_payment_date || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierPaymentsTable;