const Topbar = () => {
  return (
    <div className="navbar bg-base-100 border-b border-base-300 z-10 sticky top-0 px-4 lg:pl-64">
      {/* Hamburger + Title */}
      <div className="flex-1 flex items-center gap-3">
        {/* Hamburger for mobile only */}
        <label
          htmlFor="dashboard-drawer"
          className="btn btn-sm btn-primary drawer-button lg:hidden"
        >
          ☰
        </label>
        <h1 className="text-xl font-semibold text-base-content tracking-wide">
          Welcome, Admin
        </h1>
      </div>

      {/* Avatar */}
      <div className="flex-none gap-4">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src="https://i.pravatar.cc/100" alt="avatar" />
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-md menu menu-sm dropdown-content bg-base-100 border border-base-300 rounded-box w-52">
            <li><a className="hover:bg-base-200">Profile</a></li>
            <li><a className="hover:bg-base-200">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
