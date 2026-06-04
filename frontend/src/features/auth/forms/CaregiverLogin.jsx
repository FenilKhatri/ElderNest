import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import FormFields from "../../../components/ui/FormFields";
import GoogleAuthButton from "../../../components/ui/GoogleAuthButton";
import { ROLES } from "@/constants";
import { useAuth } from "../../../context/AuthContext";
import { loginFields } from "./data/inputFields";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { handleAuthSubmit } from "../../../utils/auth/handleAuthSubmit";
import { handleChange } from "../../../utils/auth/handleChange";
import { loginCaregiver } from "../api/auth.api";

const CaregiverLogin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchUser } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();

    await handleAuthSubmit({
      apiCall: loginCaregiver,
      form,
      navigate,
      setLoading,
      fetchUser,
      successMessage: "Login Successful",
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      <div className="space-y-1">
        <FormFields
          fields={loginFields}
          form={form}
          onChange={(e) => handleChange(e, setForm)}
        />
        <div className="flex justify-end pt-1">
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      <motion.div variants={fadeUp} whileTap={{ scale: 0.97 }}>
        <Button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
          }`}
        >
          {loading ? "Logging in..." : "Login →"}
        </Button>
      </motion.div>

      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        <span className="text-sm text-slate-500">OR</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      </motion.div>

      <motion.div variants={fadeUp}>
        <GoogleAuthButton role={ROLES.CAREGIVER} />
      </motion.div>
    </motion.form>
  );
};

export default CaregiverLogin;
