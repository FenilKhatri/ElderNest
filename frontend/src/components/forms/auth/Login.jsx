import { useState } from "react";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../../animations/motionVariants";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {/* Email */}
      <motion.div variants={fadeUp}>
        <Input
          label="email"
          labelName="Email"
          icon={Mail}
          type="email"
          placeholder="Enter your email..."
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
      </motion.div>

      {/* Password */}
      <motion.div variants={fadeUp}>
        <Input
          label="password"
          labelName="Password"
          icon={Lock}
          type="password"
          placeholder="Enter your password..."
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
      </motion.div>

      {/* Button */}
      <motion.div variants={fadeUp}>
        <Button className="w-full hover:opacity-90">
          Login →
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default Login;
