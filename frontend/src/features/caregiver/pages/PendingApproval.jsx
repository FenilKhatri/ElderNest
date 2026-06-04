import { useEffect } from "react";
import { motion, steps } from "framer-motion";
import { Clock, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { bookingSteps } from "../../../constants/booking/bookingConstants";
import { ACCOUNT_STATUS } from "../../../constants";

const PendingApproval = () => {
  const { user, logout, fetchUser } = useAuth();
  const navigate = useNavigate();

  const checkStatus = async () => {
    await fetchUser();
  };

  useEffect(() => {
    if (user?.status === ACCOUNT_STATUS.REJECTED) {
      navigate("/caregiver/rejected", { replace: true });
      return;
    }
    if (user?.isApproved) {
      navigate("/caregiver/verification", { replace: true });
      return;
    }

    const interval = setInterval(() => {
      fetchUser();
    }, 15000);

    return () => clearInterval(interval);
  }, [user?.status, user?.isApproved, navigate, fetchUser]);

  const handleLogout = async () => {
    await logout();
    navigate("/caregiver/login");
  };

  if (user?.status === ACCOUNT_STATUS.REJECTED) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <motion.div variants={stagger} initial="hidden" animate="show" className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Left Column - Current Status */}
        <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center flex flex-col items-center justify-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-50 to-transparent dark:from-amber-900/10" />
          
          <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-8 border-4 border-white dark:border-slate-900 shadow-lg">
              <Clock className="w-12 h-12 text-amber-600 dark:text-amber-400" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Account Under Review</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg leading-relaxed">
              Welcome back, <span className="font-semibold text-slate-900 dark:text-slate-200">{user?.name}</span>! We are currently reviewing your caregiver application.
            </p>

            <div className="w-full space-y-4 mb-10">
              <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/50">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-500 shrink-0" />
                <span className="text-green-800 dark:text-green-300 font-medium text-left">Registration completed</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-xl" />
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-amber-800 dark:text-amber-300 font-medium text-left">Admin review in progress</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 opacity-70">
                <AlertCircle className="w-6 h-6 text-slate-400 shrink-0" />
                <span className="text-slate-600 dark:text-slate-400 font-medium text-left">Verification pending</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button variant="outline" onClick={handleLogout} className="flex-1 py-3">Sign out</Button>
              <Button onClick={checkStatus} className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white border-transparent">Check status</Button>
            </div>
          </div>
        </motion.div>

        {/* Right Column - What Happens Next Stepper */}
        <motion.div variants={fadeUp} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What Happens Next?</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Your journey to becoming a certified caregiver</p>
            </div>
          </div>

          <div className="relative pl-4 sm:pl-6 space-y-10">
            {/* Continuous Line */}
            <div className="absolute left-[27px] sm:left-[35px] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-700" />

            {bookingSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = step.status === "completed";
              const isCurrent = step.status === "current";
              
              return (
                <div key={index} className="relative flex items-start gap-6">
                  {/* Stepper Node */}
                  <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full shrink-0 shadow-sm transition-colors duration-300 ${
                    isCompleted ? "bg-green-500 text-white ring-4 ring-green-50 dark:ring-green-900/20" :
                    isCurrent ? "bg-blue-600 text-white ring-4 ring-blue-50 dark:ring-blue-900/20 animate-pulse-slow" :
                    "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-2 border-slate-200 dark:border-slate-700"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className={`pt-1.5 transition-opacity duration-300 ${isCurrent ? 'opacity-100' : 'opacity-70'}`}>
                    <h3 className={`text-lg font-bold mb-1 ${
                      isCompleted ? "text-slate-900 dark:text-white" :
                      isCurrent ? "text-blue-600 dark:text-blue-400" :
                      "text-slate-700 dark:text-slate-300"
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                      {step.description}
                    </p>
                    
                    {isCurrent && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg inline-flex items-start gap-2">
                        <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          We will notify you via email as soon as your account status changes.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default PendingApproval;
