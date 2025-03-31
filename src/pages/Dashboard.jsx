import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_BASE_URL = "http://localhost:5000/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const [counts, setCounts] = useState({ 
    employees: 0, 
    resources: 0, 
    allocations: 0 
  });
  const [targetCounts, setTargetCounts] = useState({ 
    employees: 0, 
    resources: 0, 
    allocations: 0 
  });
  const [loading, setLoading] = useState(true);
  const animationRef = useRef();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    setTargetCounts({ employees: 5, resources: 3, allocations: 2 });
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const [employeesRes, resourcesRes, allocationsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/employees/getAllActiveEmployees`, { 
            headers: { Authorization: `Bearer ${token}` } 
          }),
          axios.get(`${API_BASE_URL}/resources`, { 
            headers: { Authorization: `Bearer ${token}` } 
          }),
          axios.get(`${API_BASE_URL}/allocations`, { 
            headers: { Authorization: `Bearer ${token}` } 
          })
        ]);

        setTargetCounts({
          employees: employeesRes.data.count || employeesRes.data.length || 0,
          resources: resourcesRes.data.data.count || resourcesRes.data.data.length || 0,
          allocations: allocationsRes.data.count || allocationsRes.data.length || 0
        });
        
      } catch (error) {
        console.error("Error fetching counts:", error);
        setTargetCounts({ employees: 0, resources: 0, allocations: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [token, navigate]);

  useEffect(() => {
    let lastTime = 0;
    const animationInterval = 16;

    const animateCounts = (time) => {
      if (time - lastTime < animationInterval) {
        animationRef.current = requestAnimationFrame(animateCounts);
        return;
      }
      lastTime = time;

      setCounts(prev => {
        const newCounts = {
          employees: incrementNumber(prev.employees, targetCounts.employees),
          resources: incrementNumber(prev.resources, targetCounts.resources),
          allocations: incrementNumber(prev.allocations, targetCounts.allocations)
        };

        if (newCounts.employees !== targetCounts.employees || 
            newCounts.resources !== targetCounts.resources || 
            newCounts.allocations !== targetCounts.allocations) {
          animationRef.current = requestAnimationFrame(animateCounts);
        }

        return newCounts;
      });
    };

    animationRef.current = requestAnimationFrame(animateCounts);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetCounts]);

  const incrementNumber = (current, target) => {
    if (current === target) return target;
    
    // Faster increment for larger numbers
    const difference = target - current;
    const increment = Math.ceil(difference / 10);
    
    return current + increment;
  };

  return (
    <>
      <Navbar />
      <div className="px-6 py-4 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pt-18">Dashboard</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col lg:w-1/2 sm:w-full gap-4 mb-4">
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

            <div className="mb-10 flex items-center justify-center lg:px-20 sm:px-1 lg:w-1/2 sm:w-full">
              <img src="3.gif" alt="Dashboard visualization" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const DashboardCard = ({ title, count, description, icon, color, onClick }) => {
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
};

export default Dashboard;