// src/context/DashboardContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

const API_BASE_URL = "https://resoursemanagemntsystem-bksn.vercel.app/api";

export const DashboardProvider = ({ children }) => {
  const token = Cookies.get("token");
  const [counts, setCounts] = useState({ employees: null, resources: null, allocations: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const headers = { headers: { Authorization: `Bearer ${token}` } };

        const [employeesRes, resourcesRes, allocationsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/employees`, headers),
          axios.get(`${API_BASE_URL}/resources`, headers),
          axios.get(`${API_BASE_URL}/allocations`, headers)
        ]);

        setCounts({
          employees: employeesRes.data.count || employeesRes.data.length || 0,
          resources: resourcesRes.data.data?.count || resourcesRes.data.data?.length || 0,
          allocations: allocationsRes.data.count || allocationsRes.data.length || 0
        });

      } catch (err) {
        console.error("Error loading dashboard data", err);
        setCounts({ employees: 0, resources: 0, allocations: 0 });
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