import { motion } from "framer-motion";
import { XCircle, Mail, RefreshCw, ArrowLeft } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";

const RejectedAccount = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/caregiver/login");
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:fenilkatri931@gmail.com?subject=Account Rejection Appeal";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="w-full max-w-2xl"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center">
          {/* Icon */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6"
          >
            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </motion.div>

          {/* Content */}
          <motion.div variants={fadeUp} className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Application Not Approved
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              We're sorry, {user?.name}. Your caregiver application could not be approved at this time.
            </p>
          </motion.div>

          {/* Reason */}
          <motion.div variants={fadeUp} className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-3">
              Reason for rejection:
            </h3>
            <p className="text-sm text-red-800 dark:text-red-200">
              {user?.adminFeedback || "Your application did not meet our current requirements. Please contact support for more details."}
            </p>
          </motion.div>

          {/* Next Steps */}
          <motion.div variants={fadeUp} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <RefreshCw className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  What you can do:
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Contact our support team for specific feedback</li>
                  <li>• Address any issues and reapply in the future</li>
                  <li>• Ensure all information is accurate and complete</li>
                  <li>• Obtain additional certifications if needed</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
            <Button
              onClick={handleContactSupport}
              className="px-6"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </motion.div>

          {/* Contact */}
          <motion.div variants={fadeUp} className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              We're here to help. Reach out to us at{" "}
              <a
                href="mailto:fenilkatri931@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                fenilkatri931@gmail.com
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RejectedAccount;