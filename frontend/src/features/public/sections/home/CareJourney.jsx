import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../../../animations/motionVariants";

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description: "Sign up securely to start your care journey. Add details about your loved one's specific needs, medical history, and preferences to help us find the perfect match."
  },
  {
    number: "02",
    title: "Find the Right Caregiver",
    description: "Browse our network of verified professionals or let our care coordination team match you with a caregiver based on specialized skills and personality compatibility."
  },
  {
    number: "03",
    title: "Book & Begin Care",
    description: "Schedule visits effortlessly. Use our secure platform to manage bookings, track care notes in real-time, and ensure your loved one receives dignified care."
  }
];

const CareJourney = () => {
  return (
    <section className="py-24 px-4 bg-[#F8F7F4] dark:bg-[#0b1120] relative border-t border-slate-200 dark:border-slate-800">
      <div className="w-full max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-4 uppercase tracking-wider">
            <span className="w-8 h-px bg-emerald-600 dark:bg-emerald-400"></span>
            Process
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#1c2b36] dark:text-white leading-[1.1] max-w-3xl tracking-tight">
            Your Care Journey, <br className="hidden md:block" />
            Step by Step.
          </h2>
        </motion.div>

        {/* Staircase Layout */}
        <motion.div 
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="relative w-full max-w-5xl mx-auto flex flex-col gap-16 md:gap-24"
        >
          {steps.map((step, index) => {
            // Determine alignment for staircase effect
            let alignClass = "md:items-start md:text-left md:pr-[50%]"; // Step 1: Left
            if (index === 1) alignClass = "md:items-center md:text-center md:px-[25%]"; // Step 2: Center
            if (index === 2) alignClass = "md:items-end md:text-right md:pl-[50%]"; // Step 3: Right

            return (
              <motion.div 
                key={index}
                variants={fadeUp}
                className={`flex flex-col w-full ${alignClass}`}
              >
                <div className="flex items-center justify-start md:justify-center gap-3">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-200 dark:text-slate-800/50 leading-none mb-4 tracking-tighter">
                  {step.number}
                </div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1c2b36] dark:text-white mb-4">
                  {step.title}
                </h3>
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
        
      </div>
    </section>
  );
};

export default CareJourney;
