import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ allowedRoles, user }) => {

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
