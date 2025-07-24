import React from "react";
import { Link } from "react-router-dom";
import { 
  FaPlusSquare,       // Stock Entry
  FaMinusSquare,      // Stock Exit
  FaBoxes             // Inventory
} from "react-icons/fa";

const QuickActions = () => {
  const buttonClass =
    "w-full bg-white hover:bg-[#ec4e20] text-[#011638] font-medium py-4 rounded transition flex flex-col items-center justify-center gap-2";

  const iconClass = "text-2xl text-[#011638]";

  const actions = [
    {
      icon: <FaPlusSquare className={iconClass} />,
      label: "Stock Entry",
      path: "/clerk/add-product"
    },
    {
      icon: <FaMinusSquare className={iconClass} />,
      label: "Stock Exit",
      path: "/clerk/stock-exits"
    },
    {
      icon: <FaBoxes className={iconClass} />,
      label: "Inventory",
      path: "/clerk/inventory"
    }
  ];

  return (
    <div className="bg-[#f2f0ed] border border-[#f2f0ed] rounded-xl p-6 mt-6">
      <h2 className="text-lg font-semibold text-[#011638] mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action, i) => (
          <Link to={action.path} key={i}>
            <button className={buttonClass}>
              {action.icon}
              <span className="text-sm text-center">{action.label}</span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
