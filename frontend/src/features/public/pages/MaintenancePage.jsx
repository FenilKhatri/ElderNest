import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Wrench, Mail, Clock, Home, Sparkles } from "lucide-react";

const MaintenancePage = () => {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 py-16">
      <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-blue-950 to-indigo-950 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/30 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 mb-8"
          >
            <Wrench className="w-12 h-12" />
          </motion.div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Scheduled maintenance
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            We&apos;ll be back soon
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-md mx-auto">
            ElderNest is undergoing planned improvements to serve you better. Thank you for your patience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center mb-8 text-left">
            <div className="flex-1 flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <Clock className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Estimated completion</p>
                <p className="text-sm text-slate-400">Usually within a few hours</p>
              </div>
            </div>
            <div className="flex-1 flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <Mail className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Need help?</p>
                <a href="mailto:fenilkatri931@gmail.com" className="text-sm text-blue-300 hover:underline">
                  fenilkatri931@gmail.com
                </a>
              </div>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors shadow-lg"
          >
            <Home className="w-4 h-4" />
            Return home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default MaintenancePage;
