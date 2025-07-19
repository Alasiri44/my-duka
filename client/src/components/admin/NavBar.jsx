// /components/business/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaArrowLeft,
  FaStore,
  FaUser,
  FaBoxes,
  FaTruck,
  FaMoneyBill,
  FaChartBar,
  FaCog,
  FaBuilding,
} from "react-icons/fa";

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
        <NavLink
          to="inventory"
          className={({ isActive }) => linkClass(isActive)}
        >
          <FaBoxes /> {!collapsed && "Inventory"}
        </NavLink>
        <NavLink
          to="suppliers"
          className={({ isActive }) => linkClass(isActive)}
        >
          <FaTruck /> {!collapsed && "Suppliers"}
        </NavLink>
        <NavLink
          to="payments"
          className={({ isActive }) => linkClass(isActive)}
        >
          <FaMoneyBill /> {!collapsed && "Payments"}
        </NavLink>
        <NavLink to="reports" className={({ isActive }) => linkClass(isActive)}>
          <FaChartBar /> {!collapsed && "Reports"}
        </NavLink>
        <NavLink
          to="settings"
          className={({ isActive }) => linkClass(isActive)}
        >
          <FaCog /> {!collapsed && "Settings"}
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
