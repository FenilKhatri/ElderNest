import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./Login";
import Register from "./Register";
import UserAuthBackground from "../../sections/auth/UserAuthBackground";
import CaregiverAuthBackground from "../../sections/auth/CaregiverAuthBackground";
import { fadeUp } from "../../../animations/motionVariants";
import H2 from "../../ui/H2";
import CaregiverLogin from "./CaregiverLogin";
import CaregiverRegister from "./CaregiverRegister";

const AuthPage = ({ role = "user" }) => {
  const [isLogin, setIsLogin] = useState(true);

  const isCaregiver = role === "caregiver";

  const LoginComponent = isCaregiver ? CaregiverLogin : Login;
  const RegisterComponent = isCaregiver ? CaregiverRegister : Register;

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      {isCaregiver ? <CaregiverAuthBackground /> : <UserAuthBackground />}

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
                ? `Welcome back ${isCaregiver ? "Caregiver" : ""}`
                : `Create your ${isCaregiver ? "Caregiver" : ""} account`}
            </H2>

            <p className="text-slate-400 text-sm">
              {isCaregiver
                ? isLogin
                  ? "Login to manage your caregiving services."
                  : "Join as a caregiver and offer your services."
                : isLogin
                  ? "Log in to manage your care network and appointments."
                  : "Join ElderNest and get trusted care services."}
            </p>
          </motion.div>

          {/* Toggle */}
          <div className="flex mb-6 bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 rounded-md text-sm font-semibold ${
                isLogin
                  ? "bg-slate-100 text-slate-800 shadow"
                  : "text-slate-500"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 rounded-md text-sm font-semibold ${
                !isLogin
                  ? "bg-slate-100 text-slate-800 shadow"
                  : "text-slate-500"
              }`}
            >
              Signup
            </button>
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div key="login">
                <LoginComponent role={role} />
              </motion.div>
            ) : (
              <motion.div key="register">
                <RegisterComponent role={role} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
