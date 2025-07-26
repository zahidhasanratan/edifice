// src/Routes/router.jsx

import { createBrowserRouter } from "react-router-dom";
import Root from "../Pages/Root/Root";
import Dashboard from "../Pages/Dashboard";
import Users from "../Pages/Users";
import Settings from "../Pages/Settings";
import Login from "../Pages/Auth/Login";
import PrivateRoute from "./PrivateRoute"; // ✅ Ensure this is correct
import Profile from "../Pages/Auth/Profile";
import AllSliders from "../Pages/Slider/AllSliders";
import AddSlider from "../Pages/Slider/AddSlider";
import EditSlider from "../Pages/Slider/EditSlider";

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
      { path: "/profile", element: <Profile /> }, // ✅ fixed comma here
      { path: "/sliders", element: <AllSliders /> },
      { path: "/sliders/add", element: <AddSlider /> },
      { path: "/sliders/edit/:id", element: <EditSlider /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
