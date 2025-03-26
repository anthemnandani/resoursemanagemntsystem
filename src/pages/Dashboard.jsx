

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return token ? (
    <>
      <Navbar />
      <div className="px-6 py-2 h-full w-full">
        <h2 className="text-3xl py-4">Dashboard</h2>
        <div className="flex gap-4">
          <div className="h-32 min-w-56 bg-blue-400 text-white text-lg rounded flex items-center justify-center">
            Employees
          </div>
          <div className="h-32 min-w-56 bg-blue-400 text-white text-lg rounded flex items-center justify-center">
            Resources
          </div>
          <div className="h-32 min-w-56 bg-blue-400 text-white text-lg rounded flex items-center justify-center">
            Allocated Resources
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export default Dashboard;
