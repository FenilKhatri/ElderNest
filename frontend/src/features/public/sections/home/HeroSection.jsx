import { ShieldCheck, Clock3, HeartHandshake, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import HeroImage from "./HeroImage";
import { slideLeft, stagger } from "../../../../animations/motionVariants";
import Button from "../../../../components/ui/Button";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[90vh] dark:bg-slate-950 flex items-center overflow-hidden font-sans">
      <div className="w-full max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-0 h-full flex flex-col lg:flex-row items-center justify-between relative z-10">
        
        {/* Left Side (Text & Buttons) */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="w-full lg:w-1/2 flex flex-col items-start justify-center space-y-7 z-20"
        >
          <motion.div variants={slideLeft} className="w-full flex flex-col items-start space-y-7">
            
            {/* Top Badge */}
            <div className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/40 px-4 py-2 text-sm font-medium text-slate-700 dark:text-white shadow-sm backdrop-blur-sm">
              <ShieldCheck className="mr-2 h-4 w-4 text-[#00d27a]" />
              Compassionate in-home care
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-[64px] font-bold leading-[1.15] text-slate-900 dark:text-white">
              Book Trusted Caregivers<br className="hidden md:block" />
              Online with <span className="relative inline-block text-[#00d27a]">
                ElderNest
                <svg className="absolute left-0 top-[90%] w-full" viewBox="0 0 200 15" fill="none" preserveAspectRatio="none">
                   <path d="M0 4 Q100 0 200 4" stroke="#00d27a" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-slate-600 dark:text-[#8f9bb3] max-w-[540px] leading-relaxed">
              Find and book trusted caregivers, nurses, and patient care services
              in Gujarat. ElderNest connects you with verified professionals for
              elder care, home nursing, and 24/7 support at your doorstep.
            </p>

            {/* Buttons */}
            <div className="flex w-full flex-col sm:flex-row items-center gap-4 pt-2">
              <NavLink to="/caregivers" className="w-full sm:w-auto">
                <Button className="py-3.5 w-full sm:w-auto">
                  Book Caregiver Now
                  <ArrowRight size={18} />
                </Button>
              </NavLink>

              <NavLink to="/contact" className="w-full sm:w-auto">
                <Button variant="outline" className="border-slate-300 text-slate-700 dark:border-white dark:text-white dark:hover:bg-white/10 py-3.5 w-full sm:w-auto">
                  Talk to Care Expert
                </Button>
              </NavLink>
            </div>

            {/* Features inline list */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4">
              <div className="flex items-center gap-2 text-sm md:text-[15px] font-medium text-slate-700 dark:text-white">
                <ShieldCheck size={20} className="text-[#00d27a]" />
                Verified Caregivers
              </div>
              <div className="flex items-center gap-2 text-sm md:text-[15px] font-medium text-slate-700 dark:text-white">
                <Clock3 size={20} className="text-[#1d7af2]" />
                24/7 Caare Support
              </div>
              <div className="flex items-center gap-2 text-sm md:text-[15px] font-medium text-slate-700 dark:text-white">
                <HeartHandshake size={20} className="text-[#FF3366]" />
                Trusted by Families
              </div>
            </div>

            {/* Secure Booking */}
            <div className="pt-6">
              <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/40 px-5 py-3 text-sm font-semibold text-slate-800 dark:text-white shadow-sm backdrop-blur-sm">
                Secure Booking
              </div>
            </div>

          </motion.div>
        </motion.div>

        {/* Right Side (Image and Background Patterns) */}
        <div className="w-full lg:w-1/2 relative hidden lg:flex items-end justify-center z-10 pt-12 lg:pt-0">

          {/* The Hero Image component */}
          <div className="relative z-10 w-full max-w-[500px] xl:max-w-[600px]">
            <HeroImage />
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;
