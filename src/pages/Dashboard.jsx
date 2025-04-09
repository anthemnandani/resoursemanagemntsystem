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

  // #013a63

  return (
    <>
      <Navbar />
      <div className="px-6 py-4 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pt-18">Dashboard</h2>
        <div className="">
          <div className="flex justify-between gap-4 mb-4">
            {dashboardCards.map((card, index) => (
              <div
                key={index}
                className={`p-6 w-full rounded-lg border-l-4 ${
                  card.color === "blue"
                    ? "border-[#003cb3] bg-blue-50 text-blue-600"
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
                         <svg className="animate-spin h-5 w-5 text-blue-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
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
        </div>
      </div>
    </>
  );
};

export default Dashboard;