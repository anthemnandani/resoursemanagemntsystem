import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route location

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    navigate("/login");
  };

  const navItems = [
    { path: "/", name: "Home" },
    { path: "/resources", name: "Resources" },
    { path: "/resourceType", name: "Resource Type" },
    { path: "/employees", name: "Employees" },
    { path: "/allocations", name: "Allocations" },
  ];

  return (
    <nav className="flex justify-between fixed top-0 w-full z-50 px-6 h-16 items-center bg-blue-900 text-white shadow-md">
      <h1 className="text-xl font-bold">Resource Management System</h1>
      <ul className="flex gap-2">
        {navItems.map((item) => (
          <li
            key={item.path}
            className={`flex items-center cursor-pointer px-3 py-2 transition-colors ${
              location.pathname === item.path ? "border-b-1 border-white" : ""
            }`}
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