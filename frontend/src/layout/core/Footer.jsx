import { useState } from "react";
import Logo from "../../assets/logo.avif";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Send, Loader2, Phone, Mail, MapPin, ShieldCheck, HeartPulse, Award, PhoneCall } from "lucide-react";
import http from "../../lib/axios";
import FooterSection from "../../features/public/sections/footer/FooterSection";
import { footerLinks } from "../../data/navigation.data";
import Button from "../../components/ui/Button";
import { CONTACT_INFO } from "../../constants";

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
    "relative text-slate-500 dark:text-slate-400 font-medium after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full hover:text-blue-600 dark:hover:text-blue-400 transition-colors";

  return (
    <footer className="bg-slate-50 dark:bg-[#0a0f1c] border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 pt-10 pb-5 font-sans relative overflow-hidden">

      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-blue-900/5 dark:from-blue-900/10 to-transparent pointer-events-none" />

      <div className="w-full max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Company Info & Trust */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div>
              <img src={Logo} alt="ElderNest Logo" width={50} loading="lazy" className="dark:brightness-110" />
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base text-justify pr-4">
              ElderNest is a premium home healthcare platform dedicated to providing compassionate, reliable, and professional care for your loved ones in the comfort of their home.
            </p>

            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-emerald-500" />
                <a href={`tel:${CONTACT_INFO.PHONE.replace(/\s+/g, '')}`} className="hover:text-blue-600 transition-colors">{CONTACT_INFO.PHONE}</a>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-emerald-500" />
                <a href={`mailto:${CONTACT_INFO.EMAIL}`} className="hover:text-blue-600 transition-colors">{CONTACT_INFO.EMAIL}</a>
              </div>
            </div>

            {/* Certifications / Trust Indicators */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">ISO Certified</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Top Rated 2026</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterSection title="Company" links={footerLinks?.company} linkClass={footerLinksDesgin} />
            <FooterSection title="Services" links={footerLinks?.services} linkClass={footerLinksDesgin} />
            <FooterSection title="Support" links={footerLinks?.support} linkClass={footerLinksDesgin} />
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="inline-flex items-center rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/40 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 self-start mb-2">
              <HeartPulse className="mr-1.5 h-3 w-3" />
              Health Insights
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg">Join Our Newsletter</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
              Get the latest updates on elder care, wellness tips, and exclusive platform news delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-900 dark:text-white transition-all text-sm placeholder:text-slate-400 shadow-sm disabled:opacity-70"
              />
              <Button type="submit" disabled={loading} className="w-full justify-center flex items-center gap-2 py-3 rounded-xl shadow-md group">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    Subscribe <Send className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="w-full border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 pt-3">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} ElderNest Healthcare Pvt Ltd. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link to="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
