import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {

  const { user, loading } = useAuth();
  if(loading) return <div>Loading...</div>

  if(!user) return <Navigate to="/auth" replace />

  return <Outlet />; 
}

export default ProtectedRoute;