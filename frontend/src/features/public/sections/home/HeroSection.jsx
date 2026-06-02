import { ShieldCheck, Clock3, HeartHandshake, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import HeroImage from "./HeroImage";
import { slideLeft, stagger } from "../../../../animations/motionVariants";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[90vh] bg-[#0b0f19] flex items-center overflow-hidden font-sans">
      <div className="container mx-auto px-6 md:px-12 xl:px-20 py-12 md:py-20 lg:py-0 w-full h-full flex flex-col lg:flex-row items-center justify-between relative z-10">
        
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
            <div className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/40 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur-sm">
              <ShieldCheck className="mr-2 h-4 w-4 text-[#00d27a]" />
              Compassionate in-home care
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-[64px] font-bold leading-[1.15] text-white">
              Book Trusted Caregivers<br className="hidden md:block" />
              Online with <span className="relative inline-block text-[#00d27a]">
                ElderNest
                <svg className="absolute left-0 top-[90%] w-full" viewBox="0 0 200 15" fill="none" preserveAspectRatio="none">
                   <path d="M0 4 Q100 0 200 4" stroke="#00d27a" strokeWidth="4" strokeLinecap="round" />
                   <path d="M20 12 Q100 8 180 12" stroke="#00d27a" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-[#8f9bb3] max-w-[540px] leading-relaxed">
              Find and book trusted caregivers, nurses, and patient care services
              in Gujarat. ElderNest connects you with verified professionals for
              elder care, home nursing, and 24/7 support at your doorstep.
            </p>

            {/* Buttons */}
            <div className="flex w-full flex-col sm:flex-row items-center gap-4 pt-2">
              <NavLink to="/caregivers" className="w-full sm:w-auto">
                <button className="flex items-center justify-center gap-2 bg-[#1d7af2] hover:bg-blue-600 text-white px-6 py-3.5 rounded-md font-medium w-full sm:w-auto transition-colors">
                  Book Caregiver Now
                  <ArrowRight size={18} />
                </button>
              </NavLink>

              <NavLink to="/contact" className="w-full sm:w-auto">
                <button className="flex items-center justify-center bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3.5 rounded-md font-medium w-full sm:w-auto transition-colors">
                  Talk to Care Expert
                </button>
              </NavLink>
            </div>

            {/* Features inline list */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4">
              <div className="flex items-center gap-2 text-sm md:text-[15px] font-medium text-white">
                <ShieldCheck size={20} className="text-[#00d27a]" />
                Verified Caregivers
              </div>
              <div className="flex items-center gap-2 text-sm md:text-[15px] font-medium text-white">
                <Clock3 size={20} className="text-[#1d7af2]" />
                24/7 Caare Support
              </div>
              <div className="flex items-center gap-2 text-sm md:text-[15px] font-medium text-white">
                <HeartHandshake size={20} className="text-[#FF3366]" />
                Trusted by Families
              </div>
            </div>

            {/* Secure Booking */}
            <div className="pt-6">
              <div className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-800/40 px-5 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur-sm">
                Secure Booking
              </div>
            </div>

          </motion.div>
        </motion.div>

        {/* Right Side (Image and Background Patterns) */}
        <div className="w-full lg:w-1/2 relative hidden lg:block h-[600px] xl:h-[700px] z-10">
          
          {/* Background Dots - Top Left of Right Container */}
          <div className="absolute left-[10%] top-[15%] z-0">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <pattern id="gold-dots" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                <circle cx="2.5" cy="2.5" r="2.5" fill="#D4AF37" />
              </pattern>
              <rect width="60" height="60" fill="url(#gold-dots)" />
            </svg>
          </div>

          {/* Background Crosses - Right Middle */}
          <div className="absolute right-0 top-[50%] z-0 translate-x-1/2">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <pattern id="white-cross" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                <path d="M7.5 2V13M2 7.5H13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              </pattern>
              <rect width="60" height="60" fill="url(#white-cross)" />
            </svg>
          </div>

          {/* The Hero Image component */}
          <div className="absolute inset-0 z-10 pt-10">
            <HeroImage />
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;
