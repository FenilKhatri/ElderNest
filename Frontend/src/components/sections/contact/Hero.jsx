import { motion } from "framer-motion";
import { fadeUp } from "../../animations/motionVariants";

const Hero = ({ Title, Description }) => {
  return (
    <>
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-col items-center justify-center space-y-5 px-5 py-10 md:py-16"
      >
        <h2 className="text-2xl lg:text-5xl font-bold text-slate-900 dark:text-white text-center leading-tight tracking-tight">
          {Title}
        </h2>

        <p className="max-w-3xl text-slate-600 dark:text-slate-400 text-lg text-center leading-8">
          {Description}
        </p>
      </motion.section>
    </>
  );
};

export default Hero;
