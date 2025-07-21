
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import merchantRoutes from "./routes/merchant";
import adminRouts from "./routes/admin";
import clerkRoutes from "./routes/clerk";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { setUser } from './store/authReducerSlice';

const merchantRouter = createBrowserRouter(merchantRoutes);
const adminRouter = createBrowserRouter(adminRouts);
const clerkRouter = createBrowserRouter(clerkRoutes);

export default function App() {
  const { user, store } = useSelector((state) => state.auth);
   const dispatch = useDispatch();

  if (!user)
    return (
      <div>
        Login Please.
        <br />
        <button onClick={() => dispatch(setUser({name: "Test", role: "merchant"}))}> I am Merchant </button> <br />
        <button onClick={() => dispatch(setUser({name: "Test", role: "admin"}))}> I am Admin </button> <br />
        <button onClick={() => dispatch(setUser({name: "Test", role: "clerk"}))} > I am Clerk </button> <br />
      </div>
    );

  return (
    <div>
      {user.role === "merchant" && <RouterProvider router={merchantRouter} />}
      {user.role === "admin" && <RouterProvider router={adminRouter} />}
      {user.role === "clerk" && <RouterProvider router={clerkRouter} />}
    </div>
  );

}

