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
import { IoIosArrowDroprightCircle, IoIosArrowDropdownCircle } from "react-icons/io";

import { motion } from "framer-motion";
import Logo from "../../assets/logo.svg";

const Sidebar = ({  businesses, currentId, stores  }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [storesOpen, setStoresOpen] = useState(false);
  // const [stores, setStores] = useState([]);


  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [isMobile]);

  const currentBusiness = businesses.find((b) => b.id === currentId);

  const linkClass = (isActive) =>
    `flex items-center gap-2 px-4 py-2 rounded hover:bg-[#e0dedc] transition text-sm ${
      isActive ? "bg-[#d7d0c8] font-semibold" : "text-[#011638]"
    }`;

  const sidebarWidth = collapsed && !isMobile ? 64 : 256;

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        animate={{
          width: sidebarWidth,
          x: collapsed && isMobile ? "-100%" : "0%",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="bg-[#f2f0ed] border-r border-[#d7d0c8] h-full flex flex-col fixed md:relative z-50 shadow-xl/50 overflow-hidden"
      >
        {/* Top section: logo and toggle */}
        <div
          className={`p-4 flex ${
            collapsed && !isMobile
              ? "flex-col items-center"
              : "items-center justify-between"
          }`}
        >
          <img
            src={Logo}
            alt="Company Logo"
            className={`transition-all ${collapsed ? "w-8 h-8 mb-2" : "w-10 h-10"}`}
          />

          {!collapsed && (
            <h2
              className="text-sm font-bold text-[#011638] truncate max-w-[120px]"
              title={currentBusiness?.name}
            >
              {currentBusiness?.name}
            </h2>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`${collapsed && !isMobile ? "" : "ml-auto"} text-[#011638]`}
          >
            <FaBars />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 px-2">
          <NavLink to="" end className={({ isActive }) => linkClass(isActive)}>
            <FaStore /> {!collapsed && "Overview"}
          </NavLink>

        
          {/* <NavLink to="stores" className={({ isActive }) => linkClass(isActive)}>
            <FaBuilding /> {!collapsed && "Stores"}
          </NavLink> */}

         <div className="relative">
  <div className="flex items-center justify-between pr-2">
    <NavLink to="stores" className={({ isActive }) => linkClass(isActive) + " flex-1"}>
      <FaBuilding /> {!collapsed && "Stores"}
    </NavLink>

    {!collapsed && (
      <button
        onClick={() => setStoresOpen(!storesOpen)}
        className="text-[#011638] text-xs px-1 hover:text-[#ec4e20] transition"
        title={storesOpen ? "Collapse" : "Expand"}
      >
        {storesOpen ? <IoIosArrowDropdownCircle size={25}/> : <IoIosArrowDroprightCircle size={25}/>
}
      </button>
    )}
  </div>

  {storesOpen && !collapsed && stores.length > 0 && (
    <ul className="ml-6 mt-1 space-y-1">
      {stores.map((s) => (
        <li key={s.id}>
          <NavLink
            to={`stores/${s.id}`}
            className={({ isActive }) =>
              `block px-3 py-1 rounded text-sm ${
                isActive ? "bg-[#d7d0c8] font-semibold" : "text-[#5e574d]"
              } hover:bg-[#e0dedc]`
            }
          >
            {s.name}
          </NavLink>
        </li>
      ))}
    </ul>
  )}
</div>



          <NavLink to="staff" className={({ isActive }) => linkClass(isActive)}>
            <FaUser /> {!collapsed && "Staff"}
          </NavLink>
          <NavLink to="inventory" className={({ isActive }) => linkClass(isActive)}>
            <FaBoxes /> {!collapsed && "Inventory"}
          </NavLink>
          <NavLink to="suppliers" className={({ isActive }) => linkClass(isActive)}>
            <FaTruck /> {!collapsed && "Suppliers"}
          </NavLink>
          <NavLink to="products" className={({ isActive }) => linkClass(isActive)}>
             <FaBoxes /> {!collapsed && "Products"}
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

        {/* Footer */}
        <div className="border-t border-[#d7d0c8] p-2 space-y-1">
          <button
            onClick={() => navigate("/")}
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

      {/* Mobile collapse toggle (if sidebar is collapsed and mobile) */}
      {isMobile && collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed top-4 left-4 z-50 bg-[#011638] text-white p-2 rounded shadow-md"
        >
          <FaBars />
        </button>
      )}
    </>
  );
};

export default Sidebar;
