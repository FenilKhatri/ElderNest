import { motion, stagger } from "framer-motion";
import { testimonials } from "../../../data/aboutPage";
import { fadeUp } from "../../../animations/motionVariants";
import { Quote } from "lucide-react";
import TitleText from "../../ui/TitleText";
import TitleAndDescription from "../../ui/TitleAndDescription";

const Testimonials = ({ Title, Description, SubDescription }) => {
  return (
    <>
      <section className="max-w-7xl mx-auto px-5 py-10 md:py-16">
        <div className="max-w-2xl mx-auto flex flex-col space-y-6 text-center">
          <TitleText children={Title} className="text-left md:text-center" />
          <TitleAndDescription
            Description={Description}
            SubDescription={SubDescription}
            className="text-left md:text-center mx-auto"
          />
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
};

export default Testimonials;
