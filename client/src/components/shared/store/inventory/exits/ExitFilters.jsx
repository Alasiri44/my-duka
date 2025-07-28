import React from "react";

const ExitFilters = ({
  products,
  users,
  filterProduct,
  setFilterProduct,
  filterClerk,
  setFilterClerk,
  filterReason,
  setFilterReason
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#f2f0ed] border border-[#d7d0c8] p-4 rounded-xl">
      <select
        value={filterProduct}
        onChange={(e) => setFilterProduct(e.target.value)}
        className="border border-[#d7d0c8] rounded p-2 text-sm text-[#011638]"
      >
        <option value="">Filter by Product</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <select
        value={filterClerk}
        onChange={(e) => setFilterClerk(e.target.value)}
        className="border border-[#d7d0c8] rounded p-2 text-sm text-[#011638]"
      >
        <option value="">Filter by Clerk</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>{u.first_name} {u.last_name}</option>
        ))}
      </select>

      <select
        value={filterReason}
        onChange={(e) => setFilterReason(e.target.value)}
        className="border border-[#d7d0c8] rounded p-2 text-sm text-[#011638]"
      >
        <option value="">Filter by Reason</option>
        <option value="sold">Sold</option>
        <option value="damaged">Damaged</option>
        <option value="expired">Expired</option>
      </select>
    </div>
  );
};

export default ExitFilters;
