import React from "react";
import AdminLayout from "../components/admin/AdminLayout";
import StoreOverview from "../components/shared/store/StoreOverview";
import SupplyRequestTable from "../components/admin/SupplyRequestTable";
import Reports from "../components/admin/Reports";
import AddClerk from "../pages/dashboards/admin/AddClerk";
import ProtectedRoute from "./ProtectedRoute";

const adminRoutes = [
  {
    path: "/admin",
    element: <ProtectedRoute />, // redirects if not logged in
    children: [
      {
        path: "",
        element: <AdminLayout />,
        children: [
          { path: "", element: <StoreOverview /> },
          { path: "supply-requests", element: <SupplyRequestTable /> },
          { path: "payments", element: <div>Admin Payments Page</div> },
          { path: "suppliers", element: <div>Suppliers Page</div> },
          { path: "reports", element: <Reports /> },
          { path: "clerks", element: <AddClerk /> },
          { path: "settings", element: <div>Admin Settings</div> },
        ],
      },
    ],
  },
];

export default adminRoutes;
