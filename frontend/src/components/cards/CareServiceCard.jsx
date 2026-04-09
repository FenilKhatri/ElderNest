import { motion } from "framer-motion";
import { fadeUp } from "../../animations/motionVariants";

const CareServiceCard = ({ Icon, Title, Description }) => {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="group rounded-xl border-t border-white/10 bg-slate-500/10 p-5 backdrop-blur-2xl transition duration-300 hover:scale-105 hover:border-blue-500"
    >
      <div className="inline-flex rounded-xl bg-blue-600 dark:bg-slate-400/30 p-3">
        {Icon && <Icon size={22} className="text-slate-100" />}
      </div>
      <p className="mt-4 font-semibold text-slate-800 dark:text-white">{Title}</p>
      <p className="text-slate-400">{Description}</p>
    </motion.div>
  );
};

export default CareServiceCard;
