import { lazy } from "react";
import { Route } from "react-router-dom";
import { ROLES } from "../../../utils/constants";
import ProtectedRoute from "../ProtectedRoute";
import RoleRoute from "../RoleRoutes";
import DashboardLayout from "../../../layout/dashboard/DashboardLayout";

const CaregiverDashboard = lazy(
  () => import("../../../features/caregiver/pages/Dashboard"),
);
const CaregiverBookings = lazy(
  () => import("../../../features/caregiver/pages/Bookings"),
);
const CaregiverRequests = lazy(
  () => import("../../../features/caregiver/pages/Requests"),
);
const CaregiverServices = lazy(
  () => import("../../../features/caregiver/pages/Services"),
);
const CaregiverPayments = lazy(
  () => import("../../../features/caregiver/pages/Payments"),
);
const CaregiverReviews = lazy(
  () => import("../../../features/caregiver/pages/Reviews"),
);
const CaregiverProfile = lazy(
  () => import("../../../features/caregiver/pages/Profile"),
);

const CaregiverRoutes = ({ theme, toggleTheme }) => (
  <Route element={<ProtectedRoute />}>
    <Route element={<RoleRoute allowedRoles={[ROLES.CAREGIVER]} />}>
      <Route
        element={<DashboardLayout theme={theme} toggleTheme={toggleTheme} />}
      >
        <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
        <Route path="/caregiver/profile" element={<CaregiverProfile />} />
        <Route path="/caregiver/bookings" element={<CaregiverBookings />} />
        <Route path="/caregiver/requests" element={<CaregiverRequests />} />
        <Route path="/caregiver/services" element={<CaregiverServices />} />
        <Route path="/caregiver/payments" element={<CaregiverPayments />} />
        <Route path="/caregiver/reviews" element={<CaregiverReviews />} />
      </Route>
    </Route>
  </Route>
);

export default CaregiverRoutes;
