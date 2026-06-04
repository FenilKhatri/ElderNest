import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Heart, 
  ShieldCheck 
} from "lucide-react";
import Button from "../../../../components/ui/Button";
import HeroImage from "./HeroImage";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[90vh] dark:bg-[#0b1120] flex items-center justify-center overflow-hidden font-sans py-20 lg:py-0 border-b border-slate-800">

      <div className="w-full max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="w-full max-w-8xl flex items-center justify-center">
          
          {/* Left Content Area */}
          <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left justify-center py-10 lg:py-0">
            
            {/* Compassionate Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-slate-700/60 bg-transparent px-4 py-1.5 text-xs font-medium text-emerald-500 mb-8"
            >
              <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-500" />
              Compassionate in-home care
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-[4rem] font-bold leading-[1.1] text-slate-800 dark:text-slate-100 tracking-tight mb-6"
            >
              Book Trusted Caregivers <br className="hidden md:block" />
              Online with <span className="text-[#00d084] relative inline-block whitespace-nowrap">
                ElderNest
                <svg className="absolute w-full h-3 -bottom-2 left-0 text-[#00d084]" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,10 Q25,20 50,10 T100,10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-400 max-w-2xl leading-relaxed mb-10"
            >
              Find and book trusted caregivers, nurses, and patient care services. ElderNest connects you with verified professionals for elder care, home nursing, and 24/7 support at your doorstep.
            </motion.p>

            {/* Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto"
            >
              <NavLink to="/caregivers" className="w-full sm:w-auto">
                <Button>
                  Book Caregiver Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </NavLink>
              <NavLink to="/contact" className="w-full sm:w-auto">
                <Button variant="outline">
                  Talk to Care Expert
                </Button>
              </NavLink>
            </motion.div>

            {/* Feature Highlights Row */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-4 mb-20"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Verified Caregivers
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Clock className="w-4 h-4 text-blue-500" />
                24/7 Care Support
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Heart className="w-4 h-4 text-rose-500" />
                Trusted by Families
              </div>
            </motion.div>

            {/* Bottom Secure Booking Badge */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="inline-flex items-center rounded-lg border border-slate-700/60 bg-transparent px-4 py-2 text-xs font-semibold dark:text-slate-300 mt-auto"
            >
              Secure Booking
            </motion.div>

          </div>
          
          {/* Right Image Area */}
          <div className="hidden lg:flex items-center justify-center relative w-full h-full">
            <HeroImage />
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;
