import { features } from "../../../data/pages/homeData";
import TitleAndDescription from "../../ui/TitleAndDescription";
import { motion } from "framer-motion";
import { fadeUp, stagger, itemVariants } from "../../../animations/motionVariants";

const WhyChooseUs = () => {
  return (
    <section className="py-14 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <TitleAndDescription
            Description="Why Choose ElderNest?"
            SubDescription="Trusted elder care services at home across Gujarat..."
          />
        </motion.div>

        {/* Cards */}
        <motion.div
          className="mt-10 grid gap-6 md:grid-cols-3"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features?.map((item, index) => {
            const Icon = item?.icon;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="group relative h-full min-h-60 overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-6 shadow-sm hover:shadow-2xl transition duration-300"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500 via-cyan-400 to-indigo-500 scale-x-0 group-hover:scale-x-100 origin-left transition duration-300" />

                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto ${item?.theme}`}
                >
                  <Icon />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-white">
                  {item?.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-6">
                  {item?.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
