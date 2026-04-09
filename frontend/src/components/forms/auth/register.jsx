import { useState } from "react";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { Lock, Mail, Phone, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../../animations/motionVariants";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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
      {/* Name */}
      <motion.div variants={fadeUp}>
        <Input
          label="name"
          labelName="Name"
          icon={UserCircle}
          placeholder="Enter your name..."
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </motion.div>

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

      {/* Phone */}
      <motion.div variants={fadeUp}>
        <Input
          label="phone"
          labelName="Phone"
          icon={Phone}
          type="tel"
          placeholder="Enter your phone..."
          id="phone"
          name="phone"
          value={form.phone}
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

      {/* Confirm Password */}
      <motion.div variants={fadeUp}>
        <Input
          label="confirmPassword"
          labelName="Confirm Password"
          icon={Lock}
          type="password"
          placeholder="Reenter password..."
          id="confirmPassword"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
        />
      </motion.div>

      {/* Button */}
      <motion.div variants={fadeUp} whileTap={{ scale: 0.97 }}>
        <Button className="w-full hover:opacity-90">
          Sign Up →
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default Register;