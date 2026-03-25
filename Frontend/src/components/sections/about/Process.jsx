import { motion, stagger } from "framer-motion";
import { processSteps, stats } from "../../../data/aboutPage";
import { fadeUp, scaleIn } from "../../../animations/motionVariants";
import StatSkeleton from "../../feedback/skeleton/StatSkeleton";

const Process = ({ loading, Title, Description, SubDescription }) => {
  return (
    <>
      <section className="max-w-7xl mx-auto px-5 py-16">
        <div className="max-w-2xl mx-auto flex flex-col space-y-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            {Title}
          </p>
          <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            {Description}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-8">
            {SubDescription}
          </p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative pt-12"
        >
          <div className="hidden lg:block absolute left-0 right-0 top-22 h-px bg-linear-to-r from-transparent via-blue-200 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
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

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 pt-14"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <StatSkeleton key={index} />
              ))
            : stats.map((item, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  className="flex items-center justify-center flex-col gap-5 rounded-2xl border border-blue-400/20 bg-blue-500 py-10 px-5 shadow-lg shadow-blue-500/20 hover:-translate-y-1 transition duration-300"
                >
                  <p className="text-3xl font-bold text-white tracking-tight">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm text-blue-100 leading-6">
                    {item.label}
                  </p>
                </motion.div>
              ))}
        </motion.div>
      </section>
    </>
  );
}

export default Process