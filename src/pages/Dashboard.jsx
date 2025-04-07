import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import { useDashboard } from "../context/DashboardContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const { counts, loading } = useDashboard();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const dashboardCards = useMemo(
    () => [
      {
        title: "Total Employees",
        count: counts.employees,
        description: "Active employees in system",
        icon: "👥",
        color: "blue",
        onClick: () => navigate("/employees"),
      },
      {
        title: "Total Resources",
        count: counts.resources,
        description: "Available resources",
        icon: "💻",
        color: "green",
        onClick: () => navigate("/resources"),
      },
      {
        title: "Total Allocations",
        count: counts.allocations,
        description: "Resources in use",
        icon: "📋",
        color: "purple",
        onClick: () => navigate("/allocations"),
      },
    ],
    [counts, navigate]
  );

  return (
    <>
      <Navbar />
      <div className="px-6 py-4 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pt-18">Dashboard</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col lg:w-1/2 sm:w-full gap-4 mb-4">
            {dashboardCards.map((card, index) => (
              <DashboardCard key={index} {...card} loading={loading} />
            ))}
          </div>
          <div className="mb-10 flex items-center justify-center lg:px-10 sm:px-1 lg:w-1/2 sm:w-full">
            <img
              src="https://res.cloudinary.com/dmyq2ymj9/image/upload/v1743745859/HR-Challenges-2024_4x-1536x927-1-1024x618_pbrsvs.webp"
              alt="Dashboard visualization"
            />
          </div>
        </div>
      </div>
    </>
  );
};

const DashboardCard = React.memo(
  ({ title, count, description, icon, color, onClick, loading }) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-50",
        border: "border-[#013a63]",
        text: "text-blue-600",
      },
      green: {
        bg: "bg-blue-50",
        border: "border-green-800",
        text: "text-green-600",
      },
      purple: {
        bg: "bg-blue-50",
        border: "border-orange-700",
        text: "text-purple-600",
      },
    };

    return (
      <div
        className={`p-6 rounded-lg border-l-4 ${colorMap[color].border} ${colorMap[color].bg} hover:shadow-md transition-shadow cursor-pointer`}
        onClick={onClick}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-blue-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              ) : (
                count
              )}
            </p>
          </div>
          <span className={`text-3xl ${colorMap[color].text}`}>{icon}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      </div>
    );
  }
);

export default Dashboard;