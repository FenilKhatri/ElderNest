import { fadeUp, scaleIn, stagger } from "../../animations/motionVariants";
import { motion } from "framer-motion";
import AboutPagePhoto2 from "../../assets/images/AboutUs/AboutPagePhoto2.png";
import { HeartHandshake, ShieldCheck, Stethoscope } from "lucide-react";

const Mission = ({ Title, Description, SubDescription }) => {
  return (
    <>
      <section
        className="bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur md:p-16"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between p-5 gap-10">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="order-2 md:order-1"
          >
            <img
              src={AboutPagePhoto2}
              alt="Healthcare mission"
              className="w-full max-w-xl rounded-4xl shadow-xl border border-white/40 dark:border-slate-700"
            />
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="order-1 md:order-2 flex flex-col items-center md:items-start space-y-8"
          >
            <motion.p
              variants={fadeUp}
              className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600"
            >
              {Title}
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-2xl lg:text-4xl font-bold text-slate-900 dark:text-white text-center md:text-left leading-tight"
            >
              {Description}
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-slate-600 dark:text-slate-400 text-justify text-base max-w-lg leading-8"
            >
              {SubDescription}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="w-full flex flex-wrap items-center justify-center md:justify-start gap-6"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 h-12 w-12 rounded-2xl flex items-center justify-center shadow-md">
                  <ShieldCheck className="text-white w-5 h-5" />
                </div>
                <p className="text-slate-800 dark:text-slate-100 font-semibold">
                  Safety
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-rose-500 h-12 w-12 rounded-2xl flex items-center justify-center shadow-md">
                  <HeartHandshake className="text-white w-5 h-5" />
                </div>
                <p className="text-slate-800 dark:text-slate-100 font-semibold">
                  Compassion
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-emerald-500 h-12 w-12 rounded-2xl flex items-center justify-center shadow-md">
                  <Stethoscope className="text-white w-5 h-5" />
                </div>
                <p className="text-slate-800 dark:text-slate-100 font-semibold">
                  Professional Care
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Mission;
