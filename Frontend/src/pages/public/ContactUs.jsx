import { motion } from "framer-motion";
import Hero from "../../components/contact/Hero";
import { slideLeft, slideRight, stagger } from "../../animations/motionVariants";
import Form from "../../components/contact/Form";
import FormBG from "../../components/contact/FormBG";
import GetInTouch from "../../components/contact/GetInTouch";
import FAQ from "../../components/contact/FAQ";

const ContactUs = () => {
  return (
    <>
      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <Hero
          Title="We're Here to Help Your Family"
          Description="Have questions about our home healthcare services? Our care coordinators are available 24/7
                        to discuss your specific needs and find the right caregiver for your loved ones."
        />
        {/* Form */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch justify-center gap-0 md:gap-5 p-5"
        >
          <motion.div variants={slideLeft}>
            <div className="flex flex-col items-start justify-between gap-5">
              <GetInTouch />
              <FormBG />
            </div>
          </motion.div>
          <motion.div variants={slideRight}>
            <Form />
          </motion.div>
        </motion.div>
        {/* FAQ */}
        <FAQ />
      </div>
    </>
  );
};

export default ContactUs;
