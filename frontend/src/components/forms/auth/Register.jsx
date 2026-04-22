import { useState } from "react";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { Eye, EyeOff, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import { toast } from "react-toastify";
import { register } from "../../../api/authapi";
import { useNavigate } from "react-router-dom";
import { fields } from "../../../data/forms/inputFields";
import GoogleAuthButton from "../../ui/GoogleAuthButton";
import { ROLES } from "../../../utils/constants";
import { getRedirectByRole } from "../../../utils/roleRedirect";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const data = await register(form);

      navigate(getRedirectByRole(data?.user?.role));
      toast.success(data?.message || "Registered successfully!");
    } catch (error) {
      toast.error(error?.message || "Failed to Register!");
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
      {/* Basic Fields */}
      {fields?.map((field) => {
        const Icon = field.icon;

        return (
          <motion.div key={field.name} variants={fadeUp}>
            <Input
              label={field.label}
              labelName={field.labelName}
              icon={Icon}
              type={field.type}
              placeholder={field.placeholder}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
            />
          </motion.div>
        );
      })}

      {/* Password Fields */}
      {[
        {
          name: "password",
          label: "Password",
          show: showPassword,
          toggle: () => setShowPassword(!showPassword),
        },
        {
          name: "confirmPassword",
          label: "Confirm Password",
          show: showConfirmPassword,
          toggle: () => setShowConfirmPassword(!showConfirmPassword),
        },
      ].map((field) => (
        <motion.div key={field.name} variants={fadeUp} className="relative">
          <Input
            label={field.name}
            labelName={field.label}
            icon={Lock}
            type={field.show ? "text" : "password"}
            placeholder={`Enter your ${field.label.toLowerCase()}...`}
            name={field.name}
            value={form[field.name]}
            onChange={handleChange}
          />

          <button
            type="button"
            onClick={field.toggle}
            className="absolute right-3 top-10 text-slate-500 hover:text-slate-700"
          >
            {field.show ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </motion.div>
      ))}

      {/* Register Button */}
      <motion.div variants={fadeUp}>
        <Button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {loading ? "Signing up..." : "Sign Up →"}
        </Button>
      </motion.div>

      {/* Divider */}
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        <span className="text-sm text-slate-500">OR</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      </motion.div>

      {/* Google Signup */}
      <motion.div variants={fadeUp}>
        <GoogleAuthButton role={ROLES?.USER} />
      </motion.div>
    </motion.form>
  );
};

export default Register;
