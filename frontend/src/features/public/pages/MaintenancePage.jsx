import { motion } from "framer-motion";
import { Clock, HeartPulse, RefreshCcw, Mail, ArrowRight } from "lucide-react";
import Button from "../../../components/ui/Button";

const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-400/10 dark:bg-teal-900/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 dark:bg-blue-900/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        
        {/* Left Content Area */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 max-w-2xl text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-medium text-sm mb-8 shadow-sm">
            <RefreshCcw className="w-4 h-4 animate-spin-slow" />
            System Update in Progress
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight">
            Nurturing our <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">Platform</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
            We are currently upgrading ElderNest to provide an even safer, faster, and more reliable experience for our elders and caregivers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button 
              variant="primary" 
              size="lg" 
              className="gap-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-teal-600 dark:hover:bg-teal-500 rounded-full px-8 shadow-xl shadow-slate-900/20 dark:shadow-teal-900/20"
              onClick={() => window.location.reload()}
            >
              Refresh Page <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Right Status Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex-1 w-full max-w-md lg:max-w-lg"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 mb-8 mx-auto lg:mx-0 shadow-inner">
              <HeartPulse className="w-8 h-8 animate-pulse" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center lg:text-left">
              Maintenance Details
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-center lg:text-left mb-8">
              Our engineering team is actively working on the updates.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-200">Expected Downtime</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Usually resolved within 1-2 hours. All services will resume automatically.
                  </p>
                </div>
              </div>

              <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

              <div className="flex items-start gap-4">
                <div className="mt-1 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg text-amber-600 dark:text-amber-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-200">Urgent Assistance</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    For emergencies, reach out to our support at <a href="mailto:fenilkatri931@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">fenilkatri931@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default MaintenancePage;
