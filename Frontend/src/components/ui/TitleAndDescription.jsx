import { motion } from "framer-motion";
import Descriptiontext from "./DescriptionText";
import H2 from "./H2";
import { fadeUp } from "../../animations/motionVariants";

const TitleAndDescription = ({
  Description,
  SubDescription,
  className = "w-full text-center items-center",
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <motion.div variants={fadeUp}>
        <H2>{Description}</H2>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Descriptiontext center={true}>{SubDescription}</Descriptiontext>
      </motion.div>
    </div>
  );
};

export default TitleAndDescription;
