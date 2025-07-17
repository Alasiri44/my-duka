import React from "react";
import App from "./App";
import MerchantDashboard from "./pages/dashboards/merchant/MerchantDashboard";

export const routes = [
    {
        path: '/',
        element: < App/>
    },
      {
    path: "/merchant/dashboard",
    element: <MerchantDashboard />,
  }
]