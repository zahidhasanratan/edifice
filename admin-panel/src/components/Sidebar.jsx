import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
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
  FaBars,
  FaFileAlt,
  FaAngleRight,
} from "react-icons/fa";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [openGroup, setOpenGroup] = useState(null);

  const isActive = (path) => (pathname === path ? "bg-primary text-white" : "");

  const toggleGroup = (group) => {
    setOpenGroup((prev) => (prev === group ? null : group));
  };

  const closeDrawerOnMobile = () => {
    const drawerCheckbox = document.getElementById("dashboard-drawer");
    if (drawerCheckbox && drawerCheckbox.checked) {
      drawerCheckbox.checked = false;
    }
  };

  const MenuGroup = ({ id, icon, label, children }) => (
    <li>
      <div
        onClick={() => toggleGroup(id)}
        className="flex items-center justify-between w-full cursor-pointer btn btn-ghost"
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-2">{label}</span>
        </div>
        <FaAngleRight
          className={`transition-transform duration-300 ${
            openGroup === id ? "rotate-90" : ""
          }`}
        />
      </div>
      {openGroup === id && <ul className="pl-8 space-y-1">{children}</ul>}
    </li>
  );

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

        {/* Menu */}
        <MenuGroup id="menu" icon={<FaBars />} label="Menu">
          <li>
            <Link
              to="/menu/add"
              onClick={closeDrawerOnMobile}
              className={`btn btn-ghost w-full justify-start ${isActive("/menu/add")}`}
            >
              <FaPlus className="mr-2" /> Add Menu
            </Link>
          </li>
          <li>
            <Link
              to="/menu"
              onClick={closeDrawerOnMobile}
              className={`btn btn-ghost w-full justify-start ${isActive("/menu")}`}
            >
              <FaThList className="mr-2" /> All Menu
            </Link>
          </li>
        </MenuGroup>

        {/* Page */}
        <MenuGroup id="page" icon={<FaFileAlt />} label="Page">
          <li>
            <Link
              to="/page/add"
              onClick={closeDrawerOnMobile}
              className={`btn btn-ghost w-full justify-start ${isActive("/page/add")}`}
            >
              <FaPlus className="mr-2" /> Add Page
            </Link>
          </li>
          <li>
            <Link
              to="/pages"
              onClick={closeDrawerOnMobile}
              className={`btn btn-ghost w-full justify-start ${isActive("/pages")}`}
            >
              <FaThList className="mr-2" /> All Page
            </Link>
          </li>
        </MenuGroup>

        {/* Media Gallery */}
        <li>
          <Link
            to="/media"
            onClick={closeDrawerOnMobile}
            className={`btn btn-ghost w-full justify-start ${isActive("/media")}`}
          >
            <FaPhotoVideo className="mr-2" /> Media Gallery
          </Link>
        </li>

        {/* Banners */}
        <MenuGroup id="banners" icon={<FaImage />} label="Banners">
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
        </MenuGroup>

        {/* Client Say */}
        <MenuGroup id="testimonial" icon={<FaQuoteRight />} label="Client Say">
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
        </MenuGroup>

        {/* Team */}
        <MenuGroup id="team" icon={<FaUsers />} label="Team">
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
        </MenuGroup>

        {/* Projects */}
        <MenuGroup id="projects" icon={<FaBuilding />} label="Projects">
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
        </MenuGroup>

        {/* News */}
        <MenuGroup id="news" icon={<FaNewspaper />} label="News">
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
        </MenuGroup>

        {/* Gallery */}
        <MenuGroup id="gallery" icon={<FaImage />} label="Gallery">
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
        </MenuGroup>

        {/* Career */}
        <MenuGroup id="career" icon={<FaNewspaper />} label="Career">
          <li>
            <Link
              to="/career/add"
              onClick={closeDrawerOnMobile}
              className={`btn btn-ghost w-full justify-start ${isActive("/career/add")}`}
            >
              <FaPlus className="mr-2" /> Add Career
            </Link>
          </li>
          <li>
            <Link
              to="/career"
              onClick={closeDrawerOnMobile}
              className={`btn btn-ghost w-full justify-start ${isActive("/career")}`}
            >
              <FaThList className="mr-2" /> All Career
            </Link>
          </li>
        </MenuGroup>

        {/* Others */}
        <MenuGroup id="others" icon={<FaFolderOpen />} label="Others">
          <li>
            <Link
              to="/about/edit"
              onClick={closeDrawerOnMobile}
              className={`btn btn-ghost w-full justify-start ${isActive("/about")}`}
            >
              <FaPlus className="mr-2" /> About
            </Link>
          </li>
          <li>
            <Link
              to="/contact/edit"
              onClick={closeDrawerOnMobile}
              className={`btn btn-ghost w-full justify-start ${isActive("/contact")}`}
            >
              <FaPlus className="mr-2" /> Contact
            </Link>
          </li>
        </MenuGroup>
      </ul>
    </aside>
  );
};

export default Sidebar;
