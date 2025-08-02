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
import  AddTeam from '../Pages/Team/AddTeam';
import  EditTeam  from "../Pages/Team/EditTeam";
import  AllTeam  from "../Pages/Team/AllTeam";
import  AddNews  from "../Pages/News/AddNews";
import  EditNews  from "../Pages/News/EditNews";
import  AllNews from "../Pages/News/AllNews";
import { AddAlbum } from "../Pages/Album/AddAlbum";
import { EditAlbum } from "../Pages/Album/EditAlbum";
import { AllAlbum } from "../Pages/Album/AllAlbum";
import { AddPhoto } from "../Pages/Photo/AddPhoto";
import { EditPhoto } from "../Pages/Photo/EditPhoto";
import { AllPhoto } from "../Pages/Photo/AllPhoto";
import { MediaGallery } from "../Pages/Media/MediaGallery";
import EditAbout from "../Pages/Media/EditAbout";
import { EditContact } from "../Pages/Media/EditContact";
import AddMenu from "../Pages/Menu/AddMenu";

import  EditMenu  from "../Pages/Menu/EditMenu";
import  AllMenu  from "../Pages/Menu/AllMenu";

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
     

      { path: "/menu/add", element: <AddMenu /> },
      { path: "/menu/edit/:id", element: <EditMenu /> },
      { path: "/menu", element: <AllMenu /> },

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

      { path: "/news/add", element: <AddNews /> },
      { path: "/news/edit/:id", element: <EditNews /> },
      { path: "/news", element: <AllNews /> },

      { path: "/album/add", element: <AddAlbum /> },
      { path: "/albums/edit/:id", element: <EditAlbum /> },
      { path: "/albums", element: <AllAlbum /> },

      { path: "/photo/add", element: <AddPhoto /> },
      { path: "/photos/edit/:id", element: <EditPhoto /> },
      { path: "/photos", element: <AllPhoto /> },


      { path: "/media", element: <MediaGallery /> },

      { path: "/about/edit", element: <EditAbout /> },
      { path: "/contact/edit", element: <EditContact /> },



    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
