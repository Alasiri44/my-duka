import React from "react";
import AdminLayout from "../components/admin";
import SupplyRequestTable from "../components/admin/SupplyRequestTable";
import Reports from '../components/admin/Reports'
import AddClerk from "../pages/dashboards/admin/AddClerk";
import StoreLayout from "../components/shared/store/StoreLayout";
import StoreOverview from "../components/shared/store/StoreOverview";
import { useSelector, useDispatch } from "react-redux";


const { user } = useSelector((state) => state.auth);


const adminRoutes = [
  {
    path: "/",
    element: <AdminLayout />, // layout with sidebar
    children: [
     {
        path: "",
        element: <StoreOverview context={{ storeId: Number(user.store_id), store,}} />,
      },
      {
        path: "settings",
        element: <div>Settings Page</div>,
      },
      // Admin Routes
      {
        path: "supply-requests",
        element: <SupplyRequestTable />,
      },
      {
        path: "supply-requests",
        element: <SupplyRequestTable />,
      },
      {
        path: "suppliers",
        element: <div>Admin Suppliers Page or Layout</div>,
      },
      {
        path: "payments",
        element: <div>Admin Payments Page or Layout</div>,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "clerks",
        element: <AddClerk />,
      },
    ],
  },
];

export default adminRoutes