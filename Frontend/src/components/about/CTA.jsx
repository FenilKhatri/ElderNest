import { motion, stagger } from "framer-motion";
import { fadeUp } from "../../animations/motionVariants";
import { NavLink } from "react-router-dom";
import Button from "../common/Button";

const CTA = ({ Title, Description, SubDescription }) => {
  return (
    <>
      <section className="bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-5 py-16">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-4xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-8 md:p-12 shadow-sm"
          >
            <motion.div
              variants={fadeUp}
              className="max-w-2xl mx-auto flex flex-col space-y-6 text-center"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                {Title}
              </p>
              <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                {Description}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-8">
                {SubDescription}
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <NavLink to="/caregivers-login" className="w-full sm:w-fit">
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