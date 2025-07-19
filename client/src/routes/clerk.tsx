import React from "react";
import ClerkLayout from "../components/clerk";

const clerkRoutes = [
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
    element: <ClerkLayout />, // layout with sidebar
    children: [
      {
        path: "suppliers",
        element: <div>clerk Suppliers Page or Layout</div>,
      },
      {
        path: "payments",
        element: <div>clerk Payments Page or Layout</div>,
      },
      {
        path: "reports",
        element: <div>clerk Reports Page or Layout</div>,
      },
      {
        path: "clerks",
        element: <div>Clerks Page</div>,
      },
    ],
  },
];

export default clerkRoutes
