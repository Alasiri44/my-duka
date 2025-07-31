// Placeholder for ReportsFilters.jsx
import React, { useState, useEffect } from "react";

const ReportsFilters = ({ stores = [], onChange }) => {
  const [storeId, setStoreId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    onChange({ storeId, startDate, endDate });
  }, [storeId, startDate, endDate]);

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
      <div>
        <label className="block text-sm font-medium text-gray-700">Store</label>
        <select
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
        >
          <option value="">All Stores</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
        />
      </div>
    </div>
  );
};

export default ReportsFilters;