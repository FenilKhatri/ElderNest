import { fadeUp, stagger } from "../../../animations/motionVariants";
import { motion } from "framer-motion";
import CardSkeleton from "../../feedback/skeleton/CardSkeleton";
import { cardData } from "../../../data/aboutPage";
import TitleText from "../../ui/TitleText";
import TitleAndDescription from "../../ui/TitleAndDescription";
import Descriptiontext from "../../ui/DescriptionText";

const WhyChooseUs = ({ loading, Title, Description, SubDescription }) => {
  return (
    <section className="max-w-7xl mx-auto px-5 py-0 md:py-8">
      <div className="max-w-2xl mx-auto flex flex-col space-y-6 text-center">
        <TitleText children={Title} className="text-left md:text-center"/>
        <TitleAndDescription
          Description={Description}
          SubDescription={SubDescription}
          className="text-justify md:text-center mx-auto"
        />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-10 items-stretch"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          : cardData.map((card, index) => {
              const Icon = card.icon;

              return (
                <motion.div key={index} variants={fadeUp} className="h-full">
                  <div className="group relative h-full min-h-60 overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition duration-300">
                    <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500 via-cyan-400 to-indigo-500 scale-x-0 group-hover:scale-x-100 origin-left transition duration-300" />

                    <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 transition duration-300 group-hover:bg-indigo-500 group-hover:text-slate-100 dark:group-hover:bg-white dark:group-hover:text-blue-600">
                      <Icon size={22} />
                    </div>

                    <h4 className="mt-5 text-lg font-bold text-slate-900 dark:text-slate-100">
                      {card.name}
                    </h4>

                    <Descriptiontext className="mt-3">
                      {card.description}
                    </Descriptiontext>
                  </div>
                </motion.div>
              );
            })}
      </motion.div>
    </section>
  );
};

export default WhyChooseUs;
