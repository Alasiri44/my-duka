import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import adminRoutes from "./routes/admin";
import clerkRoutes from "./routes/clerks";
import merchantRoutes from "./routes/merchant";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { setUser } from "./redux/slices/authSlice";

const testUsers = [
  {
    id: 1,
    first_name: "Mary",
    last_name: "Merchant",
    email: "mary@duka.com",
    role: "merchant",
  },
  {
    id: 2,
    store_id: 2,
    first_name: "Thomas",
    last_name: "Harison",
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

  // Decide which routes to expose based on role
  let roleRoutes = [];
  if (user.role === "admin") roleRoutes = adminRoutes;
  else if (user.role === "clerk") roleRoutes = clerkRoutes;
  else if (user.role === "merchant") roleRoutes = merchantRoutes;

  const redirectPath = localStorage.getItem("redirectAfterLogin");
  localStorage.removeItem("redirectAfterLogin");

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to={redirectPath || `/${user.role}`} replace />,
    },
    ...roleRoutes,
    {
      path: "*",
      element: <div className="p-10 text-center text-red-600 text-lg">404: Page not found</div>,
    },
  ]);

  return <RouterProvider router={router} />;
}
