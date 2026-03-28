import { Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full flex flex-col items-center animate-[fadeIn_0.4s_ease-out]">
      {/* Premium Icon Container with soft glow */}
      <div className="relative flex items-center justify-center w-16 h-16 mb-8 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 shadow-sm ring-1 ring-inset ring-indigo-500/20 dark:ring-indigo-500/30">
        <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl dark:bg-indigo-500/20"></div>
        <LockKeyhole />
      </div>

      {/* Headings */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Welcome back
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Please enter your details to sign in.
        </p>
      </div>

      {/* Form Fields */}
      <form className="w-full flex flex-col gap-5">
        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              type="email"
              placeholder="Enter your email"
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
              <svg
                className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0B1120] focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 text-sm outline-none transition duration-300  placeholder:text-slate-400"
              />
              {/* Toggle Password Visibility */}
              <div
                className="cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </div>
            </div>
          </div>
        </div>

        {/* Primary Button */}
        <button
          type="submit"
          className="w-full py-3.5 mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 outline-none focus:ring-4 focus:ring-indigo-500/20"
        >
          Sign In
        </button>
      </form>

      {/* Footer */}
      <p className="mt-8 text-slate-500 dark:text-slate-400 text-sm font-medium">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
        >
          Sign up for free
        </Link>
      </p>
    </div>
  );
};

export default Login;
