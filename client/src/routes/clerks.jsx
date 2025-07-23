import React from "react";
import {} from "react-router-dom";
import ClerkLayout from "../components/clerk/index";
import ClerkDash from "../pages/dashboards/clerk/ClerkDash";
import Inventory from "../pages/dashboards/clerk/Inventory"; 
import CategoryPage from "../pages/dashboards/clerk/CategoryPage";
import ProductDetail from "../pages/dashboards/clerk/ProductDetail";
import AddProduct from "../pages/dashboards/clerk/AddProduct";
import ClerkStockEntries from "../pages/dashboards/clerk/ClerkStockEntries";
import StockExits from "../pages/dashboards/clerk/StockExits";

const clerkRoutes = [
  {
    path: "/",
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
      { path: "stock-entries",
        element: <ClerkStockEntries /> 
      },
      {
        path: "stock-exits",
        element: <StockExits />
      }
    ],
  },
];

export default clerkRoutes;