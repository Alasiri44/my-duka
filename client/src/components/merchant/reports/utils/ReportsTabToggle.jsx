import React from "react";

const ReportsTabToggle = ({ value = false, onToggle }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <button
        onClick={() => onToggle(false)}
        className={`px-4 py-1 text-sm rounded border ${
          !value
            ? "bg-[#011638] text-white border-[#011638]"
            : "bg-white text-gray-700 border-gray-300"
        }`}
      >
        Table
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`px-4 py-1 text-sm rounded border ${
          value
            ? "bg-[#011638] text-white border-[#011638]"
            : "bg-white text-gray-700 border-gray-300"
        }`}
      >
        Chart
      </button>
    </div>
  );
};

export default ReportsTabToggle;
