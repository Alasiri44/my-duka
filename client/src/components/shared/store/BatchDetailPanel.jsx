// components/store/BatchDetailPanel.jsx
import React from "react";

const BatchDetailPanel = ({
  selectedBatchId,
  selectedBatchEntries,
  getProductName,
  getClerkName,
  getSupplierName,
}) => {
  if (!selectedBatchId) {
    return (
      <div className="w-full md:w-2/3 border rounded-lg p-4 min-h-[200px]">
        <p className="text-sm text-[#5e574d]">Select a batch to view details.</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-2/3 border rounded-lg p-4 min-h-[200px] overflow-x-auto">
      <h3 className="text-md font-semibold text-[#011638] mb-2">
        Batch Details —{" "}
        {selectedBatchId.startsWith("no-batch") ? "—" : selectedBatchId}
      </h3>
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#f2f0ed] text-[#011638]">
            <tr>
              <th className="text-left px-2 py-2">Product</th>
              <th className="text-left px-2 py-2">Qty</th>
              <th className="text-left px-2 py-2">Unit Cost</th>
              <th className="text-left px-2 py-2">Total</th>
              <th className="text-left px-2 py-2">Clerk</th>
              <th className="text-left px-2 py-2">Supplier</th>
              <th className="text-left px-2 py-2">Payment</th>
            </tr>
          </thead>
          <tbody>
            {selectedBatchEntries.map((entry) => (
              <tr key={entry.id} className="border-t even:bg-[#fafafa]">
                <td className="px-2 py-2">{getProductName(entry.product_id)}</td>
                <td className="px-2 py-2">{entry.quantity_received}</td>
                <td className="px-2 py-2">
                  KES {typeof entry.buying_price === "number" ? entry.buying_price.toFixed(2) : "0.00"}
                </td>
                <td className="px-2 py-2">
                  KES {typeof entry.buying_price === "number" && typeof entry.quantity_received === "number"
                    ? (entry.buying_price * entry.quantity_received).toFixed(2)
                    : "0.00"}
                </td>
                <td className="px-2 py-2">{getClerkName(entry.clerk_id)}</td>
                <td className="px-2 py-2">{getSupplierName(entry.supplier_id)}</td>
                <td className="px-2 py-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    entry.payment_status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {entry.payment_status || "unpaid"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BatchDetailPanel;
