import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Navbar from "../components/Navbar";
// import DataTable from "./DataTable";

const API_BASE_URL = "https://resoursemanagemntsystem-bksn.vercel.app/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const [counts, setCounts] = useState({ employees: 0, resources: 0, allocations: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchCounts();
    }
  }, [token, navigate]);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const endpoints = ["employees", "resources", "allocations"].map(endpoint => `${API_BASE_URL}/${endpoint}`);
  
      const responses = await Promise.allSettled(
        endpoints.map(url => axios.get(url, { headers: { Authorization: `Bearer ${token}` } }))
      );
  
      // Log full responses for debugging
      console.log("API responses:", responses);
  
      const newCounts = responses.map((res, index) => {
        if (res.status === "fulfilled") {
          console.log(`Response for ${endpoints[index]}:`, res.value.data); // Debugging log
          return res.value.data.count !== undefined ? res.value.data.count : res.value.data.length;
        }
        return 0;
      });
  
      setCounts({ employees: newCounts[0], resources: newCounts[1], allocations: newCounts[2] });
  
    } catch (err) {
      console.error("Error in fetchCounts:", err);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };  

  return (
    <>
      <Navbar />
      {/* <DataTable/> */}
      <div className="px-6 py-4 min-h-screen bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <DashboardCard title="Total Employees" count={counts.employees} description="Active employees in system" icon="👥" color="blue" onClick={() => navigate("/employees")} />
            <DashboardCard title="Total Resources" count={counts.resources} description="All resources to allocate" icon="💻" color="green" onClick={() => navigate("/resources")} />
            <DashboardCard title="Active Allocations" count={counts.allocations} description="Resources currently allocated" icon="📋" color="purple" onClick={() => navigate("/allocations")} />
          </div>
        )}
      </div>
    </>
  );
};

const DashboardCard = ({ title, count, description, icon, color, onClick }) => {
  const colorClasses = {
    blue: "border-blue-500 bg-blue-100 text-blue-600",
    green: "border-green-500 bg-green-100 text-green-600",
    purple: "border-purple-500 bg-purple-100 text-purple-600",
  };
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 hover:shadow-lg transition-shadow cursor-pointer ${colorClasses[color]}`} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{count}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
    </div>
  );
};

export default Dashboard;