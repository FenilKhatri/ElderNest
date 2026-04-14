import { useState } from "react";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { Eye, EyeOff, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import { toast } from "react-toastify";
import { register } from "../../../api/authapi";
import { useNavigate } from "react-router-dom";
import { fields } from "../../../data/inputFields";

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      toast.success(data?.message || "Register successfully!");
      navigate("/auth");

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
      className="space-y-4"
    >
      {/* Name, Emial, Phone */}
      {fields?.map((field) => {
        const Icon = field?.icon;

        return (
          <Input
            label={field?.label}
            labelName={field?.labelName}
            icon={Icon}
            type={field?.type}
            placeholder={field?.placeholder}
            id={field?.id}
            name={field?.name}
            value={form[field?.name]}
            onChange={handleChange}
          />
        );
      })}

      {/* Password */}
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
            id={field.name}
            name={field.name}
            value={form[field.name]}
            onChange={handleChange}
          />

          <button
            type="button"
            onClick={field.toggle}
            className="absolute right-3 top-10 text-slate-500"
          >
            {field.show ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </motion.div>
      ))}

      {/* Button */}
      <motion.div variants={fadeUp} whileTap={{ scale: 0.97 }}>
        <Button
          type="submit"
          className={`w-full hover:opacity-90 ${
            loading ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          {loading ? "Signing up..." : "Sign Up →"}
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default Register;