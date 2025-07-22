import React from "react";
import { useDispatch, useSelector } from "react-redux";
import merchantRoutes from "./routes/merchant";
import adminRoutes from "./routes/admin";
import clerkRoutes from "./routes/clerk";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { setUser } from './redux/slices/authSlice'; // Adjusted path for redux

const merchantRouter = createBrowserRouter(merchantRoutes);
const adminRouter = createBrowserRouter(adminRoutes);
const clerkRouter = createBrowserRouter(clerkRoutes);

const testUsers = [
  {
    id: 1,
    first_name: "Stephen",
    last_name: "Njenga",
    email: "stephen@myduka.co.ke",
    role: "merchant",
  },
  {
    id: 2,
    store_id: 1,
    first_name: "Andy",
    last_name: "Admin",
    email: "andy@duka.com",
    role: "admin",
  },
  {
    id: 3,
    store_id: 1,
    first_name: "Clara",
    last_name: "Clerk",
    email: "clara@duka.com",
    role: "clerk",
  },
];

export default function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fdfdfd] flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold text-[#011638]">Login as a Test User</h1>
        {testUsers.map((u) => (
          <button
            key={u.id}
            className="bg-[#011638] text-white px-6 py-2 rounded hover:bg-[#000f2a] transition"
            onClick={() => dispatch(setUser(u))}
          >
            {u.first_name} ({u.role})
          </button>
        ))}
      </div>
    );
  }

  return (
    <>
      {user.role === "merchant" && <RouterProvider router={merchantRouter} />}
      {user.role === "admin" && <RouterProvider router={adminRouter} />}
      {user.role === "clerk" && <RouterProvider router={clerkRouter} />}
    </>
  );
}
