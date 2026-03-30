import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, User, Mail, Lock, Eye, EyeOff, Phone } from "lucide-react";
import Input from "../../ui/InputField";
import Button from "../../ui/Button";
import TitleAndDescription from "../../ui/TitleAndDescription";
import { motion } from "framer-motion";
import { slideRight } from "../../../animations/motionVariants";
import { toast } from "react-toastify";
import { registerUser } from "../../../api/authApi";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleData = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (password !== confirmPassword) {
      setErrors({
        confirmPassword: "Passwords do not match",
      });
      confirmPasswordRef.current?.focus();
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const data = await registerUser({
        name,
        email,
        phone,
        password,
        role: "user",
      });

      toast.success(data?.message || "Registered successfully!");

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});

      navigate("/", { replace: true });
    } catch (error) {
      const msg = error?.message || "Failed to register!";
      toast.error(msg);

      const lowerMsg = msg.toLowerCase();
      let newErrors = {};

      if (lowerMsg.includes("name")) {
        newErrors.name = msg;
        nameRef.current?.focus();
      } else if (lowerMsg.includes("email")) {
        newErrors.email = msg;
        emailRef.current?.focus();
      } else if (lowerMsg.includes("phone")) {
        newErrors.phone = msg;
        phoneRef.current?.focus();
      } else if (lowerMsg.includes("password")) {
        newErrors.password = msg;
        passwordRef.current?.focus();
      } else if (lowerMsg.includes("all fields")) {
        newErrors = {
          name: msg,
          email: msg,
          phone: msg,
          password: msg,
        };
        nameRef.current?.focus();
      }

      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={slideRight}
      initial="hidden"
      animate="show"
      viewport={{ once: true, amount: 0.2 }}
      className="w-full flex flex-col items-center animate-[fadeIn_0.4s_ease-out]"
    >
      {/* Icon */}
      <div className="relative flex items-center justify-center w-16 h-16 mb-8 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 shadow-sm ring-1 ring-inset ring-indigo-500/20 dark:ring-indigo-500/30">
        <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl dark:bg-indigo-500/20"></div>
        <UserPlus className="relative w-7 h-7 text-indigo-600 dark:text-indigo-400" />
      </div>

      {/* Heading */}
      <div className="text-center mb-8">
        <TitleAndDescription
          Description="Create an account"
          SubDescription="Sign up to start your care journey today."
          className="space-y-2"
        />
      </div>

      {/* Form */}
      <form className="w-full flex flex-col gap-5" onSubmit={handleData}>
        <Input
          label="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
          placeholder="Enter your name..."
          icon={<User size={16} />}
          ref={nameRef}
          error={errors.name}
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
          placeholder="Enter your email..."
          icon={<Mail size={16} />}
          ref={emailRef}
          error={errors.email}
        />

        <Input
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setErrors((prev) => ({ ...prev, phone: "" }));
          }}
          placeholder="Enter your phone..."
          icon={<Phone size={16} />}
          ref={phoneRef}
          error={errors.phone}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
          placeholder="•••••"
          icon={<Lock size={16} />}
          rightIcon={showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          onRightIcon={() => setShowPassword(!showPassword)}
          ref={passwordRef}
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrors((prev) => ({ ...prev, confirmPassword: "" }));
          }}
          placeholder="•••••"
          icon={<Lock size={16} />}
          rightIcon={
            showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />
          }
          onRightIcon={() => setShowConfirmPassword(!showConfirmPassword)}
          ref={confirmPasswordRef}
          error={errors.confirmPassword}
        />

        <Button
          children={loading ? "Signing Up..." : "Sign Up"}
          className="py-3 rounded-xl"
          disabled={loading}
        />
      </form>

      {/* Footer */}
      <p className="mt-8 text-slate-500 dark:text-slate-400 text-sm font-medium">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
};

export default Register;
