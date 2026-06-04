import { motion } from "framer-motion";
import { fadeUp } from "../../../../animations/motionVariants";
import { Wallet, ShieldAlert, CreditCard, Banknote } from "lucide-react";

const RefundProcess = () => {
  return (
    <section className="py-24 px-4 bg-white dark:bg-[#0b1120] border-t border-slate-200 dark:border-slate-800">
      <div className="w-full max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-4 uppercase tracking-wider">
            <span className="w-8 h-px bg-emerald-600 dark:bg-emerald-400"></span>
            Financial Trust
            <span className="w-8 h-px bg-emerald-600 dark:bg-emerald-400"></span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1c2b36] dark:text-white leading-[1.1] mb-6 tracking-tight">
            Transparent & Fair Partnership
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            We value your trust above all else. Our automated refund and wallet system ensures that if your care plan changes or a caregiver cannot make it, your funds are secured and returned seamlessly.
          </p>
        </motion.div>

        {/* Horizontal Flow Steps */}
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 relative"
        >
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-px bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-full h-full bg-emerald-500 origin-left"
            />
          </div>

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center text-center bg-white dark:bg-[#0b1120] p-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center mb-4 shadow-sm">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-[#1c2b36] dark:text-white mb-2">Service Rejected</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px]">Caregiver unavailable or plan changed.</p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center text-center bg-white dark:bg-[#0b1120] p-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center mb-4 shadow-sm">
              <CreditCard className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-[#1c2b36] dark:text-white mb-2">Automated Request</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px]">System generates an instant refund request.</p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center text-center bg-white dark:bg-[#0b1120] p-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 shadow-sm">
              <Wallet className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-[#1c2b36] dark:text-white mb-2">Wallet Credit</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px]">Funds instantly securely credited to wallet.</p>
          </div>

          {/* Step 4 */}
          <div className="relative z-10 flex flex-col items-center text-center bg-white dark:bg-[#0b1120] p-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center mb-4 shadow-sm">
              <Banknote className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-[#1c2b36] dark:text-white mb-2">Next Booking</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px]">Use wallet balance for future care needs.</p>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default RefundProcess;
