import { lazy } from "react";
import { Route } from "react-router-dom";
import { ROLES } from "../../../utils/constants";
import ProtectedRoute from "../ProtectedRoute";
import RoleRoute from "../RoleRoutes";
import DashboardLayout from "../../../layout/dashboard/DashboardLayout";

const AdminDashboard = lazy(() => import("../../../features/admin/pages/Dashboard"));
const AdminProfile = lazy(() => import("../../../features/admin/pages/Profile"));
const AdminUsers = lazy(() => import("../../../features/admin/pages/Users"));
const AdminCaregivers = lazy(() => import("../../../features/admin/pages/Caregivers"));
const AdminServices = lazy(() => import("../../../features/admin/pages/Services"));
const AdminBookings = lazy(() => import("../../../features/admin/pages/Bookings"));
const AdminBlogs = lazy(() => import("../../../features/admin/pages/Blogs"));
const AdminBlogForm = lazy(() => import("../../../features/admin/pages/BlogForm"));
const AdminSettings = lazy(() => import("../../../features/admin/pages/Settings"));

// Payments
const PaymentsTransactions = lazy(() => import("../../../features/admin/pages/PaymentsTransactions"));
const PaymentsPayouts = lazy(() => import("../../../features/admin/pages/PaymentsPayouts"));
const PaymentsRefunds = lazy(() => import("../../../features/admin/pages/PaymentsRefunds"));

// Complaints
const ComplaintsUser = lazy(() => import("../../../features/admin/pages/ComplaintsUser"));
const ComplaintsCaregiver = lazy(() => import("../../../features/admin/pages/ComplaintsCaregiver"));
const ComplaintsResolved = lazy(() => import("../../../features/admin/pages/ComplaintsResolved"));
const ComplaintsPending = lazy(() => import("../../../features/admin/pages/ComplaintsPending"));

const AdminNotifications = lazy(() => import("../../../features/admin/pages/Notifications"));

// User and Caregiver Details Pages
const UserDetails = lazy(() => import("../../../features/admin/pages/UserDetails"));
const CaregiverDetails = lazy(() => import("../../../features/admin/pages/CaregiverDetails"));

const AdminRoutes = ({ theme, toggleTheme }) => (
  <Route element={<ProtectedRoute />}>
    <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
      <Route element={<DashboardLayout theme={theme} toggleTheme={toggleTheme} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        
        {/* Users */}
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/users/:id" element={<UserDetails />} />
        <Route path="/admin/caregivers" element={<AdminCaregivers />} />
        <Route path="/admin/caregivers/:id" element={<CaregiverDetails />} />
        
        {/* Management */}
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/blogs" element={<AdminBlogs />} />
        <Route path="/admin/blogs/create" element={<AdminBlogForm />} />
        <Route path="/admin/blogs/edit/:id" element={<AdminBlogForm />} />
        
        {/* Payments */}
        <Route path="/admin/payments/transactions" element={<PaymentsTransactions />} />
        <Route path="/admin/payments/payouts" element={<PaymentsPayouts />} />
        <Route path="/admin/payments/refunds" element={<PaymentsRefunds />} />
        
        {/* Complaints */}
        <Route path="/admin/complaints/user" element={<ComplaintsUser />} />
        <Route path="/admin/complaints/caregiver" element={<ComplaintsCaregiver />} />
        <Route path="/admin/complaints/resolved" element={<ComplaintsResolved />} />
        <Route path="/admin/complaints/pending" element={<ComplaintsPending />} />
        
        <Route path="/admin/notifications" element={<AdminNotifications />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>
    </Route>
  </Route>
);

export default AdminRoutes;
