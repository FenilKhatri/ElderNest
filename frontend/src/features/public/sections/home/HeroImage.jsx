import HeroBg from "../../../../assets/images/home/herobg.avif";
import { motion } from "framer-motion";
import { fadeUp, slideRight } from "../../../../animations/motionVariants";

const HeroImage = () => (
  <motion.div variants={fadeUp} className="relative hidden lg:flex justify-end items-end w-full">
    <motion.img
      src={HeroBg}
      variants={slideRight}
      initial="hidden"
      animate="show"
      alt="Professional caregiver support"
      fetchPriority="high"
      className="w-full max-w-[500px] xl:max-w-[650px] object-contain drop-shadow-2xl"
    />
  </motion.div>
);

export default HeroImage;
