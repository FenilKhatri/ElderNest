import { motion, stagger } from "framer-motion";
import { cardData } from "../../../data/aboutPage";
import { fadeUp } from "../../../animations/motionVariants";
import TitleText from "../../ui/TitleText";
import TitleAndDescription from "../../ui/TitleAndDescription";

const Professionals = ({ Title, Description, SubDescription }) => {
  return (
    <>
      <section className="bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-5 py-16">
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
            {cardData.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-slate-600 dark:text-slate-400 leading-7">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default Professionals