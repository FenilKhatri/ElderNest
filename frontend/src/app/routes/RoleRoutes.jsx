import { Navigate, Outlet } from "react-router-dom";
import GlobalLoader from "../../components/ui/GlobalLoader";
import { getRedirectByRole } from "../../utils/roleRedirect";
import { useAuth } from "../../context/AuthContext";

const RoleRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <GlobalLoader />;

  if (!user) return <Navigate to="/auth" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getRedirectByRole(user.role)} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
