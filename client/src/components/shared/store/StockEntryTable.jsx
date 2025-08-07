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
          {entries.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-3 py-2 text-center text-[#5e574d]">
                No valid stock entries found
              </td>
            </tr>
          ) : (
            entries.map((entry) => {
              const qty = Number(entry.quantity_received);
              const price = Number(entry.buying_price);
              const total = qty * price;

              // Use fallbacks for invalid values
              const displayQty = !isNaN(qty) && qty > 0 ? qty : "N/A";
              const displayPrice = !isNaN(price) && price > 0 ? price.toFixed(2) : "N/A";
              const displayTotal = !isNaN(total) && total > 0 ? total.toFixed(2) : "N/A";

              return (
                <tr key={entry.id} className="border-t even:bg-[#fafafa]">
                  <td className="px-3 py-2">{getProductName(entry.product_id)}</td>
                  <td className="px-3 py-2">{displayQty}</td>
                  <td className="px-3 py-2">{displayPrice !== "N/A" ? `KES ${displayPrice}` : "N/A"}</td>
                  <td className="px-3 py-2">{displayTotal !== "N/A" ? `KES ${displayTotal}` : "N/A"}</td>
                  <td className="px-3 py-2">{getClerkName(entry.clerk_id)}</td>
                  <td className="px-3 py-2">{getSupplierName(entry.supplier_id)}</td>
                  <td className="px-3 py-2">
                    {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        entry.payment_status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {(entry.payment_status || "unpaid").toUpperCase()}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockEntryTable;