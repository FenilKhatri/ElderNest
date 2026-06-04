import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  HeartHandshake, 
  Activity, 
  Users 
} from "lucide-react";
import { fadeUp, stagger } from "../../../../animations/motionVariants";

const features = [
  { icon: ShieldCheck, title: "Verified Professionals", description: "Every caregiver undergoes rigorous background checks, medical certification verification, and in-person interviews." },
  { icon: HeartHandshake, title: "Dedicated Support", description: "Our care coordination team is available 24/7 to adjust your care plan, answer questions, and provide immediate assistance." },
  { icon: Activity, title: "Real-time Updates", description: "Stay connected to your loved one's care with daily digital notes, medication tracking, and instant alerts." },
  { icon: Users, title: "Family-first Approach", description: "We believe in treating every patient as our own family, delivering care with dignity, respect, and unmatched compassion." },
];

const HealthcareEcosystem = () => {
  return (
    <section className="py-24 px-4 bg-[#F8F7F4] dark:bg-[#0b1120] relative border-b border-slate-200 dark:border-slate-800">
      <div className="w-full max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Heading */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col max-w-lg sticky top-32"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-6 uppercase tracking-wider">
              <span className="w-8 h-px bg-emerald-600 dark:bg-emerald-400"></span>
              Trusted Care
            </div>
            
            <h2 className="text-xl md:text-5xl lg:text-6xl font-bold text-[#1c2b36] dark:text-white leading-[1.1] mb-8 tracking-tight">
              Professional Support For The People Who Matter Most.
            </h2>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              ElderNest connects you with trusted, certified professionals dedicated to improving the quality of life right at home. We bring hospital-grade reliability with the warmth of a family member.
            </p>
          </motion.div>

          {/* Right Column: Features List */}
          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col gap-10 lg:gap-14"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  className="flex gap-6 group"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col pt-1">
                    <h3 className="text-xl font-bold text-[#1c2b36] dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HealthcareEcosystem;
