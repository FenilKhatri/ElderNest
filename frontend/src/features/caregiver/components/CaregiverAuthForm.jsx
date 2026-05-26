import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import { loginCaregiver, registerCaregiver } from "../../auth/api/auth.api";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import GoogleAuthButton from "../../../components/ui/GoogleAuthButton";
import FormFields from "../../../components/ui/FormFields";
import { ROLES } from "../../../utils/constants";
import { handleAuthSubmit } from "../../../utils/auth/handleAuthSubmit";
import { handleChange } from "../../../utils/auth/handleChange";
import { loginFields, caregiverRegisterFields } from "../../auth/forms/data/inputFields";

const CaregiverAuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await handleAuthSubmit({
      apiCall: loginCaregiver,
      form: loginForm,
      navigate,
      setLoading,
      fetchUser,
      successMessage: "Login Successful",
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    await handleAuthSubmit({
      apiCall: registerCaregiver,
      form: registerForm,
      navigate,
      setLoading,
      successMessage: "Registered successfully!",
      validate: () => {
        if (registerForm.password !== registerForm.confirmPassword) {
          return "Passwords do not match";
        }
        return null;
      },
    });
  };

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {isLogin ? "Welcome Back" : "Join ElderNest"}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {isLogin
                ? "Sign in to your caregiver account"
                : "Create your caregiver account"}
            </p>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <FormFields
              fields={isLogin ? loginFields : caregiverRegisterFields}
              form={isLogin ? loginForm : registerForm}
              onChange={(e) =>
                isLogin
                  ? handleChange(e, setLoginForm)
                  : handleChange(e, setRegisterForm)
              }
            />

            <motion.div variants={fadeUp} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                disabled={loading}
                className={`w-full py-3 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {loading
                  ? isLogin ? "Signing in..." : "Creating account..."
                  : isLogin ? "Sign In →" : "Create Account →"}
              </Button>
            </motion.div>
          </motion.form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
            <span className="px-4 text-sm text-slate-500 dark:text-slate-400">or</span>
            <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
          </div>

          {/* Google Auth */}
          <GoogleAuthButton role={ROLES.CAREGIVER} />

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CaregiverAuthForm;