import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ScreenLoader from "../components/ui/GlobalLoader";
import { getRedirectByRole } from "../utils/roleRedirect";

const RoleRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <ScreenLoader />;

  if (!user) return <Navigate to="/auth" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getRedirectByRole(user.role)} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
