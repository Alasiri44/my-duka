import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from './store/index.js'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./router.jsx";

const router = createBrowserRouter(routes)

const root = createRoot(document.getElementById("root"));
root.render(
  < RouterProvider router={router}/>
  // <Provider store={store}>
  //   <App />
  // </Provider>
);
