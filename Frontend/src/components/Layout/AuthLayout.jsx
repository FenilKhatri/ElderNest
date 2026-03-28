import { Outlet, useNavigate, useLocation } from "react-router-dom";
import LoginBG from "../sections/login/LoginBG";

const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-[#0B1120]">
      {/* Left Side: Background Component */}
      {/* We apply 'hidden md:flex' inside LoginBG itself or wrap it here. 
          Assuming LoginBG handles its own width, but let's be safe: */}
      <div className="hidden md:flex md:w-1/2">
        <LoginBG />
      </div>

      {/* Right Side: Form Container */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 relative overflow-hidden">
        {/* Subtle SaaS Background Glow */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md flex flex-col items-center relative z-10">
          {/* 📱 Mobile-Only Branding */}
          {/* This ensures mobile users still know what app they are logging into! */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Smart Care.
            </h1>
            <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold mt-1">
              Trusted Hands.
            </p>
          </div>

          {/* Premium Segmented Toggle Switch */}
          <div className="flex w-full bg-slate-200/60 dark:bg-[#0F172A] p-1.5 rounded-2xl mb-8 md:mb-10 border border-slate-200 dark:border-slate-800/80 backdrop-blur-sm">
            <button
              onClick={() => navigate("/login")}
              className={`w-1/2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ease-out ${
                isLogin
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className={`w-1/2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ease-out ${
                !isLogin
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Injected Form Component (Login or Register) */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
