import { lazy } from "react";
import { Route } from "react-router-dom";
import AuthPage from "../../../features/auth/forms/AuthPage";
import { ROLES } from "../../../utils/constants";

const Home = lazy(() => import("../../../features/public/pages/Home"));
const About = lazy(() => import("../../../features/public/pages/About"));
const ContactUs = lazy(() => import("../../../features/public/pages/ContactUs"));
const Blog = lazy(() => import("../../../features/public/pages/Blogs"));
const BlogDetails = lazy(
  () => import("../../../features/public/pages/BlogDetails"),
);
const Caregivers = lazy(() => import("../../../features/public/pages/Caregivers"));
const CaregiverDetails = lazy(
  () => import("../../../features/public/pages/CaregiverDetails"),
);
const Services = lazy(() => import("../../../features/public/pages/Services"));
const ServiceDetails = lazy(
  () => import("../../../features/public/pages/ServiceDetails"),
);
const PrivacyPolicy = lazy(
  () => import("../../../features/public/pages/PrivacyPolicy"),
);
const TermsOfService = lazy(
  () => import("../../../features/public/pages/TermsOfService"),
);

const PublicRoutes = () => (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<ContactUs />} />
    <Route path="/blogs" element={<Blog />} />
    <Route path="/blogs/:id" element={<BlogDetails />} />
    <Route path="/caregivers" element={<Caregivers />} />
    <Route path="/caregivers/:id" element={<CaregiverDetails />} />
    <Route path="/services" element={<Services />} />
    <Route path="/services/:id" element={<ServiceDetails />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />

    {/* AUTH */}
    <Route path="/auth" element={<AuthPage role={ROLES.USER} />} />
    <Route path="/admin-auth" element={<AuthPage role={ROLES.ADMIN} />} />
    <Route
      path="/caregiver-auth"
      element={<AuthPage role={ROLES.CAREGIVER} />}
    />
  </>
);

export default PublicRoutes;
