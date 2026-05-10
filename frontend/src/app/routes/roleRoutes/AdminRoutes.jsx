import { lazy } from "react";
import { Route } from "react-router-dom";
import { ROLES } from "../../../utils/constants";
import ProtectedRoute from "../ProtectedRoute";
import RoleRoute from "../RoleRoutes";
import DashboardLayout from "../../../layout/dashboard/DashboardLayout";

const AdminDashboard = lazy(
  () => import("../../../features/admin/pages/Dashboard"),
);
const AdminProfile = lazy(() => import("../../../features/admin/pages/Profile"));
const AdminUsers = lazy(() => import("../../../features/admin/pages/Users"));
const AdminCaregivers = lazy(
  () => import("../../../features/admin/pages/Caregivers"),
);
const AdminElders = lazy(() => import("../../../features/admin/pages/Elders"));
const AdminServices = lazy(() => import("../../../features/admin/pages/Services"));
const AdminBookings = lazy(() => import("../../../features/admin/pages/Bookings"));
const AdminComplaints = lazy(
  () => import("../../../features/admin/pages/Complaints"),
);
const AdminPayments = lazy(() => import("../../../features/admin/pages/Payments"));
const AdminReviews = lazy(() => import("../../../features/admin/pages/Reviews"));
const AdminSettings = lazy(() => import("../../../features/admin/pages/Settings"));

const AdminRoutes = ({ theme, toggleTheme }) => (
  <Route element={<ProtectedRoute />}>
    <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
      <Route
        element={<DashboardLayout theme={theme} toggleTheme={toggleTheme} />}
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/caregivers" element={<AdminCaregivers />} />
        <Route path="/admin/elders" element={<AdminElders />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>
    </Route>
  </Route>
);

export default AdminRoutes;
