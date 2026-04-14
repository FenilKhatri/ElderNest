import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import CareGiverLogin from "../components/forms/auth/CaregiverLogin";
import CareGiverRegister from "../components/forms/auth/CaregiverRegister";
import UserAuthPage from "../components/forms/auth/UserAuthPage";
import PublicLayout from "../components/layout/PublicLayout";
import { ToastContainer } from "react-toastify";

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

const AppRoutes = ({ theme, toggleTheme }) => {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <ToastContainer autoClose="5000" />
      <Routes>
        {/* Public Routes */}
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
          <Route path="/auth" element={<UserAuthPage />} />
          <Route path="/caregiver-login" element={<CareGiverLogin />} />
          <Route path="/caregiver-register" element={<CareGiverRegister />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;