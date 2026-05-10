import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Input from "./Input";
import { fadeUp } from "../../animations/motionVariants";

const FormFields = ({ fields, form, onChange }) => {
  const [showMap, setShowMap] = useState({});

  const toggleShow = (name) => {
    setShowMap((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      {fields.map((field) => {
        const Icon = field.icon;
        const isVisible = showMap[field.name];

        return (
          <motion.div key={field.name} variants={fadeUp}>
            <Input
              label={field.label}
              labelName={field.labelName}
              icon={Icon}
              type={
                field.isPassword
                  ? isVisible
                    ? "text"
                    : "password"
                  : field.type
              }
              placeholder={field.placeholder}
              id={field.id}
              name={field.name}
              value={form[field.name] ?? ""}
              onChange={onChange}
              rightElement={
                field.isPassword ? (
                  <button
                    type="button"
                    onClick={() => toggleShow(field.name)}
                    className="cursor-pointer"
                  >
                    {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                ) : null
              }
            />
          </motion.div>
        );
      })}
    </>
  );
};

export default FormFields;
