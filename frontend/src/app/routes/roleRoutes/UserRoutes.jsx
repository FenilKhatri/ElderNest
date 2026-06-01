import { lazy } from "react";
import { Route } from "react-router-dom";
import { ROLES } from "../../../utils/constants";
import ProtectedRoute from "../ProtectedRoute";
import RoleRoute from "../RoleRoutes";

const UserProfile = lazy(() => import("../../../features/user/pages/Profile"));
const MyBookings = lazy(() => import("../../../features/user/pages/MyBookings"));
const History = lazy(() => import("../../../features/user/pages/History"));
const BookServices = lazy(() => import("../../../features/user/pages/BookServices"));
const Patients = lazy(() => import("../../../features/user/pages/Patients"));
const UserComplaints = lazy(() => import("../../../features/user/pages/UserComplaints"));
const UserNotifications = lazy(() => import("../../../features/user/pages/UserNotifications"));
const AddPatientPage = lazy(() => import("../../../features/user/pages/AddPatientPage"));
const SubmitComplaintPage = lazy(() => import("../../../features/user/pages/SubmitComplaintPage"));

const UserRoutes = () => (
  <Route element={<ProtectedRoute />}>
    <Route element={<RoleRoute allowedRoles={[ROLES.USER]} />}>
      <Route path="/user/profile" element={<UserProfile />} />
      <Route path="/user/bookings" element={<MyBookings />} />
      <Route path="/user/history" element={<History />} />
      <Route path="/user/patients" element={<Patients />} />
      <Route path="/user/complaints" element={<UserComplaints />} />
      <Route path="/user/notifications" element={<UserNotifications />} />
      <Route path="/user/book-caregiver/:caregiverId" element={<BookServices />} />
      <Route path="/user/patients/new" element={<AddPatientPage />} />
      <Route path="/user/patients/edit" element={<AddPatientPage />} />
      <Route path="/user/complaints/new" element={<SubmitComplaintPage />} />
    </Route>
  </Route>
);

export default UserRoutes;
