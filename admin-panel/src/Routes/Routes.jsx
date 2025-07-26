import { createBrowserRouter } from "react-router-dom";
import Root from "../Pages/Root/Root";
import Dashboard from "../Pages/Dashboard";
import Users from "../Pages/Users";
import Settings from "../Pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, // this one contains Sidebar
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/users", element: <Users /> },
      { path: "/settings", element: <Settings /> },
    ],
  },
]);
