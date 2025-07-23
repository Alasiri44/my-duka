import React from "react"

const ExitBatchDetailPanel = ({
  selectedBatchId,
  selectedBatchExits,
  getProductName,
  getUserName,
}) => {
  if (!selectedBatchId || selectedBatchExits.length === 0) {
    return (
      <div className="w-full md:w-2/3 border rounded-lg p-4 min-h-[200px]">
        <p className="text-sm text-[#5e574d]">Select a batch to view details.</p>
      </div>
    )
  }

  const first = selectedBatchExits[0]
  const total = selectedBatchExits.reduce((sum, e) => sum + e.quantity * e.selling_price, 0)

  return (
    <div className="w-full md:w-2/3 border rounded-lg p-4 min-h-[200px] overflow-x-auto">
      <div className="mb-4">
        <h3 className="text-md font-semibold text-[#011638] mb-1">
          Batch Details — {selectedBatchId.startsWith("no-batch") ? "—" : selectedBatchId}
        </h3>
        <div className="text-sm text-[#5e574d] space-y-1">
          <p><span className="font-medium text-[#011638]">Date:</span> {new Date(first.created_at).toLocaleDateString()}</p>
          <p><span className="font-medium text-[#011638]">Total Value:</span> KES {total.toFixed(2)}</p>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#f2f0ed] text-[#011638]">
            <tr>
              <th className="text-left px-2 py-2">Product</th>
              <th className="text-left px-2 py-2">Qty</th>
              <th className="text-left px-2 py-2">Selling Price</th>
              <th className="text-left px-2 py-2">Total</th>
              <th className="text-left px-2 py-2">Recorded By</th>
              <th className="text-left px-2 py-2">Reason</th>
            </tr>
          </thead>
          <tbody>
            {selectedBatchExits.map((exit) => (
              <tr key={exit.id} className="border-t even:bg-[#fafafa]">
                <td className="px-2 py-2">{getProductName(exit.product_id)}</td>
                <td className="px-2 py-2">{exit.quantity}</td>
                <td className="px-2 py-2">KES {exit.selling_price.toFixed(2)}</td>
                <td className="px-2 py-2">KES {(exit.selling_price * exit.quantity).toFixed(2)}</td>
                <td className="px-2 py-2">{getUserName(exit.recorded_by)}</td>
                <td className="px-2 py-2">{exit.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ExitBatchDetailPanel
