import React from "react";
import { NavLink, Outlet, useOutletContext, useLocation, Navigate } from "react-router-dom";

const tabs = [
  { path: "sales", label: "Sales Reports" },
  { path: "stock", label: "Stock Reports" },
  { path: "procurement", label: "Procurement & Payments" },
  { path: "suppliers", label: "Supplier Reports" },
  { path: "stores", label: "Store Performance" },
  { path: "users", label: "User Activity" },
];

const BusinessReports = () => {
  const { businessId, role, stores } = useOutletContext();
  const { pathname } = useLocation();

  // Redirect to /sales if the current path is exactly /reports
  if (pathname.endsWith("/reports")) {
    return <Navigate to="sales" replace />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#011638] mb-2">Reports</h1>
      <nav className="mb-4 border-b flex gap-4">
        {tabs.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `pb-2 border-b-2 ${
                isActive ? "border-[#ec4e20] text-[#ec4e20]" : "border-transparent text-gray-600"
              } hover:text-[#ec4e20]`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="bg-white rounded shadow p-4">
        <Outlet context={{ businessId, role, stores }} />
      </div>
    </div>
  );
};

export default BusinessReports;