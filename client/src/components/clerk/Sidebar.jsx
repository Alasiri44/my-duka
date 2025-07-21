import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars, FaBoxes, FaPlus, FaChartBar
} from "react-icons/fa";
import { motion } from "framer-motion";

const Sidebar = ({ user, store }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
            {store?.name || "Store"}
          </h2>
        )}
        <button onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        <NavLink
          to=""
          end
          className={({ isActive }) => linkClass(isActive)}
        >
          <FaChartBar /> {!collapsed && "Dashboard"}
        </NavLink>

        <NavLink
          to="inventory"
          className={({ isActive }) => linkClass(isActive)}
        >
          <FaBoxes /> {!collapsed && "Inventory"}
        </NavLink>

        <NavLink
          to="add-product"
          className={({ isActive }) => linkClass(isActive)}
        >
          <FaPlus /> {!collapsed && "Add Product"}
        </NavLink>
      </nav>
    </motion.aside>
  );
};

Sidebar.defaultProps = {
  user: {},
  store: {},
};

export default Sidebar;
