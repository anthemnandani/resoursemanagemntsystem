import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

const API_BASE_URL = "https://resoursemanagemntsystem-bksn.vercel.app/api";

export const DashboardProvider = ({ children }) => {
  const token = Cookies.get("token");
  const [counts, setCounts] = useState({ employees: null, resources: null, allocations: null, resourceType: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const [employeesRes, resourcesRes, allocationsRes, resourceTypeRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/employees`),
          axios.get(`${API_BASE_URL}/resources`),
          axios.get(`${API_BASE_URL}/allocations`),
          axios.get(`${API_BASE_URL}/resourcestype`)
        ]);

        setCounts({
          employees: employeesRes.data.count || employeesRes.data.length || 0,
          resources: resourcesRes.data.data?.count || resourcesRes.data.data?.length || 0,
          allocations: allocationsRes.data.count || allocationsRes.data.length || 0,
          resourceType: resourceTypeRes.data.count || resourceTypeRes.data.length || 0,
        });

      } catch (err) {
        console.error("Error loading dashboard data", err);
        setCounts({ employees: 0, resources: 0, allocations: 0, resourceType:0 });
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [token]);

  return (
    <DashboardContext.Provider value={{ counts, loading }}>
      {children}
    </DashboardContext.Provider>
  );
};