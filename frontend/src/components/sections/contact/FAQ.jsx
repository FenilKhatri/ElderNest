import { ChevronDownCircle, ChevronUpCircle } from "lucide-react";
import { faqs } from "../../../data/pages/faqData";
import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
} from "../../../animations/motionVariants";
import TitleAndDescription from "../../ui/TitleAndDescription";

const FAQ = () => {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="max-w-4xl mx-auto px-5 py-10"
    >
      {/* Heading */}
      <motion.div
        variants={itemVariants}
        className="text-center space-y-3 mb-8"
      >
        <p className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700 dark:bg-cyan-900/30 dark:text-cyan-300">
          FAQ
        </p>

        <TitleAndDescription
          Description="Frequently Asked Questions"
          SubDescription="Find answers to common questions about ElderNest care services, response time, caregiver support, and service availability."
          className="text-left md:text-center mx-auto"
        />
      </motion.div>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div key={index} variants={itemVariants}>
            <details className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 open:shadow-md dark:border-slate-800 dark:bg-slate-950">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="text-left text-base md:text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {faq.question}
                </span>

                <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-600 transition duration-300 dark:text-slate-300">
                  <span className="absolute text-lg transition duration-300 group-open:rotate-180 group-open:opacity-0">
                    <ChevronDownCircle />
                  </span>
                  <span className="absolute text-lg opacity-0 transition duration-300 group-open:opacity-100">
                    <ChevronUpCircle />
                  </span>
                </span>
              </summary>

              <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                <p className="leading-7 text-slate-600 dark:text-slate-400">
                  {faq.answer}
                </p>
              </div>
            </details>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default FAQ;
