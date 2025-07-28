import React from "react";

const ExitBatchDetailPanel = ({
  selectedBatchId,
  selectedBatchExits,
  getProductName,
  getClerkName,
}) => {
  if (!selectedBatchId) {
    return (
      <div className="w-full md:w-2/3 flex items-center justify-center text-gray-500 text-sm italic border border-[#e6e4e1] rounded-xl p-6">
        Select a batch to view details
      </div>
    );
  }

  const total = selectedBatchExits.reduce((sum, e) => {
    const price = parseFloat(e.selling_price) || 0;
    return sum + price * e.quantity;
  }, 0);

  return (
    <div className="w-full md:w-2/3 border border-[#e6e4e1] p-4 rounded-xl overflow-y-auto max-h-[75vh]">
      <h3 className="text-md font-semibold mb-4 text-[#011638]">Batch Details</h3>
      <div className="text-sm text-gray-600 mb-4">
        Total Value: <span className="text-green-600 font-bold">KES {total.toFixed(2)}</span>
      </div>
      <div className="space-y-3">
        {selectedBatchExits.map((exit) => {
          const price = parseFloat(exit.selling_price);
          const unitPrice = isNaN(price) ? "0.00" : price.toFixed(2);
          const subTotal = isNaN(price) ? 0 : price * exit.quantity;
          return (
            <div key={exit.id} className="p-3 border border-[#ddd] rounded-xl text-sm">
              <div className="font-medium text-[#011638]">{getProductName(exit.product_id)}</div>
              <div className="text-xs text-gray-500 mb-1">
                Quantity: {exit.quantity} × KES {unitPrice}
              </div>
              <div className="text-xs text-gray-500 mb-1">Clerk: {getClerkName(exit.recorded_by)}</div>
              <div className="text-xs text-gray-500 mb-1">Reason: {exit.reason || "—"}</div>
              <div className="text-xs text-gray-400 italic">
                Date: {new Date(exit.created_at).toLocaleString()}
              </div>
              <div className="text-xs text-green-700 font-semibold mt-1">
                Subtotal: KES {subTotal.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExitBatchDetailPanel;
