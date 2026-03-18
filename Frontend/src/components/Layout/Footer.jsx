import React from "react";
import Logo from "../../assets/Logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks =
    "text-slate-500 dark:text-slate-300 font-semibold hover:text-[#FF3366] transition duration-300";

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Footer Links */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-3 px-5 py-10">
        {/* About Part */}
        <div className="col-span-2 flex flex-col items-start justify-start gap-3">
          <div className="flex items-center justify-center gap-3">
            <img
              src={Logo}
              alt="Logo"
              width={60}
              className="dark:brightness-110"
            />
            <p className="text-[#2a7de1] font-bold text-lg">ElderNest</p>
          </div>

          <p className="text-slate-500 dark:text-slate-300 max-w-sm leading-relaxed">
            Providing compassionate, professional, and reliable home healthcare
            services for your loved ones.
          </p>
        </div>

        {/* Footer Links */}
        <div className="col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-3">
            {/* Company Links */}
            <div className="col-span-1 flex flex-col gap-5 items-start justify-start">
              <p className="font-bold text-slate-800 dark:text-slate-100">
                Company
              </p>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className={footerLinks}>
                    About us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className={footerLinks}>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/blogs" className={footerLinks}>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/services" className={footerLinks}>
                    Services
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services Links */}
            <div className="col-span-1 flex flex-col gap-5 items-start justify-start">
              <p className="font-bold text-slate-800 dark:text-slate-100">
                Services
              </p>
              <ul className="space-y-3">
                <li>
                  <Link to="/services" className={footerLinks}>
                    Nursing Care
                  </Link>
                </li>
                <li>
                  <Link to="/services" className={footerLinks}>
                    Elderly Attendant
                  </Link>
                </li>
                <li>
                  <Link to="/services" className={footerLinks}>
                    Physiotherapy
                  </Link>
                </li>
                <li>
                  <Link to="/services" className={footerLinks}>
                    Dementia Care
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Professionals Links */}
            <div className="col-span-1 flex flex-col gap-5 items-start justify-start">
              <p className="font-bold text-slate-800 dark:text-slate-100">
                For Professionals
              </p>
              <ul className="space-y-3">
                <li>
                  <Link to="/caregiver-login" className={footerLinks}>
                    Join as Caregiver
                  </Link>
                </li>
                <li>
                  <Link to="*" className={footerLinks}>
                    Partner Clinics
                  </Link>
                </li>
                <li>
                  <Link to="*" className={footerLinks}>
                    Training Resources
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright reserved */}
      <div className="w-full max-w-7xl mx-auto border-t border-slate-300 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-3 text-slate-500 dark:text-slate-300 py-10 px-5 transition-colors duration-300">
        <p>&copy; CareHome Healthcare Services. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <Link className="hover:text-[#FF3366] transition duration-300">
            Privacy Policy
          </Link>
          <Link className="hover:text-[#FF3366] transition duration-300">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
