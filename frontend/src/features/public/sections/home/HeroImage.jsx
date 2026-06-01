import HeroBg from "../../../../assets/images/home/herobg.avif";
import { motion } from "framer-motion";
import { fadeUp, slideRight } from "../../../../animations/motionVariants";

const HeroImage = () => (
  <motion.div variants={fadeUp} className="relative hidden lg:block w-full min-h-190">
    <div className="relative w-full">
      <motion.div variants={fadeUp}>
        <motion.img
          src={HeroBg}
          variants={slideRight}
          initial="hidden"
          animate="show"
          alt="Professional caregiver support"
          fetchPriority="high"
          className="absolute right-0 top-0 w-full max-w-150 object-contain"
        />
      </motion.div>
    </div>
  </motion.div>
);

export default HeroImage;
