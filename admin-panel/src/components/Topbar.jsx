import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase/firebase.config";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Topbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of the admin panel.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        await signOut(auth);
        Swal.fire("Logged Out", "You have been logged out successfully.", "success");
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error.message);
        Swal.fire("Error", "Logout failed. Try again later.", "error");
      }
    }
  };

  return (
    <div className="navbar bg-base-100 border-b border-base-300 z-10 sticky top-0 px-4 lg:pl-64">
      {/* Hamburger + Title */}
      <div className="flex-1 flex items-center gap-3">
        <label
          htmlFor="dashboard-drawer"
          className="btn btn-sm btn-primary drawer-button lg:hidden"
        >
          ☰
        </label>
        <h1 className="text-xl font-semibold text-base-content tracking-wide">
          Welcome{user?.displayName ? `, ${user.displayName}` : ", Admin"}
        </h1>
      </div>

      {/* Avatar and Dropdown */}
      <div className="flex-none gap-4">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={user?.photoURL || "https://i.pravatar.cc/100"}
                alt="User Avatar"
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow-md menu menu-sm dropdown-content bg-base-100 border border-base-300 rounded-box w-52"
          >
            <li>
              <button
                onClick={() => navigate("/profile")}
                className="hover:bg-base-200"
              >
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="hover:bg-base-200 text-red-500"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
