import { lazy } from "react";
import { Route } from "react-router-dom";
import { ROLES } from "../../../utils/constants";
import ProtectedRoute from "../ProtectedRoute";
import RoleRoute from "../RoleRoutes";
import CaregiverLayout from "../../../layout/dashboard/CaregiverLayout";

// Auth / status pages (NO auth required)
const CaregiverLogin    = lazy(() => import("../../../features/caregiver/pages/CaregiverLogin"));
const PendingApproval   = lazy(() => import("../../../features/caregiver/pages/PendingApproval"));
const RejectedAccount   = lazy(() => import("../../../features/caregiver/pages/RejectedAccount"));

// Protected dashboard pages
const CaregiverDashboard  = lazy(() => import("../../../features/caregiver/pages/CaregiverDashboard"));
const CompleteProfile     = lazy(() => import("../../../features/caregiver/pages/CompleteProfile"));
const CaregiverProfile    = lazy(() => import("../../../features/caregiver/pages/Profile"));
const CaregiverBookings   = lazy(() => import("../../../features/caregiver/pages/Bookings"));
const CaregiverRequests   = lazy(() => import("../../../features/caregiver/pages/Requests"));
const CaregiverServices   = lazy(() => import("../../../features/caregiver/pages/Services"));
const CaregiverPayments   = lazy(() => import("../../../features/caregiver/pages/Payments"));
const CaregiverReviews    = lazy(() => import("../../../features/caregiver/pages/Reviews"));

const CaregiverRoutes = ({ theme, toggleTheme }) => (
  <>
    {/* ── Public caregiver routes (no auth required) ── */}
    <Route path="/caregiver/login"            element={<CaregiverLogin />} />
    <Route path="/caregiver/pending-approval" element={<PendingApproval />} />
    <Route path="/caregiver/rejected"         element={<RejectedAccount />} />

    {/* ── Protected caregiver dashboard routes ── */}
    <Route element={<ProtectedRoute />}>
      <Route element={<RoleRoute allowedRoles={[ROLES.CAREGIVER]} />}>
        <Route element={<CaregiverLayout theme={theme} toggleTheme={toggleTheme} />}>
          <Route path="/caregiver/dashboard"        element={<CaregiverDashboard />} />
          <Route path="/caregiver/complete-profile" element={<CompleteProfile />} />
          <Route path="/caregiver/profile"          element={<CaregiverProfile />} />
          <Route path="/caregiver/bookings"         element={<CaregiverBookings />} />
          <Route path="/caregiver/requests"         element={<CaregiverRequests />} />
          <Route path="/caregiver/services"         element={<CaregiverServices />} />
          <Route path="/caregiver/payments"         element={<CaregiverPayments />} />
          <Route path="/caregiver/reviews"          element={<CaregiverReviews />} />
        </Route>
      </Route>
    </Route>
  </>
);

export default CaregiverRoutes;
