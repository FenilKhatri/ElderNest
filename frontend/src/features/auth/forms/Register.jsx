import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import FormFields from "../../../components/ui/FormFields";
import GoogleAuthButton from "../../../components/ui/GoogleAuthButton";
import { ROLES } from "@/constants";
import { getRedirectByRole } from "../../../utils/auth/roleRedirect";
import { register } from "../../auth/api/auth.api";
import { registerFields } from "./data/inputFields";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { handleChange } from "../../../utils/auth/handleChange";
import { handleAuthSubmit } from "../../../utils/auth/handleAuthSubmit";
import { useAuth } from "../../../context/AuthContext";

const Register = ({ role = ROLES.USER }) => {
  const { fetchUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await handleAuthSubmit({
      apiCall: register,
      form,
      navigate,
      setLoading,
      fetchUser,
      successMessage: "Registered successfully!",
      validate: () => {
        if (form.password !== form.confirmPassword) {
          return "Passwords do not match";
        }

        return null;
      },
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
        fields={registerFields}
        form={form}
        onChange={(e) => handleChange(e, setForm)}
      />

      <motion.div variants={fadeUp}>
        <Button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {loading ? "Signing up..." : "Sign Up →"}
        </Button>
      </motion.div>

      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        <span className="text-sm text-slate-500">OR</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      </motion.div>

      <motion.div variants={fadeUp}>
        <GoogleAuthButton role={role} />
      </motion.div>
    </motion.form>
  );
};

export default Register;
