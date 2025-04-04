import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_BASE_URL = "https://resoursemanagemntsystem-bksn.vercel.app/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const [counts, setCounts] = useState({ employees: 0, resources: 0, allocations: 0 });

  // Memoized API endpoints
  const endpoints = useMemo(() => [
    `${API_BASE_URL}/employees/getAllActiveEmployees`,
    `${API_BASE_URL}/resources`,
    `${API_BASE_URL}/allocations`
  ], []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch counts on mount
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const headers = { headers: { Authorization: `Bearer ${token}` } };
  
        // Each API call separately
        axios.get(endpoints[0], headers).then((res) => {
          setCounts((prev) => ({
            ...prev,
            employees: res.data.count || res.data.length || 0
          }));
        });
  
        axios.get(endpoints[1], headers).then((res) => {
          setCounts((prev) => ({
            ...prev,
            resources: res.data.data?.count || res.data.data?.length || res.data.length || 0
          }));
        });
  
        axios.get(endpoints[2], headers).then((res) => {
          setCounts((prev) => ({
            ...prev,
            allocations: res.data.count || res.data.length || 0
          }));
        });
  
      } catch (error) {
        console.error("Error fetching counts:", error);
        setCounts({ employees: 0, resources: 0, allocations: 0 });
      }
    };
  
    fetchCounts();
  }, [endpoints, token]);
  
  const dashboardCards = useMemo(() => [
    { title: "Total Employees", count: counts.employees, description: "Active employees in system", icon: "👥", color: "blue", onClick: () => navigate("/employees") },
    { title: "Total Resources", count: counts.resources, description: "Available resources", icon: "💻", color: "green", onClick: () => navigate("/resources") },
    { title: "Total Allocations", count: counts.allocations, description: "Resources in use", icon: "📋", color: "purple", onClick: () => navigate("/allocations") }
  ], [counts, navigate]);

  return (
    <>
      <Navbar />
      <div className="px-6 py-4 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pt-18">Dashboard</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col lg:w-1/2 sm:w-full gap-4 mb-4">
          {dashboardCards.map((card, index) => <DashboardCard key={index} {...card} />)}
          </div>
          <div className="mb-10 flex items-center justify-center lg:px-10 sm:px-1 lg:w-1/2 sm:w-full">
            <img src="https://res.cloudinary.com/dmyq2ymj9/image/upload/v1743745859/HR-Challenges-2024_4x-1536x927-1-1024x618_pbrsvs.webp" alt="Dashboard visualization" />
          </div>
        </div>
      </div>
    </>
  );
};

const DashboardCard = React.memo(({ title, count, description, icon, color, onClick }) => {
  const colorMap = {
    blue: { bg: "bg-blue-50", border: "border-[#013a63]", text: "text-blue-600" },
    green: { bg: "bg-blue-50", border: "border-green-800", text: "text-green-600" },
    purple: { bg: "bg-blue-50", border: "border-orange-700", text: "text-purple-600" }
  };

  return (
    <div 
      className={`p-6 rounded-lg border-l-4 ${colorMap[color].border} ${colorMap[color].bg} hover:shadow-md transition-shadow cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{count}</p>
        </div>
        <span className={`text-3xl ${colorMap[color].text}`}>{icon}</span>
      </div>
      <p className="text-xs text-gray-500 mt-2">{description}</p>
    </div>
  );
});

export default Dashboard;