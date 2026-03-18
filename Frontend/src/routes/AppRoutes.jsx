import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "../components/Layout/PublicLayout";
import Login from "../components/forms/Login";
import Register from "../components/forms/Register";
import CareGiverLogin from "../components/forms/CareGiverLogin";
import CareGiverRegister from "../components/forms/CareGiverRegister";

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
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/caregiver-login" element={<CareGiverLogin />} />
            <Route path="/caregiver-register" element={<CareGiverRegister />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;