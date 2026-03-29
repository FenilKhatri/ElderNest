import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, User, Mail, Lock, Eye, EyeOff, Phone } from "lucide-react";
import Input from "../../ui/InputField";
import Button from "../../ui/Button";
import TitleAndDescription from "../../ui/TitleAndDescription";
import { motion } from "framer-motion";
import { slideRight } from "../../../animations/motionVariants";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <motion.div
      variants={slideRight}
      initial="hidden"
      animate="show"
      viewport={{ once: true, amount: 0.2 }}
      className="w-full flex flex-col items-center animate-[fadeIn_0.4s_ease-out]">
      {/* Premium Icon Container with soft glow */}
      <div className="relative flex items-center justify-center w-16 h-16 mb-8 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 shadow-sm ring-1 ring-inset ring-indigo-500/20 dark:ring-indigo-500/30">
        <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl dark:bg-indigo-500/20"></div>
        <UserPlus className="relative w-7 h-7 text-indigo-600 dark:text-indigo-400" />
      </div>

      {/* Headings */}
      <div className="text-center mb-8">
        <TitleAndDescription
          Description="Create an account"
          SubDescription="Sign up to start your care journey today."
          className="space-y-2"
        />
      </div>

      {/* Form Fields */}
      <form className="w-full flex flex-col gap-5">
        {/* Full Name Input */}
        <div className="space-y-1.5">
          <Input
            label="Name"
            placeholder="Enter your name..."
            icon={<User size={16} />}
          />
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email..."
            icon={<Mail size={16} />}
          />
        </div>

        {/* Phone Input */}
        <div className="space-y-1.5">
          <Input
            label="Phone"
            type="tel"
            placeholder="Enter your phone..."
            icon={<Phone size={16} />}
          />
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <Input
            label="Password"
            type="password"
            placeholder="•••••"
            icon={<Lock size={16} />}
          />
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-1.5">
          <Input
            label="Confirm Password"
            type="password"
            placeholder="•••••"
            icon={<Lock size={16} />}
          />
        </div>

        {/* Primary Button */}
        <Button children="Sign Up" className="py-3 rounded-xl" />
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
