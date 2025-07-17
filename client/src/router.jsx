import React from "react";
import App from "./App";
import AdminHome from "./pages/dashboards/admin/home";

export const routes = [
    {
        path: '/',
        element: < App/>
    },
    {
        path: '/admin',
        element: < AdminHome/>
    }
]