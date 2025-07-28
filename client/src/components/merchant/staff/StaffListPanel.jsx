import React, { useState } from "react";
import { FaUser, FaSearch } from "react-icons/fa";

const StaffListPanel = ({ users, onSelect, selectedId }) => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = users.filter((u) => {
    const roleMatch = filter === "all" || u.role === filter;
    const text = `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase();
    const searchMatch = text.includes(searchTerm.toLowerCase());
    return roleMatch && searchMatch;
  });

  const admins = filtered.filter((u) => u.role === "admin");
  const clerks = filtered.filter((u) => u.role === "clerk");

  return (
    <div className="bg-white p-4 rounded-xl border border-[#f2f0ed] shadow-sm h-[500px] overflow-y-auto flex flex-col">
      {/* Search Field */}
      <div className="relative mb-3">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#5e574d]" />
        <input
          type="text"
          placeholder="Search staff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-[#d7d0c8] rounded text-sm text-[#011638] focus:outline-none focus:ring-1 focus:ring-[#011638]"
        />
      </div>

      {/* Filter Buttons */}
      <div className="mb-3 flex gap-2 text-sm">
        {["all", "admin", "clerk"].map((role) => (
          <button
            key={role}
            onClick={() => setFilter(role)}
            className={`px-3 py-1 rounded-full border transition font-medium cursor-pointer
              ${
                filter === role
                  ? "bg-[#011638] text-white shadow-sm"
                  : "text-[#011638] border-[#011638] hover:bg-[#011638]/10"
              }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      {/* Admins */}
      {admins.length > 0 && (
        <>
          <p className="text-xs text-[#5e574d] mt-2 mb-1 font-semibold">Admins</p>
          <div className="space-y-2">
            {admins.map((u) => (
              <div
                key={u.id}
                onClick={() => onSelect(u)}
                className={`cursor-pointer p-3 rounded border flex flex-col transition duration-150 ${
                  selectedId === u.id
                    ? "bg-[#ec4e20]/10 border-[#ec4e20]"
                    : "border-transparent hover:border-[#d7d0c8] hover:bg-[#f9f7f6]"
                }`}
              >
                <p className="flex items-center gap-2 font-medium text-[#011638]">
                  <FaUser className="text-[#ec4e20]" /> {u.first_name} {u.last_name}
                </p>
                <p className="text-xs text-[#5e574d]">{u.email}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Clerks */}
      {clerks.length > 0 && (
        <>
          <p className="text-xs text-[#5e574d] mt-4 mb-1 font-semibold">Clerks</p>
          <div className="space-y-2">
            {clerks.map((u) => (
              <div
                key={u.id}
                onClick={() => onSelect(u)}
                className={`cursor-pointer p-3 rounded border flex flex-col transition duration-150 ${
                  selectedId === u.id
                    ? "bg-[#ec4e20]/10 border-[#ec4e20]"
                    : "border-transparent hover:border-[#d7d0c8] hover:bg-[#f9f7f6]"
                }`}
              >
                <p className="flex items-center gap-2 font-medium text-[#011638]">
                  <FaUser className="text-[#011638]" /> {u.first_name} {u.last_name}
                </p>
                <p className="text-xs text-[#5e574d]">{u.email}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {admins.length + clerks.length === 0 && (
        <p className="text-sm text-[#999999] mt-6 text-center">No staff found.</p>
      )}
    </div>
  );
};

export default StaffListPanel;
