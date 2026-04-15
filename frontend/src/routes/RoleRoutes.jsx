import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ allowedRoles }) => {
  
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/auth" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;