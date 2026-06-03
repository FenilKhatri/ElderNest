import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import FormFields from "../../../components/ui/FormFields";
import GoogleAuthButton from "../../../components/ui/GoogleAuthButton";
import { ROLES } from "@/constants";
import { useAuth } from "../../../context/AuthContext";
import { login } from "../../auth/api/auth.api";
import { loginFields } from "./data/inputFields";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { handleChange } from "../../../utils/auth/handleChange";
import { handleAuthSubmit } from "../../../utils/auth/handleAuthSubmit";

const Login = ({ role = ROLES.USER }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  // Determine allowed roles based on the role prop
  const getAllowedRoles = () => {
    if (role === ROLES.ADMIN) {
      return [ROLES.ADMIN];
    }
    return [ROLES.USER];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await handleAuthSubmit({
      apiCall: login,
      form,
      navigate,
      setLoading,
      fetchUser,
      allowedRole: getAllowedRoles(),
      successMessage: "Login Successful",
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      <FormFields
        fields={loginFields}
        form={form}
        onChange={(e) => handleChange(e, setForm)}
      />

      <motion.div variants={fadeUp}>
        <Button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
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
        <GoogleAuthButton role={role} allowedRoles={getAllowedRoles()} />
      </motion.div>
    </motion.form>
  );
};

export default Login;
