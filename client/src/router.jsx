import React from "react";
import App from "./App";

// Merchant Imports
import MerchantDashboard from "./pages/dashboards/merchant/MerchantDashboard";
import BusinessLayout from "./pages/dashboards/merchant/BusinessLayout";
import BusinessOverview from "./pages/dashboards/merchant/Overview";
import Stores from "./pages/dashboards/merchant/Stores";
import StoreLayout from "./pages/dashboards/merchant/StoreLayout";
import StoreOverview from "./pages/dashboards/merchant/stores/StoreOverview";


// Clerk Imports
import Dashboard from './pages/dashboards/clerk/ClerkDash';
import Inventory from './pages/dashboards/clerk/Inventory';
import ProductDetail from './pages/dashboards/clerk/ProductDetail';
import AddProduct from './pages/dashboards/clerk/AddProduct';
import CategoryPage from "./pages/dashboards/clerk/CategoryPage";
import Login from "./pages/authentication/login";
import LandingPage from "./pages/landingPage";
import Signup from "./pages/authentication/signup";

export const routes = [
  {
    path: '/',
    element: <App />
  },
  {
    path: '/login',
    element: < Login/>
  },
  {
    path: '/signup',
    element: <  Signup/>
  },
  {
    path: '/landing_page',
    element: < LandingPage/>
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
      {
        path: "stores/:storeId",
        element: <StoreLayout />,
      },

        {
  path: "stores/:storeId",
  element: <StoreLayout />,
  children: [
    { index: true, element: <StoreOverview /> },
    // { path: "staff", element: <StaffView /> },
    // { path: "inventory", element: <StoreInventory /> },
    // { path: "entries", element: <StockEntries /> },
    // { path: "exits", element: <Exits /> },
    // { path: "reports", element: <Reports /> },
    // { path: "settings", element: <Settings /> },
  ],
},
    ],
  },
  
  // Clerk Routes (Only the paths fixed)
  {
    path: "/clerk/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/clerk/inventory",
    element: <Inventory />,
  },
  {
    path: "/clerk/inventory/category/:categoryId",
    element: <CategoryPage/>,
  },
  {
    path: "/clerk/inventory/products/:productId",
    element: <ProductDetail />,
  },
  {
    path: "/clerk/add-product",
    element: <AddProduct />,
  },
];
