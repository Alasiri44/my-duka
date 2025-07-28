import React from "react";

const ExitBatchList = ({
  batches,
  selectedBatchId,
  onSelectBatch,
  searchTerm = "",
  getFirstExit,
  getBatchTotal,
}) => {
  return (
    <div className="w-full md:w-1/3 border rounded-lg max-h-[500px] overflow-y-auto">
      <ul>
        {Object.entries(batches)
          .filter(([batchId]) =>
            batchId.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(([batchId, batchExits]) => {
            const first = getFirstExit(batchExits);
            const total = getBatchTotal(batchExits);

            return (
              <li
                key={batchId}
                onClick={() => onSelectBatch(batchId)}
                className={`p-4 border-b cursor-pointer ${
                  batchId === selectedBatchId
                    ? "bg-[#f2f0ed]"
                    : "hover:bg-[#fafafa]"
                }`}
              >
                <p className="text-sm font-semibold text-[#011638]">
                  Batch: {batchId.startsWith("no-batch") ? "—" : batchId}
                </p>
                <p className="text-xs text-[#5e574d]">
                  Date: {new Date(first.created_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-[#5e574d]">
                  Total: KES {total.toFixed(2)}
                </p>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default ExitBatchList;
