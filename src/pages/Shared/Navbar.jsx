import React from "react";
import { Link, NavLink } from "react-router";
import Logo from "../../Components/logo";
import useAuth from "../../hooks/useAuth";
import userimg from "../../assets/user.png";

const Navbar = () => {
  const { user, logOut } = useAuth();

  const handleLogout = () => {
    logOut().catch((error) => {
      console.log(error);
    });
  };

  const links = (
    <>
      <li>
        <NavLink to="/donation-requests" className="text-red-900 font-semibold">Donation Requests</NavLink>
      </li>

      {user && (
        <li>
          <NavLink to="/funding" className="text-red-900 font-semibold">Funding</NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>

        <Link to="/" className="text-xl font-bold">
          <Logo />
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>

      
      <div className="navbar-end">
        <div className="flex items-center gap-4">
          
          {!user && (
            <>
              <Link className="btn btn-primary" to="/login">
                Login
              </Link>
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src={userimg} alt="Default Avatar" />
              </div>
            </>
          )}

          {user && (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img src={user.photoURL || userimg} alt="User Avatar" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
              >
                <li className="mb-1 px-2 text-sm text-gray-500">
                  {user.displayName || user.email}
                </li>
                <li>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;