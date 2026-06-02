// Caregiver Gender Options
export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

// Languages spoken by caregivers
export const LANGUAGES = [
  "English",
  "Hindi",
  "Marathi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Urdu",
];

// Available Timing options for caregiver schedule
export const AVAILABLE_TIMINGS = [
  { value: "morning", label: "Morning (6 AM - 12 PM)" },
  { value: "afternoon", label: "Afternoon (12 PM - 6 PM)" },
  { value: "evening", label: "Evening (6 PM - 10 PM)" },
  { value: "night", label: "Night (10 PM - 6 AM)" },
  { value: "full-day", label: "Full Day (24 Hours)" },
  { value: "flexible", label: "Flexible" },
];

// Days of Week
export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Caregiver profile steps for multi-step form
export const COMPLETE_PROFILE_STEPS = [
  { id: 1, title: "Personal Information", fields: ["fullName", "email", "contactNumber", "alternateContact", "gender", "age"] },
  { id: 2, title: "Experience & Bio", fields: ["experienceYears", "bio"] },
  { id: 3, title: "Services & Skills", fields: ["servicesOffered", "languages"] },
  { id: 4, title: "Location", fields: ["location.state", "location.city", "location.pincode", "location.fullAddress"] },
  { id: 5, title: "Availability & Pricing", fields: ["availableTiming", "pricing.hourlyRate", "pricing.dailyRate", "pricing.monthlyRate"] },
];

// Caregiver pricing rate fields
export const PRICING_RATE_FIELDS = [
  { key: "hourlyRate", label: "Hourly Rate (₹)" },
  { key: "dailyRate", label: "Daily Rate (₹)" },
  { key: "monthlyRate", label: "Monthly Rate (₹)" },
];

// Caregiver stage unlock permissions
export const CAREGIVER_STAGE_UNLOCK = {
  pending_account: ["/caregiver/profile", "/caregiver/settings", "/caregiver/notifications"],
  account_approved: ["/caregiver/profile", "/caregiver/settings", "/caregiver/verification", "/caregiver/notifications"],
  verification_pending: ["/caregiver/profile", "/caregiver/settings", "/caregiver/verification", "/caregiver/notifications"],
  verification_changes: ["/caregiver/profile", "/caregiver/settings", "/caregiver/verification", "/caregiver/notifications"],
  active: ["*"],
  rejected: ["/caregiver/rejected", "/caregiver/settings", "/caregiver/notifications"],
};
