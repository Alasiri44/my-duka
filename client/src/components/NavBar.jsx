// /components/business/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaArrowLeft, FaStore, FaUser, FaBoxes, FaTruck, FaMoneyBill, FaChartBar, FaCog, FaBuilding } from "react-icons/fa";

const Sidebar = ({ businesses, currentId }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const linkClass = (isActive) =>
    `flex items-center gap-2 px-4 py-2 rounded hover:bg-[#e0dedc] transition text-sm ${
      isActive ? "bg-[#d7d0c8] font-semibold" : "text-[#011638]"
    }`;

  return (
    <aside
      className={`bg-[#f2f0ed] border-r border-[#d7d0c8] transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } h-full flex flex-col`}
    >
      <div className="p-4 flex justify-between items-center">
        {!collapsed && (
          <h2 className="text-lg font-bold text-[#011638] truncate">
            {businesses.find((b) => b.id === currentId)?.name}
          </h2>
        )}
        <button onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        <NavLink to="" end className={({ isActive }) => linkClass(isActive)}>
          <FaStore /> {!collapsed && "Overview"}
        </NavLink>
        <NavLink to="stores" className={({ isActive }) => linkClass(isActive)}>
          <FaBuilding /> {!collapsed && "Stores"}
        </NavLink>
        <NavLink to="staff" className={({ isActive }) => linkClass(isActive)}>
          <FaUser /> {!collapsed && "Staff"}
        </NavLink>
        <NavLink to="clerks" className={({ isActive }) => linkClass(isActive)}>
          <FaUser /> {!collapsed && "Clerks"}
        </NavLink>
        <NavLink to="inventory" className={({ isActive }) => linkClass(isActive)}>
          <FaBoxes /> {!collapsed && "Inventory"}
        </NavLink>
        <NavLink to="suppliers" className={({ isActive }) => linkClass(isActive)}>
          <FaTruck /> {!collapsed && "Suppliers"}
        </NavLink>
        <NavLink to="payments" className={({ isActive }) => linkClass(isActive)}>
          <FaMoneyBill /> {!collapsed && "Payments"}
        </NavLink>
        <NavLink to="reports" className={({ isActive }) => linkClass(isActive)}>
          <FaChartBar /> {!collapsed && "Reports"}
        </NavLink>
        <NavLink to="settings" className={({ isActive }) => linkClass(isActive)}>
          <FaCog /> {!collapsed && "Settings"}
        </NavLink>
      </nav>

      <div className="border-t border-[#d7d0c8] p-2 space-y-1">
        <button
          onClick={() => navigate("/merchant/dashboard")}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#011638] hover:bg-[#e0dedc] rounded"
        >
          <FaArrowLeft /> {!collapsed && "Back to Dashboard"}
        </button>

        {/* Optional: switch business */}
        {!collapsed &&
          businesses
            .filter((b) => b.id !== currentId)
            .map((b) => (
              <button
                key={b.id}
                onClick={() => navigate(`/merchant/businesses/${b.id}`)}
                className="w-full text-left px-4 py-1 text-sm text-[#5e574d] hover:underline"
              >
                Switch to {b.name}
              </button>
            ))}
      </div>
    </aside>
  );
};

export default Sidebar;
