import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import merchantRoutes from "./routes/merchant";
import adminRouts from "./routes/admin";
import clerkRoutes from "./routes/clerk";
import { RouterProvider, createBrowserRouter } from "react-router-dom";


const merchantRouter = createBrowserRouter(merchantRoutes);
const adminRouter = createBrowserRouter(adminRouts);
const clerkRouter = createBrowserRouter(clerkRoutes);


export default function App() {
  const { user, store } = useSelector((state) => state.auth);
  
  return (
    <div>
      {user.role === "merchant" && <RouterProvider router={merchantRouter} />}
      {user.role === "admin" && <RouterProvider router={adminRouter} />}
      {user.role === "clerk" && <RouterProvider router={clerkRouter} />}
    </div>
  );
}
