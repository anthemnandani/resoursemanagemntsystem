import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const DashboardContext = createContext();
export const useDashboard = () => useContext(DashboardContext);

const API_BASE_URL = "https://resoursemanagemntsystem-bksn.vercel.app/api";

export const DashboardProvider = ({ children }) => {
  const token = Cookies.get("token");

  const [counts, setCounts] = useState(() => {
    const cached = localStorage.getItem("dashboardCounts");
    return cached
      ? JSON.parse(cached)
      : { employees: 0, resources: 0, allocations: 0, resourceType: 0 };
  });

  const [loading, setLoading] = useState(() => !localStorage.getItem("dashboardCounts"));

  useEffect(() => {
    const fetchCounts = async () => {
      if (!token) return;

      setLoading(true);

      try {
        const res = await axios.get(`${API_BASE_URL}/dashboard`);
        const data = res.data.data;

        const newCounts = {
          employees: data.employeeCount || 0,
          resources: data.resourceCount || 0,
          allocations: data.allocationCount || 0,
          resourceType: data.resourceTypeCount || 0,
        };

        setCounts(newCounts);
        localStorage.setItem("dashboardCounts", JSON.stringify(newCounts));
      } catch (err) {
        console.error("Error loading dashboard summary", err);
      } finally {
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