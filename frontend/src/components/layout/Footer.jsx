import Logo from "../../assets/logo.avif";
import { Link, NavLink } from "react-router-dom";
import FooterSection from "../sections/footer/FooterSection";
import { links } from "../../data/navigations/links";

const Footer = () => {
  const footerLinks =
    "relative text-slate-500 dark:text-slate-300 font-medium after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#FF3366] after:transition-all after:duration-300 hover:after:w-full hover:text-[#FF3366]";

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 px-5 py-12">
        {/* About */}
        <div className="col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src={Logo}
              alt="ElderNest Logo"
              width={50}
              loading="lazy"
              className="dark:brightness-110"
            />
            <p className="text-[#2a7de1] font-bold text-lg">ElderNest</p>
          </div>

          <p className="text-slate-500 dark:text-slate-300 max-w-sm leading-relaxed">
            Providing compassionate, professional, and reliable home healthcare
            services for your loved ones.
          </p>

          <p className="text-slate-500 dark:text-slate-300 max-w-sm">
            Explore our{" "}
            <NavLink
              to="/services"
              className="relative text-[#FF3366] after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-[#FF3366] after:transition-all after:duration-300 hover:after:w-full"
            >
              elder care services
            </NavLink>{" "}
            or{" "}
            <NavLink
              to="/contact"
              className="relative text-[#FF3366] after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-[#FF3366] after:transition-all after:duration-300 hover:after:w-full"
            >
              contact our experts
            </NavLink>
            .
          </p>
        </div>

        {/* Links */}
        <div className="col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FooterSection
              title="Company"
              links={links?.common}
              linkClass={footerLinks}
            />

            <FooterSection
              title="Services"
              links={links?.footer?.services}
              linkClass={footerLinks}
            />

            <FooterSection
              title="For Professionals"
              links={links?.footer?.professionals}
              linkClass={footerLinks}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full max-w-7xl mx-auto border-t border-slate-300 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-300 py-6 px-5 transition-colors duration-300">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} ElderNest. All rights reserved.
        </p>

        <div className="flex items-center gap-6 text-sm">
          <Link
            to="/privacy-policy"
            className="hover:text-[#FF3366] transition duration-300"
          >
            Privacy Policy
          </Link>

          <Link
            to="/terms"
            className="hover:text-[#FF3366] transition duration-300"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
