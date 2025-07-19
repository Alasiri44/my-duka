import React from "react";
import AdminLayout from "../components/admin";
import SupplyRequestTable from "../components/admin/SupplyRequestTable";

const adminRoutes = [
  // {
  //   path: '/',
  //   element: < App />
  // },
  // {
  //   path: "/merchant/dashboard",
  //   element: <MerchantDashboard />,
  // },
  {
    path: "/",
    element: <AdminLayout />, // layout with sidebar
    children: [

      {
        path: "settings",
        element: <div>Settings Page</div>,
      },
      // Admin Routes
      {
        path: "supply-requests",
        element: <SupplyRequestTable />,
      },
      {
        path: "suppliers",
        element: <div>Admin Suppliers Page or Layout</div>,
      },
      {
        path: "payments",
        element: <div>Admin Payments Page or Layout</div>,
      },
      {
        path: "reports",
        element: <div>Admin Reports Page or Layout</div>,
      },
      {
        path: "clerks",
        element: <div>Clerks Page</div>,
      },
    ],
  },
];

export default adminRoutes