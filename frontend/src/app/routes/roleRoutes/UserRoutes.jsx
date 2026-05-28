import { lazy } from "react";
import { Route } from "react-router-dom";
import { ROLES } from "../../../utils/constants";
import ProtectedRoute from "../ProtectedRoute";
import RoleRoute from "../RoleRoutes";

const UserProfile = lazy(() => import("../../../features/user/pages/Profile"));
const MyBookings = lazy(() => import("../../../features/user/pages/MyBookings"));
const History = lazy(() => import("../../../features/user/pages/History"));

const UserRoutes = () => (
  <Route element={<ProtectedRoute />}>
    <Route element={<RoleRoute allowedRoles={[ROLES.USER]} />}>
      <Route path="/user/profile" element={<UserProfile />} />
      <Route path="/user/bookings" element={<MyBookings />} />
      <Route path="/user/history" element={<History />} />
    </Route>
  </Route>
);

export default UserRoutes;
