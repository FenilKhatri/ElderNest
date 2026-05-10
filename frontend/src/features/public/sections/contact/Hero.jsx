import { motion } from "framer-motion";
import TitleAndDescription from "../../../../components/ui/TitleAndDescription";
import { fadeUp } from "../../../../animations/motionVariants";

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
        <TitleAndDescription
          Description={Title}
          SubDescription={Description}
          className="text-left md:text-center mx-auto"
        />
      </motion.section>
    </>
  );
};

export default Hero;
