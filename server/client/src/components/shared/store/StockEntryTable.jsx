// components/store/StockEntryTable.jsx
import React from "react";

const StockEntryTable = ({
  entries,
  getProductName,
  getClerkName,
  getSupplierName,
}) => {
  return (
    <div className="overflow-x-auto border rounded-lg max-h-[500px] overflow-y-auto">
      <table className="w-full text-sm">
        <thead className="bg-[#f2f0ed] text-[#011638] sticky top-0">
          <tr>
            <th className="text-left px-3 py-2">Product</th>
            <th className="text-left px-3 py-2">Qty</th>
            <th className="text-left px-3 py-2">Unit Cost</th>
            <th className="text-left px-3 py-2">Total</th>
            <th className="text-left px-3 py-2">Clerk</th>
            <th className="text-left px-3 py-2">Supplier</th>
            <th className="text-left px-3 py-2">Date</th>
            <th className="text-left px-3 py-2">Payment</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-t even:bg-[#fafafa]">
              <td className="px-3 py-2">{getProductName(entry.product_id)}</td>
              <td className="px-3 py-2">{entry.quantity_received}</td>
              <td className="px-3 py-2">KES {entry.buying_price.toFixed(2)}</td>
              <td className="px-3 py-2">
                KES {(entry.buying_price * entry.quantity_received).toFixed(2)}
              </td>
              <td className="px-3 py-2">{getClerkName(entry.clerk_id)}</td>
              <td className="px-3 py-2">{getSupplierName(entry.supplier_id)}</td>
              <td className="px-3 py-2">
                {new Date(entry.created_at).toLocaleDateString()}
              </td>
              <td className="px-3 py-2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    entry.payment_status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {entry.payment_status || "unpaid"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockEntryTable;
