import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaUsers, FaLaptop, FaExchangeAlt, FaChartLine } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const [stats, setStats] = useState({
    employees: 0,
    activeEmployees: 0,
    resources: 0,
    allocatedResources: 0,
    availableResources: 0,
    maintenanceResources: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchDashboardData();
    }
  }, [token, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      const [employeesRes, resourcesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/employees'),
        axios.get('http://localhost:5000/api/resources'),
      ]);

      // Calculate statistics
      const activeEmployees = employeesRes.data.filter(e => !e.isDeleted && e.status === 'active').length;
      const allocatedResources = resourcesRes.data.filter(r => r.status === 'allocated').length;
      const availableResources = resourcesRes.data.filter(r => r.status === 'available').length;

      setStats({
        employees: employeesRes.data.length,
        activeEmployees,
        resources: resourcesRes.data.length,
        allocatedResources,
        availableResources,
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <>
      <Navbar/>
      <div className="px-6 py-4 h-full w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                icon={<FaUsers className="text-3xl" />}
                title="Total Employees"
                value={stats.employees}
                change={`${stats.activeEmployees} active`}
                bgColor="bg-blue-100"
                textColor="text-blue-600"
              />
              <StatCard 
                icon={<FaLaptop className="text-3xl" />}
                title="Total Resources"
                value={stats.resources}
                change={`${stats.availableResources} available`}
                bgColor="bg-green-100"
                textColor="text-green-600"
              />
              <StatCard 
                icon={<FaExchangeAlt className="text-3xl" />}
                title="Allocated Resources"
                value={stats.allocatedResources}
                change={`${Math.round((stats.allocatedResources / stats.resources) * 100)}% of total`}
                bgColor="bg-purple-100"
                textColor="text-purple-600"
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

// StatCard Component
const StatCard = ({ icon, title, value, change, bgColor, textColor }) => (
  <div className={`${bgColor} p-6 rounded-lg shadow`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-neutral-600">{title}</p>
        <h3 className={`${textColor} text-2xl font-bold mt-2`}>{value}</h3>
        <p className="text-neutral-500 text-sm mt-1">{change}</p>
      </div>
      <div className={`${textColor} p-3 rounded-full`}>
        {icon}
      </div>
    </div>
  </div>
);

export default Dashboard;