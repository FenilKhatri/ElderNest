import { useState } from "react";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import { toast } from "react-toastify";
import { login } from "../../../api/authapi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import GoogleAuthButton from "../../ui/GoogleAuthButton";
import { getRedirectByRole } from "../../../utils/roleRedirect";
import { ROLES } from "../../../utils/constants";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await login(form);

      await fetchUser();
      
      navigate(getRedirectByRole(res?.user?.role));
      toast.success(res?.message || "Login Successful");
    } catch (error) {
      toast.error(error?.message || "Failed to login!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      {/* Email */}
      <motion.div variants={fadeUp}>
        <Input
          label="email"
          labelName="Email"
          icon={Mail}
          type="email"
          placeholder="Enter your email..."
          name="email"
          value={form.email}
          onChange={handleChange}
        />
      </motion.div>

      {/* Password */}
      <motion.div variants={fadeUp} className="relative">
        <Input
          label="password"
          labelName="Password"
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password..."
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-10 text-slate-500 hover:text-slate-700"
        >
          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </motion.div>

      {/* Login Button */}
      <motion.div variants={fadeUp}>
        <Button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {loading ? "Logging in..." : "Login →"}
        </Button>
      </motion.div>

      {/* Divider */}
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        <span className="text-sm text-slate-500">OR</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      </motion.div>

      {/* Google Login */}
      <motion.div variants={fadeUp}>
        <GoogleAuthButton role={ROLES?.USER} />
      </motion.div>
    </motion.form>
  );
};

export default Login;
