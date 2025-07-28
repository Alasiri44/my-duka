import React from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import BusinessLayout from "../pages/dashboards/merchant/BusinessLayout";
import BusinessOverview from "../pages/dashboards/merchant/Overview";
import Stores from "../pages/dashboards/merchant/Stores";
import MerchantDashboard from "../pages/dashboards/merchant/MerchantDashboard";

import StoreLayout from "../components/shared/store/StoreLayout";
import StoreOverview from "../components/shared/store/StoreOverview";
import StaffView from "../components/merchant/staff/StaffView";
import StoreInventory from "../components/shared/store/inventory/StoreInventory";
import StockEntries from "../components/shared/store/inventory/StockEntries";
import StockExits from "../components/shared/store/inventory/exits/StockExits";
import BusinessStaffView from "../components/merchant/business/BusinessStaffView";
import BusinessInventoryView from "../components/merchant/business/BusinessInventoryView";
import BusinessSuppliersView from "../components/merchant/business/BusinessSuppliersView";
import BusinessPaymentsView from "../components/merchant/business/BusinessPaymentsView";
import BusinessSettingsView from "../components/merchant/business/BusinessSettingsView";

const merchantRoutes = [
  {
    path: "/merchant",
    element: <ProtectedRoute allowedRoles={["merchant"]} />,
    children: [
      {
        index: true,
        element: <MerchantDashboard />, 
      },
      {
        path: "businesses/:id",
        element: <BusinessLayout />,
        children: [
          { index: true, element: <BusinessOverview /> },
          { path: "stores", element: <Stores /> },
          { path: "staff", element: <BusinessStaffView /> },
          { path: "inventory", element: <BusinessInventoryView /> },
          { path: "suppliers", element: <BusinessSuppliersView /> },
          { path: "payments", element: <BusinessPaymentsView />},
          { path: "reports", element: <div>Reports Page</div> },
          { path: "settings", element: <BusinessSettingsView/> },
          {
            path: "stores/:storeId",
            element: <StoreLayout />,
            children: [
              { index: true, element: <StoreOverview /> },
              { path: "staff", element: <StaffView /> },
              { path: "inventory", element: <StoreInventory /> },
              { path: "entries", element: <StockEntries /> },
              { path: "exits", element: <StockExits /> },
              // { path: "reports", element: <Reports /> },
              // { path: "settings", element: <Settings /> },
            ],
          },
        ],
      },
    ],
  },
];

export default merchantRoutes;
