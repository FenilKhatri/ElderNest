import { z } from "zod";

const emailRegex = /^[A-Za-z0-9.+_-]+@[A-Za-z0-9.+_-]+\.[A-Za-z]{2,}$/;
const phoneRegex = /^[6-9]\d{9}$/;
const passwordRegex =
  /^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(){}[\].+\-]).{6,}$/;

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .regex(emailRegex, "Invalid email format")
    .min(1, "Email is required"),
  phone: z
    .string({ required_error: "Phone is required" })
    .regex(phoneRegex, "Invalid Indian phone number")
    .min(10, "Phone is required")
    .max(10, "Phone must be 10 chars long"),
  password: z
    .string({ required_error: "Password is required" })
    .regex(passwordRegex, "Weak credentials")
    .min(1, "Password is required")
    .min(6, "Password must be 6 characters long"),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .regex(emailRegex, "Invalid email format")
    .min(1, "Email is required"),
  password: z
    .string({ required_error: "Password is required" })
    .regex(passwordRegex, "Weak credentials")
    .min(1, "Password is required"),
});
