import { motion, stagger } from "framer-motion";
import { testimonials } from "../../../data/aboutPage";
import { fadeUp } from "../../../animations/motionVariants";
import { Quote } from "lucide-react";

const Testimonials = ({ Title, Description, SubDescription }) => {
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
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10"
        >
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              <Quote className="w-8 h-8 text-blue-500" />
              <p className="mt-4 text-slate-600 dark:text-slate-400 leading-8">
                {item.review}
              </p>
              <div className="mt-6">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {item.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.role}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
}

export default Testimonials