import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaCog,
  FaImage,
  FaPlus,
  FaThList,
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
    <aside className="w-64 min-h-screen bg-base-200 shadow-xl border-r border-base-300">
      {/* Logo and Title */}
      <div className="p-6 flex flex-col items-center justify-center text-center border-b border-base-300">
        <img
          src="/large-logo.png"
          alt="Company Logo"
          className="w-16 h-16 object-contain mt-12 lg:mt-0"
        />
        <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
      </div>

      {/* Navigation Menu */}
      <ul className="menu p-4 space-y-2 w-full">
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

        {/* Users */}
        <li>
          <Link
            to="/users"
            onClick={closeDrawerOnMobile}
            className={`btn btn-ghost w-full justify-start ${isActive("/users")}`}
          >
            <FaUsers className="mr-2" /> Users
          </Link>
        </li>

        {/* Settings */}
        <li>
          <Link
            to="/settings"
            onClick={closeDrawerOnMobile}
            className={`btn btn-ghost w-full justify-start ${isActive("/settings")}`}
          >
            <FaCog className="mr-2" /> Settings
          </Link>
        </li>

        {/* Banners - Collapsible Submenu */}
        <li>
          <details className="group">
            <summary className="btn btn-ghost w-full justify-start cursor-pointer flex items-center">
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
      </ul>
    </aside>
  );
};

export default Sidebar;
