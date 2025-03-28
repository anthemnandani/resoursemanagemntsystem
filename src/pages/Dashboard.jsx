import { useEffect, useState, useRef } from "react";
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
  const animationRef = useRef();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchCounts();
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [token, navigate]);

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
      }
    };
    
    animationRef.current = requestAnimationFrame(animateCounts);
    return () => cancelAnimationFrame(animationRef.current);
  }, [targetCounts]);

  const incrementNumber = (current, target) => {
    if (current === target) return target;
    const increment = Math.max(1, Math.floor(target / 30));
    return Math.min(current + increment, target);
  };

  const fetchCounts = async () => {
    try {
      const responses = await Promise.all([
        axios.get(`${API_BASE_URL}/employees/getAllActiveEmployees`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/resources`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/allocations`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setTargetCounts({
        employees: responses[0].data.count || responses[0].data.length,
        resources: responses[1].data.data.count || responses[1].data.data.length,
        allocations: responses[2].data.count || responses[2].data.length
      });

    } catch (error) {
      console.error("Error fetching counts:", error);
      // If error occurs, still animate to 0 to maintain UX consistency
      setTargetCounts({ employees: 0, resources: 0, allocations: 0 });
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-6 py-4 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pt-18">Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard 
            title="Total Employees" 
            count={counts.employees} 
            description="Active employees in system" 
            icon="👥"
            color="blue"
            onClick={() => navigate("/employees")}
          />
          <DashboardCard 
            title="Total Resources" 
            count={counts.resources} 
            description="Available resources" 
            icon="💻"
            color="green"
            onClick={() => navigate("/resources")}
          />
          <DashboardCard 
            title="Active Allocations" 
            count={counts.allocations} 
            description="Resources in use" 
            icon="📋"
            color="purple"
            onClick={() => navigate("/allocations")}
          />
        </div>
      </div>
    </>
  );
};

const DashboardCard = ({ title, count, description, icon, color, onClick }) => {
  const colorMap = {
    blue: { bg: "bg-gray-50", border: "border-blue-900", text: "text-blue-600" },
    green: { bg: "bg-gray-50", border: "border-green-300", text: "text-green-600" },
    purple: { bg: "bg-gray-50", border: "border-orange-500", text: "text-purple-600" }
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
        <span className={`text-2xl ${colorMap[color].text}`}>{icon}</span>
      </div>
      <p className="text-xs text-gray-500 mt-2">{description}</p>
    </div>
  );
};

export default Dashboard;