import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");

    // Redirect to login page
    navigate("/login");
  };

  const navItems = [
    { path: "/", name: "Home" },
    { path: "/resources", name: "Resources" },
    { path: "/employees", name: "Employees" },
    {
      path: "/allocations",
      name: "Allocations",
    },
    {
      path: "/resourceType",
      name: "Resource Type",
    },
  ];

  return (
    <nav className="flex justify-between px-6 h-16 items-center bg-blue-800 text-white shadow-md">
      <h1 className="text-xl font-bold">Resource Management System</h1>

      <ul className="flex gap-2">
        {navItems.map((item) => (
          <li
            key={item.path}
            className="flex items-center cursor-pointer hover:bg-blue-700 px-3 py-2 rounded transition-colors"
            onClick={() => navigate(item.path)}
          >
            {item.name}
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-white text-blue-900 font-semibold rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
