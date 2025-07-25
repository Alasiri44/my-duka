import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaUserCircle, FaBoxes, FaChartBar, FaCog, FaUsers, FaSignOutAlt,FaTruckLoading } from "react-icons/fa";
import {LuPackagePlus} from "react-icons/lu"
import { TbPackageExport } from "react-icons/tb";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../redux/slices/authSlice"; // Adjust path as needed

const Sidebar = ({ businesses, currentId }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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

  const allTabs = [
    { label: "Overview", path: "", icon: FaChartBar, roles: ["merchant", "admin", "clerk"] },
    { label: "Staff", path: "staff", icon: FaUsers, roles: ["merchant", "admin"] },
    { label: "Inventory", path: "inventory", icon: FaBoxes, roles: ["merchant", "admin", "clerk"] },
    { label: "Stock Entries", path: "entries", icon: LuPackagePlus, roles: ["merchant", "admin", "clerk"] },
    { label: "Stock Exits", path: "exits", icon: TbPackageExport, roles: ["merchant", "admin", "clerk"] },
    { label: "Reports", path: "reports", icon: FaChartBar, roles: ["merchant", "admin"] },
    { label: "Settings", path: "settings", icon: FaCog, roles: ["merchant", "admin"] },
  ];

  const role = user?.role || "clerk";
  const tabs = allTabs.filter((tab) => tab.roles.includes(role));

  const handleLogout = () => {
    // dispatch(logout());
    navigate("/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="bg-[#f2f0ed] border-r border-[#d7d0c8] h-screen flex flex-col fixed md:relative z-50 overflow-hidden shadow-xl/50"
    >
      {/* Top Section */}
       <div className="px-4 pt-4 pb-2 border-b border-[#d7d0c8] flex items-center gap-2 transition-all">
  <FaUserCircle className="text-3xl text-[#011638]" />
  {!collapsed && (
    <div className="flex-1">
      <p className="text-sm font-semibold text-[#011638] leading-tight truncate">
        {user?.first_name} {user?.last_name}
      </p>
      <p className="text-xs text-[#5e574d] capitalize">{role}</p>
    </div>
  )}
  <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-[#011638]">
    <FaBars />
  </button>
</div>

      {/* Business Name */}
      {!collapsed && (
        <div className="px-4 pb-2">
          <h2 className="text-base font-bold truncate text-[#ec4e20]">
            {businesses.find((b) => b.id === currentId)?.name}
          </h2>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === ""}
              className={({ isActive }) => linkClass(isActive)}
            >
              {Icon && <Icon />} {!collapsed && tab.label}
            </NavLink>
          );
        })}
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
  );
};

export default Sidebar;
