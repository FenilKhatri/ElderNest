import { motion } from "framer-motion";
import { fadeUp, scaleIn, stagger } from "../../../animations/motionVariants";
import { visionItems } from "../../../data/aboutPage";
import TitleAndDescription from "../../ui/TitleAndDescription";

const Vision = ({ Title, Description, SubDescription }) => {
  const visionCardClass =
    "group flex flex-col items-center gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 min-w-[140px]";

  return (
    <>
      <section className="max-w-7xl mx-auto px-5 py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-4xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur p-6 md:p-10 flex flex-col space-y-10"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 text-center"
          >
            {Title}
          </motion.p>

          <TitleAndDescription
            Description={Description}
            SubDescription={SubDescription}
            className="mx-auto"
          />

          <motion.div
            variants={stagger}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {visionItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  className={visionCardClass}
                >
                  <Icon
                    className={`w-16 h-16 p-4 rounded-full ${item.iconClass}`}
                  />
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    {item.title}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default Vision;
