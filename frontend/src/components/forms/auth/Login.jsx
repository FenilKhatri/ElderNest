import { useState } from "react";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import { toast } from "react-toastify";
import { login } from "../../../api/authapi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await login(form);

      setForm({
        email: "",
        password: "",
      });
      const data = res?.data;
      toast.success(data?.message || "Login Successful");
      navigate("/");
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
      className="space-y-4"
    >
      {/* Email */}
      <motion.div variants={fadeUp}>
        <Input
          label="email"
          labelName="Email"
          icon={Mail}
          type="email"
          placeholder="Enter your email..."
          id="email"
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
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        {/* Eye Icon */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-10 text-slate-500"
        >
          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </motion.div>

      {/* Button */}
      <motion.div variants={fadeUp}>
        <Button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading
              ? "cursor-not-allowed opacity-60"
              : "hover:opacity-90 cursor-pointer"
          }`}
        >
          {loading ? "Logging in..." : "Login →"}
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default Login;
