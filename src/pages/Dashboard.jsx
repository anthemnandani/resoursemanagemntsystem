import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const [counts, setCounts] = useState({
    employees: 0,
    resources: 0,
    allocations: 0,
    resourceType: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("https://resoursemanagemntsystem-bksn.vercel.app/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.data;

        setCounts({
          employees: data.employeeCount || 0,
          resources: data.resourceCount || 0,
          allocations: data.allocationCount || 0,
          resourceType: data.resourceTypeCount || 0,
        });
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, navigate]);

  const dashboardCards = [
    {
      title: "Total Employees",
      count: counts.employees,
      description: "Active employees in system",
      icon: "👥",
      color: "blue",
      path: "/employees",
    },
    {
      title: "Total Resources",
      count: counts.resources,
      description: "Available resources",
      icon: "💻",
      color: "green",
      path: "/resources",
    },
    {
      title: "Total Resource Type",
      count: counts.resourceType,
      description: "Available resource types",
      icon: "🗂️",
      color: "yellow",
      path: "/resourceType",
    },
    {
      title: "Total Allocations",
      count: counts.allocations,
      description: "Resources in use",
      icon: "📋",
      color: "red",
      path: "/allocations",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="px-6 py-4 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pt-18">Dashboard</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col lg:w-1/2 sm:w-full gap-4 mb-4">
            {dashboardCards.map((card, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border-l-4 ${
                  card.color === "blue"
                    ? "border-[#013a63] bg-blue-50 text-blue-600"
                    : card.color === "green"
                    ? "border-green-800 bg-blue-50 text-green-600"
                    : card.color === "yellow"
                    ? "border-yellow-400 bg-blue-50 text-yellow-300"
                    : "border-orange-700 bg-blue-50 text-purple-600"
                } hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => navigate(card.path)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">
                      {loading ? (
                         <span className="text-gray-400 animate-pulse">...</span>
                      ) : (
                        card.count
                      )}
                    </p>
                  </div>
                  <span className="text-3xl">{card.icon}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{card.description}</p>
              </div>
            ))}
          </div>

          <div className="mb-10 flex items-center justify-center lg:px-10 sm:px-1 lg:w-1/2 sm:w-full">
            <img
              src="https://res.cloudinary.com/dmyq2ymj9/image/upload/v1743745859/HR-Challenges-2024_4x-1536x927-1-1024x618_pbrsvs.webp"
              alt="Dashboard visualization"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;