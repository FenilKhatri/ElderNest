import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../../components/ui/Button";
import TitleText from "../../../components/ui/TitleText";
import TitleAndDescription from "../../../components/ui/TitleAndDescription";
import { fadeUp, stagger } from "../../../animations/motionVariants";

const CTA = ({ Title, Description, SubDescription }) => {
  return (
    <>
      <section className="bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur">
        <div className="max-w-site-wide mx-auto px-5 py-16">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-4xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-8 md:p-12 shadow-sm"
          >
            <motion.div
              variants={fadeUp}
              className="w-full max-w-4xl mx-auto flex flex-col space-y-6 text-center"
            >
              <TitleText children={Title} />
              <TitleAndDescription
                Description={Description}
                SubDescription={SubDescription}
                className="mx-auto"
              />
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <NavLink to="/caregivers" className="w-full sm:w-fit">
                <Button className="w-full sm:w-auto px-7 py-4 shadow-lg shadow-blue-500/20">
                  Book a Caregiver
                </Button>
              </NavLink>

              <NavLink to="/contact" className="w-full sm:w-fit">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-7 py-4 dark:text-slate-100"
                >
                  Request a Call Back
                </Button>
              </NavLink>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default CTA