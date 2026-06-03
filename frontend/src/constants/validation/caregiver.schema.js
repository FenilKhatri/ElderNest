import { z } from "zod";

export const caregiverSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  contactNumber: z.string().regex(/^[0-9]{10}$/, "10-digit number required"),
  alternateContact: z.string().optional(),
  gender: z.enum(["male", "female", "other"]),
  age: z.coerce.number().min(18, "Must be at least 18"),
  experienceYears: z.coerce.number().min(0),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  servicesOffered: z.array(z.string()).min(1, "Select at least one service"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  location: z.object({
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    pincode: z.string().regex(/^[0-9]{6}$/, "6-digit pin required"),
    fullAddress: z.string().min(10, "Full address required"),
  }),
  pricing: z.object({
    hourlyRate: z.coerce.number().min(50, "Minimum ₹50/hr"),
    dailyRate: z.coerce.number().min(500, "Minimum ₹500/day"),
    monthlyRate: z.coerce.number().min(10000, "Minimum ₹10000/month"),
  }),
});
