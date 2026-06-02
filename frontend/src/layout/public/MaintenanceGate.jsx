import { useEffect, useState } from "react";
import http from "../../lib/axios";
import { useAuth } from "../../context/AuthContext";
import MaintenancePage from "../../features/public/pages/MaintenancePage";

const MaintenanceGate = ({ children }) => {
  const { user } = useAuth();
  
  // Read initial from localStorage to avoid blocking
  const [maintenanceMode, setMaintenanceMode] = useState(() => {
    return localStorage.getItem("maintenanceMode") === "true";
  });

  useEffect(() => {
    let cancelled = false;
    
    // Background fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    http
      .get("/settings", { signal: controller.signal })
      .then((res) => {
        if (!cancelled) {
          const isMaintenance = Boolean(res?.data?.settings?.maintenanceMode);
          setMaintenanceMode(isMaintenance);
          localStorage.setItem("maintenanceMode", String(isMaintenance));
        }
      })
      .catch((err) => {
        if (!cancelled && err.name !== 'CanceledError') {
          // Keep cached value on error, unless we want to reset
          console.warn("Failed to fetch settings, using cached values");
        }
      })
      .finally(() => clearTimeout(timeoutId));
      
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const isAdmin = user?.role === "admin";
  if (maintenanceMode && !isAdmin) {
    return <MaintenancePage />;
  }

  // Render children immediately, relying on cache while background fetch completes
  return children;
};

export default MaintenanceGate;

