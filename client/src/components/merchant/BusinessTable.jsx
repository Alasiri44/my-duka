import React from "react";

const BusinessTable = ({ businesses }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f2f0ed]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-[#011638]">Your Businesses</h2>
          <p className="text-sm text-[#5e574d]">Manage your business portfolio</p>
        </div>
        <button className="bg-[#011638] text-white px-4 py-2 text-sm rounded hover:bg-[#000f2a]">
          + Add Business
        </button>
      </div>

      <div className="space-y-4">
        {businesses.map((biz) => (
          <div
            key={biz.id}
            className="bg-[#f9f9f9] border border-[#f2f0ed] rounded-lg px-5 py-4 flex justify-between items-center hover:shadow transition"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[#011638]">{biz.name}</h3>
                <span className="bg-[#5e574d] text-white text-xs px-2 py-0.5 rounded-full uppercase">
                  {biz.status}
                </span>
              </div>
              <p className="text-sm text-[#5e574d]">
                {biz.industry} • {biz.store_count} store{biz.store_count > 1 ? "s" : ""}
              </p>
              <p className="text-green-600 text-sm font-medium mt-1">
                  {typeof biz.monthly_spend === "number"
                    ? `KES ${biz.monthly_spend.toLocaleString()}`
                    : "N/A"}
              </p>
            </div>

            <div className="flex gap-2">
              <button className="text-[#011638] font-medium text-sm px-4 py-1.5 border border-[#011638] rounded hover:bg-[#011638] hover:text-white transition">
                View
              </button>
              <button className="text-[#5e574d] font-medium text-sm px-4 py-1.5 border border-[#5e574d] rounded hover:bg-[#ec4e20] hover:text-white transition">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessTable;
