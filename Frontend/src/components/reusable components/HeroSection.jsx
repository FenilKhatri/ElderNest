import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import HeroBg from "../../assets/images/Other/HeroBG.png";
import Button from "../common/Button";
import { ShieldCheck, Clock3, HeartHandshake, ArrowRight } from "lucide-react";
import { fadeUp, scaleIn, slideLeft, slideRight, stagger } from "../../animations/motionVariants";

const HeroSection = () => {
  const badgeStyle =
    "inline-flex items-center rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm";

  const trustLabel =
    "rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm";

  const featureItem =
    "flex items-center gap-2 text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium";

  return (
    <section className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto px-5 py-10 md:py-16"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Hero Left */}
          <motion.div
            variants={slideLeft}
            className="flex flex-col items-center md:items-start space-y-8 max-w-3xl"
          >
            {/* Top Badge */}
            <div className={badgeStyle}>
              <ShieldCheck className="w-4 h-4 text-blue-600 mr-2" />
              Compassionate in-home care
            </div>

            {/* Heading */}
            <h1 className="text-3xl lg:text-6xl text-center md:text-left font-bold text-slate-900 dark:text-white max-w-2xl leading-tight tracking-tight">
              Trusted Home Healthcare for Your Loved Ones
            </h1>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl text-center md:text-left leading-8">
              Connect with verified nurses, caregivers, physiotherapists, and
              elderly care attendants who deliver compassionate and reliable
              care right at home.
            </p>

            {/* CTA Buttons */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-start gap-3">
              <NavLink to="/caregivers-login" className="w-full sm:w-fit">
                <Button
                  size="lg"
                  className="w-full flex items-center justify-center gap-5 shadow-lg shadow-blue-500/20"
                >
                  Book Care Now
                  <ArrowRight />
                </Button>
              </NavLink>

              <NavLink to="/contact" className="w-full sm:w-fit">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full bg-white/70 dark:bg-slate-900/60 backdrop-blur border-slate-300 dark:border-slate-700 dark:text-white"
                >
                  Request Call Back
                </Button>
              </NavLink>
            </div>

            {/* Trust Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5">
              <div className={featureItem}>
                <ShieldCheck size={18} className="text-emerald-500" />
                <span>Verified caregivers</span>
              </div>

              <div className={featureItem}>
                <Clock3 size={18} className="text-blue-500" />
                <span>24/7 support</span>
              </div>

              <div className={featureItem}>
                <HeartHandshake size={18} className="text-teal-500" />
                <span>Trusted by families</span>
              </div>
            </div>

            {/* Partner / Listing Labels */}
            <div className="w-full flex flex-wrap items-center justify-center md:justify-start gap-3">
              <p className={trustLabel}>Google Services</p>
              <p className={trustLabel}>Justdial Trusted</p>
              <p className={trustLabel}>Lybrate Listed</p>
            </div>
          </motion.div>

          {/* Hero Right */}
          <motion.div variants={scaleIn}>
            <img
              src={HeroBg}
              alt="Home healthcare hero"
              className="h-120 w-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;