import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { validateResetToken, resetPassword } from "../api/auth.api";
import { fadeUp, stagger } from "../../../animations/motionVariants";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Validate token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        setValidating(false);
        return;
      }
      try {
        await validateResetToken(token);
        setTokenValid(true);
      } catch (error) {
        setTokenValid(false);
        toast.error(error.message || "Invalid or expired reset link.");
      } finally {
        setValidating(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain at least one lowercase letter.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      toast.error("Password must contain at least one number.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await resetPassword(token, password);
      toast.success(res.message || "Password reset successfully!");
      // Redirect to login
      setTimeout(() => navigate("/auth"), 2000);
    } catch (error) {
      toast.error(error.message || "Failed to reset password.");
    } finally {
      setSubmitting(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-6">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Invalid Link</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <Button onClick={() => navigate("/forgot-password")} className="w-full">
            Request New Link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8"
      >
        <motion.div variants={fadeUp} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Password</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Your new password must be different from previous used passwords.
          </p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} variants={stagger} className="space-y-5">
          <motion.div variants={fadeUp} className="space-y-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              New Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>

          {/* Optional: Password strength checklist here */}
          
          <motion.div variants={fadeUp}>
            <Button type="submit" disabled={submitting} className="w-full mt-2">
              {submitting ? "Resetting..." : "Reset Password"}
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
