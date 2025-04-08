import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const DashboardContext = createContext();
export const useDashboard = () => useContext(DashboardContext);

const API_BASE_URL = "https://resoursemanagemntsystem-bksn.vercel.app/api";

export const DashboardProvider = ({ children }) => {
  const token = Cookies.get("token");

  const [counts, setCounts] = useState(() => {
    const cached = sessionStorage.getItem("dashboardCounts");
    return cached ? JSON.parse(cached) : { employees: 0, resources: 0, allocations: 0, resourceType: 0 };
  });

  const [loading, setLoading] = useState(!sessionStorage.getItem("dashboardCounts"));

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

        const newCounts = {
          employees: employeesRes.data.count || employeesRes.data.length || 0,
          resources: resourcesRes.data.data?.count || resourcesRes.data.data?.length || 0,
          allocations: allocationsRes.data.count || allocationsRes.data.length || 0,
          resourceType: resourceTypeRes.data.count || resourceTypeRes.data.length || 0,
        };

        setCounts(newCounts);
        console.log("new counts: ", newCounts);
        sessionStorage.setItem("dashboardCounts", JSON.stringify(newCounts));
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        // Prevent spinner lasting too long (fallback after 1 sec)
        setTimeout(() => setLoading(false), 1000);
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