import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { KeyRound, ArrowLeft } from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { forgotPassword } from "../api/auth.api";
import { fadeUp, stagger } from "../../../animations/motionVariants";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const recaptchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const captchaToken = recaptchaRef.current?.getValue();
    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(email, captchaToken);
      toast.success(res.message || "Reset link sent successfully");
      setIsSuccess(true);
    } catch (error) {
      toast.error(error.message || "Failed to send reset link");
      recaptchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

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
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot Password?</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </motion.div>

        {!isSuccess ? (
          <motion.form onSubmit={handleSubmit} variants={stagger} className="space-y-5">
            <motion.div variants={fadeUp}>
              <Input
                labelName="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </motion.div>

            <motion.div variants={fadeUp} className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                theme="light" // Could be dynamic based on user theme, but light is safe
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </motion.div>
          </motion.form>
        ) : (
          <motion.div variants={fadeUp} className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl mb-6 border border-green-100 dark:border-green-800">
            <p className="text-green-700 dark:text-green-400 text-sm font-medium">
              We've sent a password reset link to <br/><strong>{email}</strong>
            </p>
            <p className="text-green-600/80 dark:text-green-500/80 text-xs mt-2">
              Please check your inbox and spam folder. The link will expire in 30 minutes.
            </p>
          </motion.div>
        )}

        <motion.div variants={fadeUp} className="text-center mt-6">
          <Link
            to="/auth"
            className="inline-flex items-center justify-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
