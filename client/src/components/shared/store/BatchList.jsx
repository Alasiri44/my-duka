// components/merchant/store/BatchList.jsx
import React from "react";

const BatchList = ({
  batches,
  selectedBatchId,
  onSelectBatch,
  searchTerm = "",
  getFirstEntry,
  getBatchTotal,
}) => {
  return (
    <div className="w-full md:w-1/3 border rounded-lg max-h-[500px] overflow-y-auto">
      <ul>
        {Object.entries(batches)
          .filter(([batchId]) =>
            batchId.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(([batchId, batchEntries]) => {
            const first = getFirstEntry(batchEntries);
            const total = getBatchTotal(batchEntries);

            // ✅ All entries must be paid to mark the batch as paid
            const allPaid = batchEntries.every(
              (entry) => entry.payment_status === "paid"
            );
            const status = allPaid ? "paid" : "unpaid";

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
                <p
                  className={`text-xs font-medium mt-1 ${
                    status === "paid" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {status.toUpperCase()}
                </p>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default BatchList;
