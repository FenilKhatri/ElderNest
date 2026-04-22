import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ScreenLoader from "../components/ui/GlobalLoader";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading && user === undefined) return <ScreenLoader />;

  if (!user) return <Navigate to="/auth" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
