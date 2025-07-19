import React, { useState, useEffect } from "react";
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
import { motion } from "framer-motion";

const Sidebar = ({ businesses, currentId, user, store }) => {
  
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [isMobile]);

  const linkClass = (isActive) =>
    `flex items-center gap-2 px-4 py-2 rounded hover:bg-[#e0dedc] transition text-sm ${
      isActive ? "bg-[#d7d0c8] font-semibold" : "text-[#011638]"
    }`;

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="bg-[#f2f0ed] border-r border-[#d7d0c8] h-full flex flex-col fixed md:relative z-50 overflow-hidden shadow-xl/50"
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
        {user.role === "merchant" && (
          <deiv>
            <NavLink
              to=""
              end
              className={({ isActive }) => linkClass(isActive)}
            >
              <FaStore /> {!collapsed && "Overview"}
            </NavLink>
            <NavLink
              to="stores"
              className={({ isActive }) => linkClass(isActive)}
            >
              <FaBuilding /> {!collapsed && "Stores"}
            </NavLink>
            <NavLink
              to="staff"
              className={({ isActive }) => linkClass(isActive)}
            >
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
            <NavLink
              to="reports"
              className={({ isActive }) => linkClass(isActive)}
            >
              <FaChartBar /> {!collapsed && "Reports"}
            </NavLink>
            <NavLink
              to="settings"
              className={({ isActive }) => linkClass(isActive)}
            >
              <FaCog /> {!collapsed && "Settings"}
            </NavLink>
          </deiv>
        )}
        {user.role === "admin" && (
          <div>
            <NavLink
              to="admin"
              className={({ isActive }) => linkClass(isActive)}
            >
              <h3> Admin Section</h3>
            </NavLink>
            <NavLink
              to="reports"
              className={({ isActive }) => linkClass(isActive)}
            >
              <FaCog /> {!collapsed && "Performance"}
            </NavLink>

            <NavLink
              to="supply-requests"
              className={({ isActive }) => linkClass(isActive)}
            >
              <FaCog /> {!collapsed && "Supply Requests"}
            </NavLink>

            <NavLink
              to="payments"
              className={({ isActive }) => linkClass(isActive)}
            >
              <FaCog /> {!collapsed && "Supplier Payments"}
            </NavLink>

            <NavLink
              to="clerks"
              className={({ isActive }) => linkClass(isActive)}
            >
              <FaCog /> {!collapsed && "Manage Clerks"}
            </NavLink>
          </div>
        )}
        {user.role === "clerk" && (
          <div>
            <NavLink
              to="admin"
              className={({ isActive }) => linkClass(isActive)}
            >
              <h3> Clerk Dashboard</h3>
            </NavLink>
            <NavLink
              to="reports"
              className={({ isActive }) => linkClass(isActive)}
            >
              <FaCog /> {!collapsed && "Performance"}
            </NavLink>

            <NavLink
              to="supply-requests"
              className={({ isActive }) => linkClass(isActive)}
            >
              <FaCog /> {!collapsed && "Supply Requests"}
            </NavLink>

            <NavLink
              to="payments"
              className={({ isActive }) => linkClass(isActive)}
            >
              <FaCog /> {!collapsed && "Supplier Payments"}
            </NavLink>

            <NavLink
              to="clerks"
              className={({ isActive }) => linkClass(isActive)}
            >
              <FaCog /> {!collapsed && "Manage Clerks"}
            </NavLink>
          </div>
        )}
      </nav>

      <div className="border-t border-[#d7d0c8] p-2 space-y-1">
        <button
          onClick={() => navigate("/merchant/dashboard")}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#011638] hover:bg-[#ec4e20] rounded"
        >
          <FaArrowLeft /> {!collapsed && "Back to Dashboard"}
        </button>

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
    </motion.aside>
  );
};

export default Sidebar;
