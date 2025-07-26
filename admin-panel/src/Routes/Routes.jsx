// src/Routes/router.jsx

import { createBrowserRouter } from "react-router-dom";
import Root from "../Pages/Root/Root";
import Dashboard from "../Pages/Dashboard";
import Users from "../Pages/Users";
import Settings from "../Pages/Settings";
import Login from "../Pages/Auth/Login";
import PrivateRoute from "./PrivateRoute"; // ✅ Adjust path if needed
import Profile from "../Pages/Auth/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Root />
      </PrivateRoute>
    ),
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/users", element: <Users /> },
      { path: "/settings", element: <Settings /> },
      { path: "/profile", element: <Profile /> }
    ],
  },
  {
    path: "/login",
    element: <Login />, // Public route
  },
]);
