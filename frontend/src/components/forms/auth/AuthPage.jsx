import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./Login";
import Register from "./Register";
import UserAuthBackground from "../../sections/auth/UserAuthBackground";
import { fadeUp } from "../../../animations/motionVariants";
import H2 from "../../ui/H2";
import { useLocation } from "react-router-dom";
import CaregiverLogin from "./CaregiverLogin";
import CaregiverRegister from "./CaregiverRegister";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const location = useLocation();
  const isCaregiverRoute = location.pathname.includes("caregiver");

  const LoginComponent = isCaregiverRoute ? CaregiverLogin : Login;
  const RegisterComponent = isCaregiverRoute ? CaregiverRegister : Register;

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <UserAuthBackground />

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center dark:bg-linear-to-br from-slate-900 to-slate-800 p-6">
        <div className="w-full max-w-md text-white">
          {/* Heading */}
          <motion.div
            key={isLogin ? "login-title" : "register-title"}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mb-6"
          >
            <H2 className="text-2xl font-bold text-slate-900">
              {isLogin
                ? `Welcome back ${isCaregiverRoute ? "Caregiver" : ""}`
                : `Create your ${isCaregiverRoute ? "Caregiver" : ""} account`}
            </H2>

            <p className="text-slate-400 text-sm">
              {isCaregiverRoute
                ? isLogin
                  ? "Login to manage your caregiving services."
                  : "Join as a caregiver and offer your services."
                : isLogin
                  ? "Log in to manage your care network and appointments."
                  : "Join ElderNest and get trusted care services."}
            </p>
          </motion.div>

          {/* Toggle Buttons */}
          <div className="flex mb-6 bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 rounded-md text-sm font-semibold transition ${
                isLogin
                  ? "bg-slate-100 text-slate-800 shadow"
                  : "text-slate-500"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 rounded-md text-sm font-semibold transition ${
                !isLogin
                  ? "bg-slate-100 text-slate-800 shadow"
                  : "text-slate-500"
              }`}
            >
              Signup
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <LoginComponent />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
              >
                <RegisterComponent />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
