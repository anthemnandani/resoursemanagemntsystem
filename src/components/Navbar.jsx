import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { IoMenu, IoClose } from "react-icons/io5";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null); // State for dropdown menus

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    navigate("/login");
  };

  const navItems = [
    { path: "/", name: "Home" },
    {
      name: "Resources",
      submenu: [
        { path: "/resources", name: "Resources" },
        { path: "/resourceType", name: "Resource Type" },
      ],
    },
    {
      name: "Employees",
      submenu: [
        { path: "/employees", name: "Employees" },
        { path: "/allocations", name: "Allocations" },
      ],
    },
  ];

  return (
    <nav className="flex justify-between fixed top-0 w-full z-50 pl-2 pr-8 h-18 items-center text-white bg-[#4361ee] shadow-md">
      <div className="p-4">
        <img src="./newlogo.png" alt="Logo" className="h-15 cursor-pointer" onClick={() => navigate('/')} />
      </div>
      <div className="hidden lg:flex gap-10">
        <ul className="flex gap-6">
          {navItems.map((item, index) => (
            <li
              key={index}
              className="relative group cursor-pointer px-3 py-2 transition-colors"
              onMouseEnter={() => item.submenu && setDropdownOpen(index)}
              onMouseLeave={() => setDropdownOpen(null)}
            >
              <span
                className={`${
                  location.pathname === item.path ? "border-b-2 border-white" : ""
                }`}
                onClick={() => item.path && navigate(item.path)}
              >
                {item.name}
              </span>
              {item.submenu && dropdownOpen === index && (
                <ul className="absolute left-0 top-10 w-44 bg-white text-[#4361ee] shadow-md rounded-md z-50">
                  {item.submenu.map((sub) => (
                    <li
                      key={sub.path}
                      className="px-4 py-2 hover:bg-gray-200 transition-colors cursor-pointer"
                      onClick={() => navigate(sub.path)}
                    >
                      {sub.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <button
          className="px-4 py-2 bg-white text-[#4361ee] font-semibold rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="text-3xl lg:hidden cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <IoClose /> : <IoMenu />}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-14 left-0 w-full bg-[#4361ee] shadow-md flex flex-col items-center gap-4 py-4 lg:hidden">
          <ul className="flex flex-col gap-3 text-lg w-full">
            {navItems.map((item, index) => (
              <li key={index} className="w-full text-center">
                <div
                  className="px-4 py-2 cursor-pointer transition-colors"
                  onClick={() =>
                    item.submenu
                      ? setDropdownOpen(dropdownOpen === index ? null : index)
                      : (navigate(item.path), setMenuOpen(false))
                  }
                >
                  {item.name}
                </div>

                {/* Mobile Dropdown */}
                {item.submenu && dropdownOpen === index && (
                  <ul className="bg-gray-700 text-white">
                    {item.submenu.map((sub) => (
                      <li
                        key={sub.path}
                        className="px-4 py-2 hover:bg-gray-600 transition-colors cursor-pointer"
                        onClick={() => {
                          navigate(sub.path);
                          setMenuOpen(false);
                        }}
                      >
                        {sub.name}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <button
            className="px-6 py-2 bg-white text-[#4361ee] font-semibold rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;