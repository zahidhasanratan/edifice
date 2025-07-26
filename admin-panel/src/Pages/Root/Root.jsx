import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Footer from "../../components/Footer";

const Root = () => {
  return (
    <div className="drawer drawer-mobile lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        <Topbar /> {/* ← hamburger is now inside this */}
        <main className="p-6 bg-base-100 min-h-screen">
          <Outlet />
        </main>
        <Footer />
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <div className="w-64 bg-base-200 min-h-screen border-r border-base-300">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Root;
