import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoutes";

import PublicLayout from "../components/layout/PublicLayout";
import AdminLayout from "../components/layout/AdminLayout";
import CaregiverLayout from "../components/layout/CaregiverLayout";

import CareGiverLogin from "../components/forms/auth/CaregiverLogin";
import CareGiverRegister from "../components/forms/auth/CaregiverRegister";
import UserAuthPage from "../components/forms/auth/UserAuthPage";

import Bookings from "../pages/admin/Bookings";
import UpdatePassword from "../pages/admin/UpdatePassword";

//  PUBLIC 
const Home = lazy(() => import("../pages/public/Home"));
const About = lazy(() => import("../pages/public/About"));
const ContactUs = lazy(() => import("../pages/public/ContactUs"));
const Blog = lazy(() => import("../pages/public/Blogs"));
const BlogDetails = lazy(() => import("../pages/public/Blogdetails"));
const Caregivers = lazy(() => import("../pages/public/Caregivers"));
const CaregiverDetails = lazy(() => import("../pages/public/CaregiverDetails"));
const Services = lazy(() => import("../pages/public/Services"));
const ServiceDetails = lazy(() => import("../pages/public/ServiceDetails"));
const PageNotFound = lazy(() => import("../pages/public/PageNotFound"));

//  USER 
const Dashboard = lazy(() => import("../pages/users/Dashboard"));
const BookServices = lazy(() => import("../pages/users/BookServices"));
const MyBookings = lazy(() => import("../pages/users/MyBookings"));
const UserProfile = lazy(() => import("../pages/users/Profile"));

//  ADMIN 
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminProfile = lazy(() => import("../pages/admin/Profile"));
const Complaints = lazy(() => import("../pages/admin/Complaints"));
const Users = lazy(() => import("../pages/admin/Users"));
const AdminServices = lazy(() => import("../pages/admin/Services"));
const AdminCaregivers = lazy(() => import("../pages/admin/Caregivers"));

//  CAREGIVER 
const CaregiverDashboard = lazy(() => import("../pages/caregiver/Dashboard"));
const CareNotes = lazy(() => import("../pages/caregiver/CareNotes"));
const Requests = lazy(() => import("../pages/caregiver/Requests"));
const ActiveServices = lazy(() => import("../pages/caregiver/ActiveServices"));
const CaregiverProfile = lazy(() => import("../pages/caregiver/Profile"));

const AppRoutes = ({ theme, toggleTheme }) => {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <ToastContainer autoClose={5000} />

      <Routes>
        {/*  PUBLIC  */}
        <Route
          element={<PublicLayout theme={theme} toggleTheme={toggleTheme} />}
        >
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/caregivers" element={<Caregivers />} />
          <Route path="/caregivers/:id" element={<CaregiverDetails />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />

          {/* Auth */}
          <Route path="/auth" element={<UserAuthPage />} />
          <Route path="/caregiver-login" element={<CareGiverLogin />} />
          <Route path="/caregiver-register" element={<CareGiverRegister />} />

          {/* USER (Protected) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/user/dashboard" element={<Dashboard />} />
            <Route path="/user/book-services" element={<BookServices />} />
            <Route path="/user/my-bookings" element={<MyBookings />} />
            <Route path="/user/profile" element={<UserProfile />} />
          </Route>

          {/*  404  */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
        {/*  ADMIN  */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route
              element={<AdminLayout theme={theme} toggleTheme={toggleTheme} />}
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/caregivers" element={<AdminCaregivers />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/bookings" element={<Bookings />} />
              <Route path="/admin/complaints" element={<Complaints />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route
                path="/admin/update-password"
                element={<UpdatePassword />}
              />
            </Route>
          </Route>
        </Route>
        {/*  CAREGIVER  */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={["caregiver"]} />}>
            <Route
              element={
                <CaregiverLayout theme={theme} toggleTheme={toggleTheme} />
              }
            >
              <Route
                path="/caregiver/dashboard"
                element={<CaregiverDashboard />}
              />
              <Route
                path="/caregiver/active-services"
                element={<ActiveServices />}
              />
              <Route path="/caregiver/care-notes" element={<CareNotes />} />
              <Route path="/caregiver/requests" element={<Requests />} />
              <Route path="/caregiver/profile" element={<CaregiverProfile />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
