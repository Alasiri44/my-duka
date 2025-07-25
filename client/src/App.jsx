import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import adminRoutes from "./routes/admin";
import clerkRoutes from "./routes/clerk";
import merchantRoutes from "./routes/merchant";
import { RouterProvider, createBrowserRouter, Navigate, BrowserRouter } from "react-router-dom";
import { setUser } from "./redux/slices/authSlice";
import Login from "./pages/authentication/login";
import Signup from "./pages/authentication/signup";

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
    store_id: 1,
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
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  console.log(user)

  if (!user) {
    const router = createBrowserRouter([
      {
      path: '/signup',
      element: < Signup/>
    },
      {
        path: "*",
        element: <Login />,
      },
    ]);

    return <RouterProvider router={router} />;
  }


  
 
  let roleRoutes = [];

  if (user?.role === "admin") roleRoutes = adminRoutes;
  else if (user?.role === "clerk") roleRoutes = clerkRoutes;
  else{
    roleRoutes = merchantRoutes
  }

  const redirectPath = localStorage.getItem("redirectAfterLogin");
  localStorage.removeItem("redirectAfterLogin");
  

  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login/>
    },
    {
      path: '/signup',
      element: < Signup/>
    },
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
