import React from "react";

const StockExitTable = ({ exits, getProductName, getClerkName, getSupplierName }) => {
  return (
    <div className="overflow-auto mt-4 border rounded-lg">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-[#f2f0ed] text-[#011638] font-semibold">
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Clerk</th>
            <th className="px-4 py-2">Supplier</th>
            <th className="px-4 py-2">Qty</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Reason</th>
            <th className="px-4 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {exits.map((exit) => (
            <tr key={exit.id} className="border-b">
              <td className="px-4 py-2">{new Date(exit.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-2">{getProductName(exit.product_id)}</td>
              <td className="px-4 py-2">{getClerkName(exit.clerk_id)}</td>
              <td className="px-4 py-2">{getSupplierName(exit.supplier_id)}</td>
              <td className="px-4 py-2">{exit.quantity_sold}</td>
              <td className="px-4 py-2">KES {exit.selling_price?.toFixed(2) || "—"}</td>
              <td className="px-4 py-2">{exit.reason || "—"}</td>
              <td className="px-4 py-2 text-green-600">
                KES {(exit.quantity_sold * exit.selling_price)?.toFixed(2) || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockExitTable;
