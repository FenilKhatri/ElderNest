import { motion } from "framer-motion";
import { fadeUp } from "../../animations/motionVariants";

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-md mb-6">
          {description}
        </p>
      )}
      {action}
    </motion.div>
  );
};

export default EmptyState;
