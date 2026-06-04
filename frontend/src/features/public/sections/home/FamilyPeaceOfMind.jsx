import { motion } from "framer-motion";
import { MessageSquare, BellRing, ClipboardCheck, Activity, CheckCircle2 } from "lucide-react";
import { fadeUp } from "../../../../animations/motionVariants";

const FamilyPeaceOfMind = () => {
  return (
    <section className="py-24 px-4 bg-[#1c2b36] dark:bg-[#0b1120] relative">
      <div className="w-full max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text Content */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col space-y-6 text-white"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-2 uppercase tracking-wider">
              <span className="w-8 h-px bg-emerald-400"></span>
              Family App
            </div>
            
            <h2 className="text-xl sm:text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight">
              Stay Close, Even When You're Far Away.
            </h2>
            
            <p className="text-sm md:text-lg text-slate-300 mb-6 leading-relaxed max-w-2xl">
              Receive care updates, visit summaries, and important health information directly from caregivers. Our real-time notification system ensures you are always informed about your family's wellbeing.
            </p>

            <div className="flex flex-col gap-5 pt-4">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="text-lg font-medium text-slate-200">Real-time Care Notes & Summaries</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="text-lg font-medium text-slate-200">Direct Caregiver Communication</span>
              </div>
            </div>
          </motion.div>

          {/* Right Communication Visualization (Phone Mockup) */}
          <div className="relative h-[600px] w-full flex items-center justify-center">
            
            {/* Center Phone/Dashboard Mockup */}
            <div className="w-[320px] h-[550px] bg-slate-800 rounded-[2.5rem] shadow-2xl border-[8px] border-slate-700 relative overflow-hidden z-20 flex flex-col">
              
              {/* App Header Mock */}
              <div className="h-24 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 w-full flex items-end px-6 pb-4 shrink-0 shadow-sm z-10">
                <div className="w-full flex justify-between items-center text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900 text-emerald-600 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg">Care Updates</span>
                  </div>
                  <BellRing className="w-5 h-5 text-slate-400" />
                </div>
              </div>

              {/* Chat/Update Area */}
              <div className="p-5 flex flex-col gap-5 relative flex-1 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="w-[90%] bg-white dark:bg-slate-900 p-4 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-emerald-600 flex items-center gap-1"><ClipboardCheck className="w-3 h-3"/> Check-In</p>
                    <span className="text-[10px] text-slate-400 font-medium">10:00 AM</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-300">Caregiver has checked in for the scheduled visit.</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="w-[90%] bg-white dark:bg-slate-900 p-4 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-blue-600 flex items-center gap-1"><Activity className="w-3 h-3"/> Health Update</p>
                    <span className="text-[10px] text-slate-400 font-medium">12:30 PM</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-300">Medication administered as per schedule. Blood pressure is normal.</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.0 }}
                  className="w-[90%] bg-white dark:bg-slate-900 p-4 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-indigo-600 flex items-center gap-1"><ClipboardCheck className="w-3 h-3"/> Care Note</p>
                    <span className="text-[10px] text-slate-400 font-medium">02:00 PM</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-300">Visit completed successfully. Patient is resting comfortably after lunch.</p>
                </motion.div>

              </div>
              
              {/* Fake Home Indicator */}
              <div className="h-5 w-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center pb-0 shrink-0">
                <div className="w-1/3 h-1 bg-slate-400 dark:bg-slate-700 rounded-full" />
              </div>
            </div>

            {/* Background Accent Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

          </div>
        </div>
      </div>
    </section>
  );
};

export default FamilyPeaceOfMind;
