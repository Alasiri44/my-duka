import React from "react";
import { RouteObject } from "react-router-dom";
import ClerkLayout from "../components/clerk/index";
import ClerkDash from "../pages/dashboards/clerk/ClerkDash";
import Inventory from "../pages/dashboards/clerk/Inventory"; // renamed for clarity
import CategoryPage from "../pages/dashboards/clerk/CategoryPage";
import ProductDetail from "../pages/dashboards/clerk/ProductDetail";
import AddProduct from "../pages/dashboards/clerk/AddProduct";

const clerkRoutes: RouteObject[] = [
  {
    path: "/", // :id refers to the business/store ID
    element: <ClerkLayout />,
    children: [
      {
        index: true,
        element: <ClerkDash />,
      },
      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "inventory/category/:categoryId",
        element: <CategoryPage />,
      },
      {
        path: "inventory/products/:productId",
        element: <ProductDetail />,
      },
      {
        path: "add-product",
        element: <AddProduct />,
      },
    ],
  },
];

export default clerkRoutes;
