import { useEffect, useState } from "react";
import http from "../../lib/axios";
import { useAuth } from "../../context/AuthContext";
import GlobalLoader from "../../components/ui/GlobalLoader";
import MaintenancePage from "../../features/public/pages/MaintenancePage";

const MaintenanceGate = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    http
      .get("/settings")
      .then((res) => {
        if (!cancelled) {
          setMaintenanceMode(Boolean(res?.data?.settings?.maintenanceMode));
        }
      })
      .catch(() => {
        if (!cancelled) setMaintenanceMode(false);
      })
      .finally(() => {
        if (!cancelled) setChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!checked || authLoading) {
    return <GlobalLoader />;
  }

  const isAdmin = user?.role === "admin";
  if (maintenanceMode && !isAdmin) {
    return <MaintenancePage />;
  }

  return children;
};

export default MaintenanceGate;
