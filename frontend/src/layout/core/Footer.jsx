import { useState } from "react";
import Logo from "../../assets/logo.avif";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Send, Loader2 } from "lucide-react";
import http from "../../lib/axios";
import FooterSection from "../../features/public/sections/footer/FooterSection";
import { footerLinks } from "../../data/navigation.data";
import Button from "../../components/ui/Button";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      await http.post("/newsletter/subscribe", { email });
      toast.success("Successfully subscribed to the newsletter!");
      setEmail("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to subscribe. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const footerLinksDesgin =
    "relative text-slate-500 dark:text-slate-300 font-medium after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#FF3366] after:transition-all after:duration-300 hover:after:w-full hover:text-[#FF3366]";

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Top Section */}
      <div className="w-full max-w-site-wide mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8 py-16">
        {/* About */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <img
              src={Logo}
              alt="ElderNest Logo"
              width={50}
              loading="lazy"
              className="dark:brightness-110"
            />
            <p className="text-[#2a7de1] font-bold text-xl tracking-tight">ElderNest</p>
          </div>

          <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed text-sm">
            Providing compassionate, professional, and reliable home healthcare
            services for your loved ones.
          </p>

          <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm">
            Explore our{" "}
            <NavLink
              to="/services"
              className="relative text-[#FF3366] font-medium after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-[#FF3366] after:transition-all after:duration-300 hover:after:w-full"
            >
              elder care services
            </NavLink>{" "}
            or{" "}
            <NavLink
              to="/contact"
              className="relative text-[#FF3366] font-medium after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-[#FF3366] after:transition-all after:duration-300 hover:after:w-full"
            >
              contact our experts
            </NavLink>
            .
          </p>
        </div>

        {/* Links */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <FooterSection
            title="Company"
            links={footerLinks?.company}
            linkClass={footerLinksDesgin}
          />

          <FooterSection
            title="Services"
            links={footerLinks?.services}
            linkClass={footerLinksDesgin}
          />

          <FooterSection
            title="Support"
            links={footerLinks?.support}
            linkClass={footerLinksDesgin}
          />
        </div>

        {/* Newsletter Subscription */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-slate-900 dark:text-white font-bold text-lg">Stay Updated</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
            Subscribe to our newsletter for the latest updates on elder care, health tips, and platform news.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF3366]/50 focus:border-[#FF3366] text-slate-900 dark:text-white transition-all text-sm placeholder:text-slate-400 disabled:opacity-70"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full justify-center flex items-center gap-2 bg-[#FF3366] hover:bg-[#E62E5C] text-white py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Subscribe Now <Send className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full max-w-site-wide mx-auto border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-400 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <p className="text-sm font-medium">
          &copy; {new Date().getFullYear()} ElderNest. All rights reserved.
        </p>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            to="/privacy-policy"
            className="hover:text-[#FF3366] transition duration-300"
          >
            Privacy Policy
          </Link>

          <Link
            to="/terms-of-service"
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
