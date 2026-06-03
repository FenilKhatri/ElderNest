import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import { ROLES } from "@/constants";
import ProtectedRoute from "../ProtectedRoute";
import RoleRoute from "../RoleRoutes";
import CaregiverLayout from "../../../layout/dashboard/CaregiverLayout";

// Auth / status pages (NO auth required)
const PendingApproval = lazy(() => import("../../../features/caregiver/pages/PendingApproval"));
const RejectedAccount = lazy(() => import("../../../features/caregiver/pages/RejectedAccount"));

// Protected dashboard pages
const CaregiverDashboard = lazy(() => import("../../../features/caregiver/pages/CaregiverDashboard"));
const CompleteProfile = lazy(() => import("../../../features/caregiver/pages/CompleteProfile"));
const CaregiverProfile = lazy(() => import("../../../features/caregiver/pages/Profile"));
const CaregiverBookings = lazy(() => import("../../../features/caregiver/pages/Bookings"));
const CaregiverRequests = lazy(() => import("../../../features/caregiver/pages/Requests"));
const CaregiverServices = lazy(() => import("../../../features/caregiver/pages/Services"));
const CaregiverPayments = lazy(() => import("../../../features/caregiver/pages/Payments"));
const CaregiverReviews = lazy(() => import("../../../features/caregiver/pages/Reviews"));
const CaregiverNotifications = lazy(() => import("../../../features/caregiver/pages/Notifications"));
const CareNotes = lazy(() => import("../../../features/caregiver/pages/CareNotes"));
const CaregiverDocuments = lazy(() => import("../../../features/caregiver/pages/Documents"));
const CaregiverVerification = lazy(() => import("../../../features/caregiver/pages/Verification"));
const CaregiverAvailability = lazy(() => import("../../../features/caregiver/pages/Availability"));
const CaregiverAnalytics = lazy(() => import("../../../features/caregiver/pages/Analytics"));
const CaregiverComplaints = lazy(() => import("../../../features/caregiver/pages/CaregiverComplaints"));
const CaregiverSettings = lazy(() => import("../../../features/caregiver/pages/Settings"));
const CaregiverBookingDetails = lazy(() => import("../../../features/caregiver/pages/BookingDetails"));

const CaregiverRoutes = ({ theme, toggleTheme }) => (
  <>
    {/* ── Public caregiver routes (no auth required) ── */}
    <Route path="/caregiver/pending-approval" element={<PendingApproval />} />
    <Route path="/caregiver/rejected" element={<RejectedAccount />} />

    {/* ── Protected caregiver dashboard routes ── */}
    <Route element={<ProtectedRoute />}>
      <Route element={<RoleRoute allowedRoles={[ROLES.CAREGIVER]} />}>
        <Route element={<CaregiverLayout theme={theme} toggleTheme={toggleTheme} />}>
          <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
          <Route path="/caregiver/complete-profile" element={<CompleteProfile />} />
          <Route path="/caregiver/profile" element={<CaregiverProfile />} />
          <Route path="/caregiver/bookings" element={<CaregiverBookings />} />
          <Route path="/caregiver/bookings/:id" element={<CaregiverBookingDetails />} />
          <Route path="/caregiver/requests" element={<CaregiverRequests />} />
          <Route path="/caregiver/services" element={<CaregiverServices />} />
          <Route path="/caregiver/payments" element={<CaregiverPayments />} />
          <Route path="/caregiver/reviews" element={<CaregiverReviews />} />
          <Route path="/caregiver/notifications" element={<CaregiverNotifications />} />
          <Route path="/caregiver/notification" element={<Navigate to="/caregiver/notifications" replace />} />
          <Route path="/caregiver/care-notes" element={<CareNotes />} />
          <Route path="/caregiver/complaints" element={<CaregiverComplaints />} />
          <Route path="/caregiver/documents" element={<CaregiverDocuments />} />
          <Route path="/caregiver/verification" element={<CaregiverVerification />} />
          <Route path="/caregiver/availability" element={<CaregiverAvailability />} />
          <Route path="/caregiver/analytics" element={<CaregiverAnalytics />} />
          <Route path="/caregiver/settings" element={<CaregiverSettings />} />
        </Route>
      </Route>
    </Route>
  </>
);

export default CaregiverRoutes;
