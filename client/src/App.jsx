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
import PaymentForm from "./pages/payments/paymentForm";

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
  const user = testUsers[1]
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const check = async () => {
      // await CheckSession(dispatch);
      setLoading(false);
    };
    check();
  }, [dispatch]);

  console.log(user, loading)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 "><i className="fa fa-spinner fa-spin bg-blue-500 w-[60px]"></i>Loading...</p>
      </div>
    );
  }

  if (!user) {
    const router = createBrowserRouter([
      {
        path: '/signup',
        element: < Signup />
      },{
        path: '/payment',
        element: < PaymentForm/>
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: '/',
        element: < LandingPage />
      },
      {
        path: "*",
        element: < Navigate to='/' />,
      },
    ]);

    return <RouterProvider router={router} />;
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
  ...adminRoutes,
  {
    path: "*",
    element: user?.role
      ? <Navigate to={`/${user.role}`} replace />
      : <Navigate to="/" />,
  },
]);

  return <RouterProvider router={router} />;
}
