import { motion } from "framer-motion";
import { Construction } from "lucide-react";
import { fadeUp } from "../../animations/motionVariants";

/**
 * Reusable placeholder for pages that are not yet implemented.
 * Replaces the dozens of <div>PageName</div> stubs that crash due to
 * missing content and make debugging harder.
 */
const PagePlaceholder = ({ title = "Coming Soon", description }) => {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6">
        <Construction className="w-8 h-8 text-blue-500 dark:text-blue-400" />
      </div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h2>

      <p className="text-slate-500 dark:text-slate-400 max-w-md">
        {description || "This page is under construction and will be available soon."}
      </p>
    </motion.div>
  );
};

export default PagePlaceholder;
