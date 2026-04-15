import { motion } from "framer-motion";
import { processSteps } from "../../data/pages/aboutData";
import { fadeUp } from "../../animations/motionVariants";
import TitleAndDescription from "./TitleAndDescription";

const Process = () => {
  return (
    <section className="max-w-7xl mx-auto p-5 md:py-16">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-2xl mx-auto flex flex-col space-y-6"
      >
        <TitleAndDescription
          Description="Seamless Care Process"
          SubDescription="We've streamlined the journey to finding the perfect care with our AI-driven matching system."
          className="text-left md:text-center mx-auto"
        />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative pt-12"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="hidden lg:block absolute left-0 right-0 top-22 h-px bg-linear-to-r from-transparent via-blue-200 to-transparent"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl" />
                  <div className="relative w-20 h-20 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <p className="mt-4 text-xs font-semibold tracking-[0.25em] uppercase text-blue-600">
                  {step.number}
                </p>

                <h3 className="mt-2 font-semibold text-slate-900 dark:text-slate-100">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400 max-w-55">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default Process;
