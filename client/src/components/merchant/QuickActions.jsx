import React from "react";
import { FaBuilding, FaStore, FaTruckLoading, FaMoneyBillWave } from "react-icons/fa";

const QuickActions = () => {
  const buttonClass =
    "w-full bg-white hover:bg-[#ec4e20] cursor-pointer text-[#011638] font-medium py-4 rounded transition flex flex-col items-center justify-center gap-2";

  const iconClass = "text-2xl text-[#011638]";

  const actions = [
    { icon: <FaBuilding className={iconClass} />, label: "Create Business" },
    { icon: <FaStore className={iconClass} />, label: "Add Store" },
    { icon: <FaTruckLoading className={iconClass} />, label: "Manage Suppliers" },
    { icon: <FaMoneyBillWave className={iconClass} />, label: "Pending Payments" },
  ];

  return (
    <div className="bg-[#f2f0ed] border border-[#f2f0ed] rounded-xl p-6 mt-6">
      <h2 className="text-lg font-semibold text-[#011638] mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, i) => (
          <button key={i} className={buttonClass}>
            {action.icon}
            <span className="text-sm text-center">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
