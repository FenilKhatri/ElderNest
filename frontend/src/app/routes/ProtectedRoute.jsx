import { Navigate, Outlet, useLocation } from "react-router-dom";
import GlobalLoader from "../../components/ui/GlobalLoader";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <GlobalLoader />;

  if (!user) {
    if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/login" replace state={{ from: location }} />;
    }
    if (location.pathname.startsWith("/user") || location.pathname.startsWith("/caregiver")) {
      return <Navigate to="/auth" replace state={{ from: location }} />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
