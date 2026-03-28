import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full flex flex-col items-center animate-[fadeIn_0.4s_ease-out]">
      {/* Premium Icon Container with soft glow */}
      <div className="relative flex items-center justify-center w-16 h-16 mb-8 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 shadow-sm ring-1 ring-inset ring-indigo-500/20 dark:ring-indigo-500/30">
        <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl dark:bg-indigo-500/20"></div>
        <UserPlus className="relative w-7 h-7 text-indigo-600 dark:text-indigo-400" />
      </div>

      {/* Headings */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Create an account
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Sign up to start your care journey today.
        </p>
      </div>

      {/* Form Fields */}
      <form className="w-full flex flex-col gap-5">
        {/* Full Name Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Full Name
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Sarah Williams"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#0B1120] focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="email"
              placeholder="sarah@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#0B1120] focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#0B1120] focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 placeholder:text-slate-400"
            />
            {/* Toggle Password Visibility */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {showPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Confirm Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#0B1120] focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 placeholder:text-slate-400"
            />
            {/* Toggle Password Visibility */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {showConfirmPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Terms and Privacy Checkbox */}
        <div className="flex items-center mt-1">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 rounded border border-slate-300 dark:border-slate-700 group-hover:border-indigo-500 transition-colors bg-white dark:bg-[#0F172A] shrink-0">
              <input type="checkbox" className="peer sr-only" />
              <svg
                className="w-3.5 h-3.5 text-indigo-600 opacity-0 peer-checked:opacity-100 transition-opacity"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              I agree to the{" "}
              <a
                href="#"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                <Link to="/terms-of-services">Terms of Service</Link>
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                <Link to="/privacy-policy">Privacy Policy</Link>
              </a>
              .
            </span>
          </label>
        </div>

        {/* Primary Button */}
        <button
          type="submit"
          className="w-full py-3.5 mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 outline-none focus:ring-4 focus:ring-indigo-500/20"
        >
          Create Account
        </button>
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
    </div>
  );
};

export default Register;
