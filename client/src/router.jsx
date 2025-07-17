import React from "react";
import App from "./App";
import MerchantDashboard from "./pages/dashboards/merchant/MerchantDashboard";
import BusinessLayout from "./pages/dashboards/merchant/BusinessLayout";
import BusinessOverview from "./pages/dashboards/merchant/Overview";
import Stores from "./pages/dashboards/merchant/Stores";

export const routes = [
  {
    path: '/',
    element: < App />
  },
  {
    path: "/merchant/dashboard",
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
    ],
  },
  {
    
  }
]