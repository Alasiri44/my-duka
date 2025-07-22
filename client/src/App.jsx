import React from "react";
import { useDispatch, useSelector } from "react-redux";
import merchantRoutes from "./routes/merchant";
import adminRoutes from "./routes/admin";
import clerkRoutes from "./routes/clerk";
import { Routes, Route } from "react-router-dom";
import { setUser } from './redux/slices/authSlice'; // Adjusted path for redux
import Login from "./pages/authentication/login";

// const merchantRouter = createBrowserRouter(merchantRoutes);
// const adminRouter = createBrowserRouter(adminRoutes);
// const clerkRouter = createBrowserRouter(clerkRoutes);

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
  const user  = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  console.log(user)
  if (!user) {
    return (
      < Login/>
    );
  }

    const getRoutesByRole = (role) => {
    if (!role) return merchantRoutes;
    if (role === "admin") return adminRoutes;
    if (role === "clerk") return clerkRoutes;
    return [];
  };

  const roleRoutes = getRoutesByRole(user.role);

  return (
    <>
 <Routes>
      {roleRoutes.map(({ path, element }, idx) => (
        <Route key={idx} path={path} element={element} />
      ))}
    </Routes>
    </>
  );
}
