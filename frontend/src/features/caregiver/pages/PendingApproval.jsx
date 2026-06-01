import { useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Mail, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";

const PendingApproval = () => {
  const { user, logout, fetchUser } = useAuth();
  const navigate = useNavigate();

  const checkStatus = async () => {
    await fetchUser();
  };

  useEffect(() => {
    if (user?.status === "rejected") {
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

  if (user?.status === "rejected") {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <motion.div variants={stagger} initial="hidden" animate="show" className="w-full max-w-2xl">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center">
          <motion.div variants={fadeUp} className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
            <Clock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Account pending approval</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Welcome {user?.name}! Your caregiver account is under admin review.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-green-800 dark:text-green-300 font-medium">Registration completed</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <Clock className="w-6 h-6 text-amber-600" />
              <span className="text-amber-800 dark:text-amber-300 font-medium">Admin review in progress</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <AlertCircle className="w-6 h-6 text-slate-400" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Verification after approval</span>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-start gap-3">
              <Mail className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Admin reviews your registration</li>
                  <li>• You receive a notification when approved or if changes are needed</li>
                  <li>• After approval, complete document verification</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={handleLogout}>Sign out</Button>
            <Button onClick={checkStatus}>Check status</Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PendingApproval;
