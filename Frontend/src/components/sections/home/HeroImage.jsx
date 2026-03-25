import { User } from "lucide-react";
import HeroBg from "../../..//assets/images/Home/HeroBG.png";
import { motion } from "framer-motion";
import { fadeUp, slideRight } from "../../../animations/motionVariants";

const doctors = [
  {
    name: "Dr. Sarah Lee",
    role: "Cardiologist",
    position: "top-20 left-40",
    iconBg: "bg-emerald-500/20",
    iconText: "text-emerald-400",
  },
  {
    name: "Dr. John Smith",
    role: "General Physician",
    position: "top-56 left-16",
    iconBg: "bg-cyan-500/20",
    iconText: "text-cyan-400",
  },
  {
    name: "Dr. Emily Watson",
    role: "Neurologist",
    position: "top-[27rem] left-16",
    iconBg: "bg-violet-500/20",
    iconText: "text-violet-400",
  },
  {
    name: "Dr. Michael Ray",
    role: "Pediatrician",
    position: "top-[38rem] left-40",
    iconBg: "bg-blue-500/20",
    iconText: "text-blue-400",
  },
];

const HeroImage = () => {
  return (
    <motion.div
      variants={fadeUp}
      className="relative hidden lg:block w-full min-h-190"
    >
      {doctors.map((doctor, index) => (
        <motion.div
          key={doctor.name}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
          className={`absolute ${doctor.position} rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl`}
        >
          <div className="flex items-center gap-3 p-4">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${doctor.iconBg} ${doctor.iconText}`}
            >
              <User size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                {doctor.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                {doctor.role}
              </p>
            </div>
          </div>
        </motion.div>
      ))}

      <div className="relative w-full">
        <motion.div variants={fadeUp}>
          <motion.img
            src={HeroBg}
            variants={slideRight}
            initial="hidden"
            animate="show"
            alt="Nurse holding heart"
            className="absolute right-0 top-0 w-full max-w-150 object-contain"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroImage;
