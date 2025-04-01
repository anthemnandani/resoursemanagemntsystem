import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_BASE_URL = "https://resoursemanagemntsystem-bksn.vercel.app/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const [counts, setCounts] = useState({ employees: 0, resources: 0, allocations: 0 });
  const [targetCounts, setTargetCounts] = useState({ employees: 0, resources: 0, allocations: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const animationRef = useRef();

  // Memoized API endpoints to prevent unnecessary recalculations
  const endpoints = useMemo(() => [
    `${API_BASE_URL}/employees/getAllActiveEmployees`,
    `${API_BASE_URL}/resources`,
    `${API_BASE_URL}/allocations`
  ], []);

  // Auth check and initial data fetch
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchCounts();
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [token, navigate]);

  // Count animation effect
  useEffect(() => {
    const animateCounts = () => {
      setCounts(prev => ({
        employees: incrementNumber(prev.employees, targetCounts.employees),
        resources: incrementNumber(prev.resources, targetCounts.resources),
        allocations: incrementNumber(prev.allocations, targetCounts.allocations)
      }));
      
      if (counts.employees !== targetCounts.employees || 
          counts.resources !== targetCounts.resources || 
          counts.allocations !== targetCounts.allocations) {
        animationRef.current = requestAnimationFrame(animateCounts);
      } else {
        setIsLoading(false);
      }
    };
    
    if (!isLoading) {
      animationRef.current = requestAnimationFrame(animateCounts);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [targetCounts, isLoading]);

  const incrementNumber = (current, target) => {
    if (current === target) return target;
    const diff = target - current;
    const increment = Math.ceil(Math.abs(diff) / 10); // More dynamic increment based on difference
    return current + (diff > 0 ? increment : -increment);
  };

  const fetchCounts = async () => {
    setIsLoading(true);
    try {
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      const responses = await Promise.all([
        axios.get(endpoints[0], headers),
        axios.get(endpoints[1], headers),
        axios.get(endpoints[2], headers)
      ]);

      // Directly set initial counts to avoid delay
      const newCounts = {
        employees: responses[0].data.count || responses[0].data.length || 0,
        resources: responses[1].data.data?.count || responses[1].data.data?.length || responses[1].data.length || 0,
        allocations: responses[2].data.count || responses[2].data.length || 0
      };

      setCounts(newCounts);
      setTargetCounts(newCounts);
      
    } catch (error) {
      console.error("Error fetching counts:", error);
      setCounts({ employees: 0, resources: 0, allocations: 0 });
      setTargetCounts({ employees: 0, resources: 0, allocations: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized dashboard cards to prevent unnecessary re-renders
  const dashboardCards = useMemo(() => [
    {
      title: "Total Employees",
      count: counts.employees,
      description: "Active employees in system",
      icon: "👥",
      color: "blue",
      onClick: () => navigate("/employees")
    },
    {
      title: "Total Resources",
      count: counts.resources,
      description: "Available resources",
      icon: "💻",
      color: "green",
      onClick: () => navigate("/resources")
    },
    {
      title: "Active Allocations",
      count: counts.allocations,
      description: "Resources in use",
      icon: "📋",
      color: "purple",
      onClick: () => navigate("/allocations")
    }
  ], [counts, navigate]);

  return (
    <>
      <Navbar />
      <div className="px-6 py-4 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pt-18">Dashboard</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col lg:w-1/2 sm:w-full gap-4 mb-4">
            {dashboardCards.map((card, index) => (
              <DashboardCard key={index} {...card} />
            ))}
          </div>

          <div className="mb-10 flex items-center justify-center lg:px-20 sm:px-1 lg:w-1/2 sm:w-full">
            <img src="3.gif" alt="Dashboard visualization" />
          </div>
        </div>
      </div>
    </>
  );
};

// Memoized DashboardCard component to prevent unnecessary re-renders
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