import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaCog,
  FaImage,
  FaPlus,
  FaThList,
  FaQuoteRight,
  FaBuilding,
  FaNewspaper,
  FaPhotoVideo,
  FaFolderOpen,
} from "react-icons/fa";

const Sidebar = () => {
  const { pathname } = useLocation();
  const isActive = (path) => pathname === path ? "bg-primary text-white" : "";

  const closeDrawerOnMobile = () => {
    const drawerCheckbox = document.getElementById("dashboard-drawer");
    if (drawerCheckbox && drawerCheckbox.checked) {
      drawerCheckbox.checked = false;
    }
  };

  return (
    <aside className="w-64 min-h-screen border-r shadow-xl bg-base-200 border-base-300">
      {/* Logo and Title */}
      <div className="flex flex-col items-center justify-center p-6 text-center border-b border-base-300">
        <img
          src="/large-logo.png"
          alt="Company Logo"
          className="object-contain w-16 h-16 mt-12 lg:mt-0"
        />
        <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
      </div>

      {/* Navigation Menu */}
      <ul className="w-full p-4 space-y-2 menu">
        {/* Dashboard */}
        <li>
          <Link
            to="/"
            onClick={closeDrawerOnMobile}
            className={`btn btn-ghost w-full justify-start ${isActive("/")}`}
          >
            <FaTachometerAlt className="mr-2" /> Dashboard
          </Link>
        </li>

        <li>
          <Link to="/media" className="flex items-center gap-2">
            <FaPhotoVideo /> Media Gallery
          </Link>
        </li>

        {/* Settings */}
        {/* <li>
          <Link
            to="/settings"
            onClick={closeDrawerOnMobile}
            className={`btn btn-ghost w-full justify-start ${isActive("/settings")}`}
          >
            <FaCog className="mr-2" /> Settings
          </Link>
        </li> */}

        {/* Banners - Collapsible Submenu */}
        <li>
          <details className="group">
            <summary className="flex items-center justify-start w-full cursor-pointer btn btn-ghost">
              <FaImage className="mr-2" /> Banners
            </summary>
            <ul className="pl-8 space-y-1">
              <li>
                <Link
                  to="/sliders/add"
                  onClick={closeDrawerOnMobile}
                  className={`btn btn-ghost w-full justify-start ${isActive("/sliders/add")}`}
                >
                  <FaPlus className="mr-2" /> Add Banner
                </Link>
              </li>
              <li>
                <Link
                  to="/sliders"
                  onClick={closeDrawerOnMobile}
                  className={`btn btn-ghost w-full justify-start ${isActive("/sliders")}`}
                >
                  <FaThList className="mr-2" /> All Banners
                </Link>
              </li>
            </ul>
          </details>
        </li>
        
        {/* Client Say - Collapsible Submenu */}
        <li>
          <details className="group">
            <summary className="flex items-center justify-start w-full cursor-pointer btn btn-ghost">
  <FaQuoteRight className="mr-2" /> Client Say
</summary>
            <ul className="pl-8 space-y-1">
              <li>
                <Link
                  to="/testimonial/add"
                  onClick={closeDrawerOnMobile}
                  className={`btn btn-ghost w-full justify-start ${isActive("/testimonial/add")}`}
                >
                  <FaPlus className="mr-2" /> Add Testimonial
                </Link>
              </li>
              <li>
                <Link
                  to="/testimonial"
                  onClick={closeDrawerOnMobile}
                  className={`btn btn-ghost w-full justify-start ${isActive("/testimonial")}`}
                >
                  <FaThList className="mr-2" /> All Testimonial
                </Link>
              </li>
            </ul>
          </details>
        </li>

 {/* Management - Collapsible Submenu */}
        <li>
          <details className="group">
            <summary className="flex items-center justify-start w-full cursor-pointer btn btn-ghost">
  <FaUsers className="mr-2" /> Team
</summary>
            <ul className="pl-8 space-y-1">
              <li>
                <Link
                  to="/team/add"
                  onClick={closeDrawerOnMobile}
                  className={`btn btn-ghost w-full justify-start ${isActive("/team/add")}`}
                >
                  <FaPlus className="mr-2" /> Add Team
                </Link>
              </li>
              <li>
                <Link
                  to="/team"
                  onClick={closeDrawerOnMobile}
                  className={`btn btn-ghost w-full justify-start ${isActive("/team")}`}
                >
                  <FaThList className="mr-2" /> All Team
                </Link>
              </li>
            </ul>
          </details>
        
        </li>
 {/* Project - Collapsible Submenu */}
        <li>
          <details className="group">
            <summary className="flex items-center justify-start w-full cursor-pointer btn btn-ghost">
  <FaBuilding className="mr-2" /> Projects
</summary>
            <ul className="pl-8 space-y-1">
              <li>
                <Link
                  to="/projects/add"
                  onClick={closeDrawerOnMobile}
                  className={`btn btn-ghost w-full justify-start ${isActive("/projects/add")}`}
                >
                  <FaPlus className="mr-2" /> Add Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  onClick={closeDrawerOnMobile}
                  className={`btn btn-ghost w-full justify-start ${isActive("/projects")}`}
                >
                  <FaThList className="mr-2" /> All Projects
                </Link>
              </li>
            </ul>
          </details>
        </li>

 {/* News - Collapsible Submenu */}
        <li>
          <details className="group">
            <summary className="flex items-center justify-start w-full cursor-pointer btn btn-ghost">
  <FaNewspaper className="mr-2" /> News
</summary>
            <ul className="pl-8 space-y-1">
              <li>
                <Link
                  to="/news/add"
                  onClick={closeDrawerOnMobile}
                  className={`btn btn-ghost w-full justify-start ${isActive("/news/add")}`}
                >
                  <FaPlus className="mr-2" /> Add News
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  onClick={closeDrawerOnMobile}
                  className={`btn btn-ghost w-full justify-start ${isActive("/news")}`}
                >
                  <FaThList className="mr-2" /> All News
                </Link>
              </li>
            </ul>
          </details>
        </li>
 {/* Gallery - Collapsible Submenu */}
        <li>
          <details className="group">
            <summary className="flex items-center justify-start w-full cursor-pointer btn btn-ghost">
  <FaImage className="mr-2" /> Gallery
</summary>
            <ul className="pl-8 space-y-1">
              <li>
                <Link
                  to="/album/add"
                  onClick={closeDrawerOnMobile}
                  className={`btn btn-ghost w-full justify-start ${isActive("/album/add")}`}
                >
                  <FaPlus className="mr-2" /> Add Album
                </Link>
              </li>
              <li>
                <Link
                  to="/albums"
                  onClick={closeDrawerOnMobile}
                  className={`btn btn-ghost w-full justify-start ${isActive("/albums")}`}
                >
                  <FaThList className="mr-2" /> All Album
                </Link>
              </li>

              <li>
                <Link
                  to="/photo/add"
                  onClick={closeDrawerOnMobile}
                  className={`btn btn-ghost w-full justify-start ${isActive("/photo/add")}`}
                >
                  <FaPlus className="mr-2" /> Add Photo
                </Link>
              </li>
              <li>
                <Link
                  to="/photos"
                  onClick={closeDrawerOnMobile}
                  className={`btn btn-ghost w-full justify-start ${isActive("/photos")}`}
                >
                  <FaThList className="mr-2" /> All Photo
                </Link>
              </li>
            </ul>
          </details>
        </li>
 
 {/* Others - Collapsible Submenu */}
        <li>
          <details className="group">
            <summary className="flex items-center justify-start w-full cursor-pointer btn btn-ghost">
  <FaFolderOpen className="mr-2" /> Others
</summary>
            <ul className="pl-8 space-y-1">
              <li>
                <Link
                  to="/about/edit"
                  onClick={closeDrawerOnMobile}
                  className={`btn btn-ghost w-full justify-start ${isActive("/about")}`}
                >
                  <FaPlus className="mr-2" /> About
                </Link>
              </li>
             
             
            </ul>
          </details>
        </li>

      </ul>
    </aside>
  );
};

export default Sidebar;
