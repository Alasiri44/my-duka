import React from "react"

const ExitFilters = ({ filters, onChange, products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#f2f0ed] border border-[#d7d0c8] p-4 rounded-xl">
      <select
        value={filters.productId}
        onChange={(e) => onChange("productId", e.target.value)}
        className="border border-[#d7d0c8] rounded p-2 text-sm text-[#011638]"
      >
        <option value="">Filter by Product</option>
        {products.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <select
        value={filters.reason}
        onChange={(e) => onChange("reason", e.target.value)}
        className="border border-[#d7d0c8] rounded p-2 text-sm text-[#011638]"
      >
        <option value="">Filter by Reason</option>
        <option value="sold">Sold</option>
        <option value="damaged">Damaged</option>
        <option value="expired">Expired</option>
      </select>

      <input
        type="date"
        value={filters.date}
        onChange={(e) => onChange("date", e.target.value)}
        className="border border-[#d7d0c8] rounded p-2 text-sm text-[#011638]"
      />
    </div>
  )
}

export default ExitFilters
