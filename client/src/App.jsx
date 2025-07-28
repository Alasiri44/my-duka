import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import adminRoutes from "./routes/admin";
import clerkRoutes from "./routes/clerks";
import merchantRoutes from "./routes/merchant";

import Login from "./pages/authentication/login";
import Signup from "./pages/authentication/signup";
import LandingPage from "./pages/landingPage";
import CheckSession from "./utils/session"; // currently not used
import PaymentForm from "./pages/payments/paymentForm"; // currently not used
import CustomerPaymentForm from "./pages/payments/customerPaymentForm"; // currently not used

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // you can insert session check logic here if needed
    setLoading(false);
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Setup routes based on role
  let roleRoutes = [];
  if (user?.role === "admin") roleRoutes = adminRoutes;
  else if (user?.role === "clerk") roleRoutes = clerkRoutes;
  else if (user?.role === "merchant") roleRoutes = merchantRoutes;

  const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    {
      path: "/",
      element: user?.role
        ? <Navigate to={`/${user.role}`} replace />
        : <LandingPage />,
    },
    ...roleRoutes,
    {
      path: "*",
      element: user?.role
        ? <Navigate to={`/${user.role}`} replace />
        : <Navigate to="/" />,
    },
  ]);

  return <RouterProvider router={router} />;
}
