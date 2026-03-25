import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../ui/Button";
import { ShieldCheck, Clock3, HeartHandshake, ArrowRight } from "lucide-react";
import { slideLeft, stagger } from "../../../animations/motionVariants";
import HeroImage from "./HeroImage";

const HeroSection = () => {
  const badgeStyle =
    "inline-flex items-center rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm";

  const trustLabel =
    "rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm";

  const featureItem =
    "flex items-center gap-2 text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium";

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Right Hero Asset */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] lg:block">
        <HeroImage />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 mx-auto max-w-7xl px-5 py-12 md:py-16 xl:py-20 w-full"
      >
        <motion.div
          variants={slideLeft}
          className="flex max-w-2xl flex-col items-center space-y-8 md:items-start"
        >
          <div className={badgeStyle}>
            <ShieldCheck className="mr-2 h-4 w-4 text-emerald-600" />
            Compassionate in-home care
          </div>

          <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-slate-800 dark:text-white text-left lg:text-6xl">
            Trusted Home{" "}
            <span className="relative inline-block text-emerald-500">
              Healthcare
              <svg
                className="absolute left-0 top-7 mt-1 w-full md:top-15 md:mt-0"
                viewBox="0 0 200 20"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 10 Q100 0 200 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="stroke-3"
                />
              </svg>
            </span>{" "}
            for Your Loved Ones
          </h1>

          <p className="max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400 text-left">
            Connect with verified nurses, caregivers, physiotherapists, and
            elderly care attendants who deliver compassionate and reliable care
            right at home.
          </p>

          <div className="flex w-full flex-col items-center justify-start gap-3 sm:flex-row">
            <NavLink to="/caregivers-login" className="w-full sm:w-fit">
              <Button
                size="lg"
                className="flex w-full items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
              >
                Book Care Now
                <ArrowRight />
              </Button>
            </NavLink>

            <NavLink to="/contact" className="w-full sm:w-fit">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-slate-300 bg-white/70 backdrop-blur dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
              >
                Request Call Back
              </Button>
            </NavLink>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-5">
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

          <div className="flex w-full flex-wrap items-center justify-center gap-3 md:justify-start">
            <p className={trustLabel}>Google Services</p>
            <p className={trustLabel}>Justdial Trusted</p>
            <p className={trustLabel}>Lybrate Listed</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
