// components/store/StockEntriesFilters.jsx
import React from "react";

const StockEntriesFilters = ({
  products,
  suppliers,
  filterProduct,
  filterSupplier,
  filterStartDate,
  filterEndDate,
  onProductChange,
  onSupplierChange,
  onStartDateChange,
  onEndDateChange,
  batchSearch,
  onBatchSearchChange,
  showBatchSearch = false,
  filterBatchStatus,
  onBatchStatusChange,
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4 items-end">
      <select
        value={filterProduct}
        onChange={(e) => onProductChange(e.target.value)}
        className="border px-3 py-2 rounded text-sm"
      >
        <option value="">All Products</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        value={filterSupplier}
        onChange={(e) => onSupplierChange(e.target.value)}
        className="border px-3 py-2 rounded text-sm"
      >
        <option value="">All Suppliers</option>
        {suppliers.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={filterStartDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="border px-3 py-2 rounded text-sm"
      />

      <input
        type="date"
        value={filterEndDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="border px-3 py-2 rounded text-sm"
      />

      {showBatchSearch && (
        <>
          <input
            type="text"
            placeholder="Search Batch #"
            value={batchSearch}
            onChange={(e) => onBatchSearchChange(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          />

          <select
            value={filterBatchStatus}
            onChange={(e) => onBatchStatusChange(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="">All Batches</option>
            <option value="paid">Paid Only</option>
            <option value="unpaid">Unpaid Only</option>
          </select>
        </>
      )}
    </div>
  );
};

export default StockEntriesFilters;
