import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../animations/motionVariants";
import { serviceItems } from "../../data/aboutPage";
import { HeartHandshake } from "lucide-react";

const Services = ({ Title, Description, SubDescription }) => {
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
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-10"
        >
          {serviceItems.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={fadeUp}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {service.name}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </>
  );
};

export default Services;
