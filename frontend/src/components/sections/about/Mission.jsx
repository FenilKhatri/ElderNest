import { fadeUp, scaleIn, stagger } from "../../../animations/motionVariants";
import { motion } from "framer-motion";
import MissionImg from "../../../assets/images/aboutus/mission.png";
import TitleAndDescription from "../../ui/TitleAndDescription";
import { missionData } from "../../../data/pages/aboutData";

const Mission = ({ Title, Description, SubDescription }) => {
  return (
    <>
      <section className="bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur md:p-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between p-5 gap-10">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="order-2 md:order-1"
          >
            <img
              src={MissionImg}
              alt="Healthcare mission"
              height="full"
              width="full"
              loading="lazy"
              decoding="async"
              className="w-full max-w-xl rounded-4xl shadow-xl border border-white/40 dark:border-slate-700"
            />
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="order-1 md:order-2 flex flex-col items-start space-y-8"
          >
            <motion.p
              variants={fadeUp}
              className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600"
            >
              {Title}
            </motion.p>

            <TitleAndDescription
              Description={Description}
              SubDescription={SubDescription}
              className="text-justify"
            />

            <motion.div
              variants={fadeUp}
              className="w-full flex flex-wrap gap-6"
            >
              {missionData?.map((data, index) => {
                const Icon = data?.icon;
                return (
                  <div className="flex items-center gap-3" key={index}>
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-md ${data.Theme}`}
                    >
                      <Icon className="text-white w-5 h-5" />
                    </div>
                    <p className="text-slate-800 dark:text-slate-100 font-semibold">
                      {data?.Title}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Mission;
