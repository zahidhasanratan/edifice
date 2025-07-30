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
import AddTestimonial from "../Pages/Testimonial/AddTestimonial";
import AllTestimonials from "../Pages/Testimonial/AllTestimonials";
import EditTestimonial from "../Pages/Testimonial/EditTestimonial";
import { AddProject } from "../Pages/Projects/AddProject";
import { EditProject } from "../Pages/Projects/EditProject";
import { AllProjects } from "../Pages/Projects/AllProjects";
import AddTeam from '../Pages/Team/AddTeam';
import  EditTeam  from "../Pages/Team/EditTeam";
import  AllTeam  from "../Pages/Team/AllTeam";

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
      { path: "/profile", element: <Profile /> }, 
     
      { path: "/sliders", element: <AllSliders /> },
      { path: "/sliders/add", element: <AddSlider /> },
      { path: "/sliders/edit/:id", element: <EditSlider /> },
      
      {path: "/testimonial", element: <AllTestimonials />},
      {path: "/testimonial/add", element: <AddTestimonial />},
      { path: "/testimonials/edit/:id", element: <EditTestimonial /> },

      { path: "/projects/add", element: <AddProject /> },
      { path: "/projects/edit/:id", element: <EditProject /> },
      { path: "/projects", element: <AllProjects /> },

      { path: "/team/add", element: <AddTeam /> },
      { path: "/team/edit/:id", element: <EditTeam /> },
      { path: "/team", element: <AllTeam /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
