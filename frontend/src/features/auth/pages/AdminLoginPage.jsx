import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import Button from "../../../components/ui/Button";
import FormFields from "../../../components/ui/FormFields";
import GoogleAuthButton from "../../../components/ui/GoogleAuthButton";
import { ROLES } from "@/constants";
import { useAuth } from "../../../context/AuthContext";
import { loginAdmin } from "../api/auth.api";
import { loginFields } from "../forms/data/inputFields";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { handleChange } from "../../../utils/auth/handleChange";
import { handleAuthSubmit } from "../../../utils/auth/handleAuthSubmit";

const AdminLoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleAuthSubmit({
      apiCall: loginAdmin,
      form,
      navigate,
      setLoading,
      fetchUser,
      allowedRole: [ROLES.ADMIN],
      successMessage: "Welcome back, Admin",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8"
      >
        <motion.div variants={fadeUp} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600 text-white mb-4">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Login</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Sign in to manage ElderNest
          </p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} variants={stagger} className="space-y-5">
          <FormFields
            fields={loginFields}
            form={form}
            onChange={(e) => handleChange(e, setForm)}
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-sm text-slate-500">OR</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          <GoogleAuthButton role={ROLES.ADMIN} allowedRoles={[ROLES.ADMIN]} />
        </motion.form>

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link to="/" className="text-blue-600 hover:underline">
            Back to website
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
