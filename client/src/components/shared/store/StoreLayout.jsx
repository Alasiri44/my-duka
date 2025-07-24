import React, { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useParams,
  useNavigate,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const StoreLayout = () => {
  const { storeId } = useParams();
  const { role = "merchant" } = useOutletContext() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const [store, setStore] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    fetch(`http://localhost:3000/stores/${storeId}`)
      .then((res) => res.json())
      .then((data) => setStore(data));
  }, [storeId]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allTabs = [
    { label: "Overview", path: "", roles: ["merchant", "admin", "clerk"] },
    { label: "Staff", path: "staff", roles: ["merchant", "admin"] },
    { label: "Inventory", path: "inventory", roles: ["merchant", "admin", "clerk"] },
    { label: "Entries", path: "entries", roles: ["merchant", "admin", "clerk"] },
    { label: "Exits", path: "exits", roles: ["merchant", "admin", "clerk"] },
    { label: "Reports", path: "reports", roles: ["merchant", "admin"] },
    { label: "Settings", path: "settings", roles: ["merchant", "admin"] },
  ];

  const tabs = allTabs.filter((tab) => tab.roles.includes(role));

  const currentTab =
    tabs.find(
      (tab) =>
        location.pathname.endsWith(`/${tab.path}`) ||
        (tab.path === "" && location.pathname.endsWith(`/stores/${storeId}`))
    ) || tabs[0];

  if (!store) {
    return <div className="p-6 text-[#5e574d] text-sm">Loading store...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fdfdfd] px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#011638]">{store.name}</h1>
        <p className="text-sm text-[#5e574d]">{store.location}</p>
      </div>

      
      {isMobile ? (
        <div className="mb-4">
          <select
            value={currentTab.path}
            onChange={(e) => navigate(e.target.value)}
            className="w-full border border-[#d7d0c8] p-2 rounded text-sm"
          >
            {tabs.map((tab) => (
              <option key={tab.path} value={tab.path}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="flex gap-4 border-b border-[#d7d0c8] mb-4">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === ""}
              className={({ isActive }) =>
                `pb-1 px-2 border-b-2 text-sm font-medium transition ${
                  isActive
                    ? "border-[#ec4e20] text-[#011638]"
                    : "border-transparent text-[#5e574d] hover:text-[#011638]"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      )}

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-[#f2f0ed]"
        >
          <Outlet context={{ storeId: Number(storeId), store, role}} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StoreLayout;
