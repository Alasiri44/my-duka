import React from "react";

const ExitBatchList = ({
  groupedBatches = {},
  selectedBatchId,
  setSelectedBatchId,
  getProductName,
}) => {
  const formatDate = (isoDate) => new Date(isoDate).toLocaleDateString();

  return (
    <div className="w-full md:w-1/3 border border-[#e6e4e1] p-4 rounded-xl overflow-y-auto max-h-[75vh]">
      <h3 className="text-md font-semibold mb-2 text-[#011638]">Batches</h3>
      {Object.keys(groupedBatches).length === 0 ? (
        <p className="text-sm text-gray-500">No exits found.</p>
      ) : (
        Object.entries(groupedBatches).map(([batchId, exits]) => {
          const first = exits[0];
          const total = exits.reduce((sum, e) => sum + e.quantity * (e.selling_price || 0), 0);
          return (
            <div
              key={batchId}
              onClick={() => setSelectedBatchId(batchId)}
              className={`mb-3 p-3 rounded-xl border ${
                batchId === selectedBatchId ? "border-[#011638] bg-[#f9f9f9]" : "border-transparent"
              } hover:border-[#011638] cursor-pointer`}
            >
              <div className="text-sm text-[#011638] font-medium">{getProductName(first.product_id)}</div>
              <div className="text-xs text-[#5e574d]">{formatDate(first.created_at)}</div>
              <div className="text-xs text-green-600 font-semibold">KES {total.toFixed(2)}</div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ExitBatchList;
