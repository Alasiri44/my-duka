import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import adminRoutes from "./routes/admin";
import clerkRoutes from "./routes/clerks";
import merchantRoutes from "./routes/merchant";
import { RouterProvider, createBrowserRouter, Navigate, BrowserRouter } from "react-router-dom";
import { setUser } from "./redux/slices/authSlice";
import Login from "./pages/authentication/login";
import Signup from "./pages/authentication/signup";
import LandingPage from "./pages/landingPage";
import CheckSession from "./utils/session";
import { Toaster } from 'react-hot-toast';

import PaymentForm from "./pages/payments/paymentForm";
import CustomerPaymentForm from "./pages/payments/customerPaymentForm";

export default function App() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const check = async () => {
      await CheckSession(dispatch);
      setLoading(false);
    };
    check();
  }, [dispatch]);

  useEffect(() => {
  CheckSession(dispatch).then(() => {
    console.log("Session check complete");
  });
}, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 "><i className="fa fa-spinner fa-spin bg-blue-500 w-[60px]"></i>Loading...</p>
      </div>
    );
  }


  // Decide which routes to expose based on role
 let roleRoutes = [];

if (user?.role === "admin") roleRoutes = adminRoutes;
else if (user?.role === "clerk") roleRoutes = clerkRoutes;
else if (user?.role === "merchant") roleRoutes = merchantRoutes;

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
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

  return  (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </>
  );
}
