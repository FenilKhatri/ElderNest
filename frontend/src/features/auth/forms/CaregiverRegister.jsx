import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import FormFields from "../../../components/ui/FormFields";
import GoogleAuthButton from "../../../components/ui/GoogleAuthButton";
import { ROLES } from "../../../utils/constants";
import { registerCaregiver } from "../api/auth.api";
import { caregiverRegisterFields } from "./data/inputFields";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { handleAuthSubmit } from "../../../utils/auth/handleAuthSubmit";
import { handleChange } from "../../../utils/auth/handleChange";

const CaregiverRegister = () => {
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
      apiCall: registerCaregiver,
      form,
      navigate,
      setLoading,
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
      className="space-y-4"
    >
      <FormFields
        fields={caregiverRegisterFields}
        form={form}
        onChange={(e) => handleChange(e, setForm)}
      />

      <motion.div variants={fadeUp} whileTap={{ scale: 0.97 }}>
        <Button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
          }`}
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
        <GoogleAuthButton role={ROLES.CAREGIVER} />
      </motion.div>
    </motion.form>
  );
};

export default CaregiverRegister;
