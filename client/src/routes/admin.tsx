import React from "react";
import AdminLayout from "../components/admin";
import SupplyRequestTable from "../components/admin/SupplyRequestTable";
import Reports from '../components/admin/Reports'

const adminRoutes = [
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
        element: <Reports />,
      },
      {
        path: "clerks",
        element: <div>Clerks Page</div>,
      },
    ],
  },
];

export default adminRoutes