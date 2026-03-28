import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "../components/Layout/PublicLayout";
import Login from "../components/forms/auth/Login";
import Register from "../components/forms/auth/Register";
import CareGiverLogin from "../components/forms/auth/CareGiverLogin";
import CareGiverRegister from "../components/forms/auth/CareGiverRegister";
import AuthLayout from "../components/layout/AuthLayout";
import TermsOfServiceLayout from "../pages/public/TermsOfService";
import PrivacyPolicyLayout from "../pages/public/PrivacyPolicy";

const Home = lazy(() => import("../pages/public/Home"));
const About = lazy(() => import("../pages/public/About"));
const ContactUs = lazy(() => import("../pages/public/ContactUs"));
const Blog = lazy(() => import("../pages/public/Blog"));
const BlogDetails = lazy(() => import("../pages/public/BlogDetails"));
const Caregivers = lazy(() => import("../pages/public/Caregivers"));
const CaregiverDetails = lazy(() => import("../pages/public/CaregiverDetails"));
const Services = lazy(() => import("../pages/public/Services"));
const ServiceDetails = lazy(() => import("../pages/public/ServiceDetails"));
const PageNotFound = lazy(() => import("../pages/public/PageNotFound"));

const AppRoutes = ({ theme, toggleTheme }) => {
  return (
    <Router>
      <Suspense>
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
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Register />} />
            </Route>
            <Route path="/caregiver-login" element={<CareGiverLogin />} />
            <Route path="/caregiver-register" element={<CareGiverRegister />} />
            <Route element={<TermsOfServiceLayout />}>
              <Route
                path="/terms-of-services"
                element={<TermsOfServiceLayout />}
              />
            </Route>
            <Route element={<PrivacyPolicyLayout />}>
              <Route
                path="/privacy-policy"
                element={<PrivacyPolicyLayout />}
              />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
