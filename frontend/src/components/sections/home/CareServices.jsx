import { motion } from "framer-motion";
import { fadeUp } from "../../../animations/motionVariants";
import { services } from "../../../data/homePage";
import CareServiceCard from "../../cards/CareServiceCard";
import TitleAndDescription from "../../ui/TitleAndDescription";

const CareServices = () => {
  return (
    <div className="max-w-7xl mx-auto flex items-center justify-center flex-col space-y-5 md:space-y-15 p-5">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-2xl mx-auto flex flex-col space-y-6"
      >
        <TitleAndDescription
          Description="Comprehensive Care Services"
          SubDescription="Tailored healthcare solutions delivered right to your doorstep, managed through our intelligent platform."
          className="text-left md:text-center mx-auto"
        />
      </motion.div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {services?.map((service, index) => (
          <CareServiceCard
            key={index}
            Icon={service.icon}
            Title={service.Title}
            Description={service.Description}
          />
        ))}
      </div>
    </div>
  );
};

export default CareServices;
