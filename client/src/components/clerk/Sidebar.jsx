import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBoxes,
  FaPlus,
  FaChartBar,
  FaArrowDown,
  FaArrowUp,
  FaSignOutAlt,
  FaDolly,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Sidebar = ({ user, store }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const linkClass = (isActive) =>
    `flex items-center gap-2 px-4 py-2 rounded hover:bg-[#e0dedc] transition text-sm ${
      isActive ? "bg-[#d7d0c8] font-semibold" : "text-[#011638]"
    }`;

  const handleLogout = () => {
    axios
      .delete("http://localhost:5000/logout", { withCredentials: true })
      .then((res) => {
        console.log("Logged out:", res.data.message);
        navigate("/login");
      })
      .catch((err) => {
        console.error("Logout failed:", err);
        alert("Logout failed. Please try again.");
      });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Hamburger Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-[#f2f0ed] p-2 rounded shadow-md"
        >
          <FaBars />
        </button>
      )}

      {/* Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: isMobile ? -300 : 0 }}
            animate={{ x: 0 }}
            exit={{ x: isMobile ? -300 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className={`bg-[#f2f0ed] border-r border-[#d7d0c8] h-screen flex flex-col shadow-xl
              ${isMobile ? "fixed z-50" : "relative"}
              ${collapsed ? "w-16" : "w-64"}
            `}
          >
            {/* Header */}
            <div className="p-4 flex justify-between items-center">
              {!collapsed && (
                <h2 className="text-lg font-bold text-[#011638] truncate">
                  {store?.name || "Store"}
                </h2>
              )}
              {!isMobile && (
                <button onClick={() => setCollapsed(!collapsed)}>
                  <FaBars />
                </button>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-2">
              <NavLink to="" end className={({ isActive }) => linkClass(isActive)}>
                <FaChartBar /> {!collapsed && "Dashboard"}
              </NavLink>
              <NavLink to="inventory" className={({ isActive }) => linkClass(isActive)}>
                <FaBoxes /> {!collapsed && "Inventory"}
              </NavLink>
              <NavLink to="add-product" className={({ isActive }) => linkClass(isActive)}>
                <FaPlus /> {!collapsed && "Add Product"}
              </NavLink>
              <NavLink to="record-exits" className={({ isActive }) => linkClass(isActive)}>
                <FaSignOutAlt /> {!collapsed && "Release Batch"}
              </NavLink>
              <NavLink to="stock-entries" className={({ isActive }) => linkClass(isActive)}>
                <FaArrowDown /> {!collapsed && "Store Entries"}
              </NavLink>
              <NavLink to="stock-exits" className={({ isActive }) => linkClass(isActive)}>
                <FaArrowUp /> {!collapsed && "Store Exits"}
              </NavLink>
              <NavLink to="supply-requests" className={({ isActive }) => linkClass(isActive)}>
                <FaDolly /> {!collapsed && "Supply Request"}
              </NavLink>
            </nav>

            {/* Logout */}
            <div className="p-2 border-t border-[#d7d0c8]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-[#e0dedc] rounded transition"
              >
                <FaSignOutAlt /> {!collapsed && "Logout"}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

Sidebar.defaultProps = {
  user: {},
  store: {},
};

export default Sidebar;
