import React from "react";
import MerchantDashboard from "../pages/dashboards/merchant/MerchantDashboard";
import BusinessOverview from "../pages/dashboards/merchant/Overview";
import Stores from "../pages/dashboards/merchant/Stores";
import MerchantLayout from "../components/merchant";

const merchantRouter = [
  {
    path: "/",
    element: <MerchantLayout />, // layout with sidebar
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

      
    ],
  },
];


export default merchantRouter