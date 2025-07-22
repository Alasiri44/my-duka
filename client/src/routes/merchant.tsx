import React from "react";
// import MerchantDashboard from "../pages/dashboards/merchant/MerchantDashboard";
import BusinessLayout from "../pages/dashboards/merchant/BusinessLayout";
import BusinessOverview from "../pages/dashboards/merchant/Overview";
import Stores from "../pages/dashboards/merchant/Stores";
import StoreLayout from "../components/shared/store/StoreLayout";
import StoreOverview from "../components/shared/store/StoreOverview";
import StaffView from "../components/merchant/staff/StaffView";
import StoreInventory from "../components/shared/store/inventory/StoreInventory";
import StockEntries from "../components/shared/store/inventory/StockEntries";

import MerchantDashboard from "../pages/dashboards/merchant/MerchantDashboard";

export const routes = [

  {
    path: "/",
    element: <MerchantDashboard />,
  },
  {
    path: "/merchant/businesses/:id",
    element: <BusinessLayout />, // layout with sidebar
    children: [
      {
        index: true,
        element: <BusinessOverview />, // default to overview
      },
      {
        path: "stores",
        element: <Stores />,
      },
      {
        path: "staff",
        element: <div>Staff Page</div>,
      },
      {
        path: "inventory",
        element: <div>Inventory Page</div>,
      },
      {
        path: "suppliers",
        element: <div>Suppliers Page</div>,
      },
      {
        path: "payments",
        element: <div>Payments Page</div>,
      },
      {
        path: "reports",
        element: <div>Reports Page</div>,
      },
      {
        path: "settings",
        element: <div>Settings Page</div>,
      },
      {
        path: "stores/:storeId",
        element: <StoreLayout />,
      },

        {
  path: "stores/:storeId",
  element: <StoreLayout />,
  children: [
    { index: true, element: <StoreOverview /> },
    { path: "staff", element: <StaffView /> },
    { path: "inventory", element: <StoreInventory /> },
    { path: "entries", element: <StockEntries /> },
    // { path: "exits", element: <Exits /> },
    // { path: "reports", element: <Reports /> },
    // { path: "settings", element: <Settings /> },
  ],
},
    ],
  },
  
];

export default routes