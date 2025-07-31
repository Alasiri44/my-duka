import React from "react";
import AdminLayout from "../components/admin/AdminLayout";
import StoreOverview from "../components/shared/store/StoreOverview";
import AdminSupplyRequests from "../pages/dashboards/admin/supply_requests.jsx";
import Reports from "../components/admin/Reports";
import ProtectedRoute from "./ProtectedRoute";
import StaffView from "@/components/merchant/staff/StaffView";
import StoreInventory from "@/components/shared/store/inventory/StoreInventory";
import StockEntries from "@/components/shared/store/inventory/StockEntries";
import StockExits from "@/components/shared/store/inventory/exits/StockExits";
import ClerksPage from "../pages/dashboards/admin/ ClerksPage.jsx";

const adminRoutes = [
  {
    path: "/admin",
    element: <ProtectedRoute />, 
    children: [
      {
        path: "",
        element: <AdminLayout />,
        children: [
          { path: "", element: <StoreOverview /> },
          { path: "supply-requests", element: < AdminSupplyRequests /> },
          {path:"staff", element:<StaffView/>},
          {path:"inventory", element:<StoreInventory/>},
          {path:"entries", element:<StockEntries/>},
          {path:"exits", element:<StockExits/>},
          { path: "payments", element: <div>Admin Payments Page</div> },
          { path: "suppliers", element: <div>Suppliers Page</div> },
          { path: "reports", element: <Reports /> },
          { path: "clerks", element: <ClerksPage /> }, 
          { path: "settings", element: <div>Admin Settings</div> },
        ],
      },
    ],
  },
];

export default adminRoutes;
