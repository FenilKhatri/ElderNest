import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import Button from "../../ui/Button";
import AboutPagePhoto1 from "../../../assets/images/AboutUs/AboutPagePhoto1.jpeg";
import { fadeUp, scaleIn, slideRight, stagger } from "../../../animations/motionVariants";

const Hero = ({ Slogan, Title, Description }) => {
  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="max-w-7xl mx-auto px-5 py-10 md:py-16"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center md:items-start space-y-8 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-900 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 py-2 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {Slogan}
            </span>
          </div>

          <h1 className="max-w-2xl text-3xl lg:text-6xl font-bold text-slate-900 dark:text-white text-center md:text-left leading-tight tracking-tight">
            {Title}
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl text-center md:text-left leading-8">
            {Description}
          </p>

          <div className="w-full flex flex-col sm:flex-row items-center justify-start gap-3">
            <NavLink to="/caregivers-login" className="w-full sm:w-fit">
              <Button size="lg" className="w-full shadow-lg shadow-blue-500/20">
                Book Care Service
              </Button>
            </NavLink>

            <NavLink to="/contact" className="w-full sm:w-fit">
              <Button
                variant="outline"
                size="lg"
                className="w-full bg-white/70 dark:bg-slate-900/60 backdrop-blur border-slate-300 dark:border-slate-700 dark:text-white"
              >
                Talk To Our Experts
              </Button>
            </NavLink>
          </div>
        </motion.div>

        <motion.div variants={slideRight} className="relative">
          <div className="absolute inset-0 rounded-4xl bg-linear-to-tr from-blue-500/20 to-cyan-400/20 blur-2xl" />
          <img
            src={AboutPagePhoto1}
            variants={scaleIn}
            initial="hidden"
            whileInView="show"
            alt="Healthcare service"
            className="relative w-full max-w-xl rounded-4xl shadow-2xl border border-white/40 dark:border-slate-800"
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
