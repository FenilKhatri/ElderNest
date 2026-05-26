// User Roles
export const ROLES = {
  USER: "user",
  CAREGIVER: "caregiver",
  ADMIN: "admin",
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Caregiver Status
export const CAREGIVER_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

// Profile Approval Status
export const PROFILE_APPROVAL_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CHANGES_REQUIRED: "changes-required",
};

// Service Categories
export const SERVICE_CATEGORIES = {
  PERSONAL_CARE: "personal-care",
  MEDICAL_CARE: "medical-care",
  COMPANIONSHIP: "companionship",
  HOUSEHOLD_HELP: "household-help",
  SPECIALIZED_CARE: "specialized-care",
  EMERGENCY_CARE: "emergency-care",
};

// Care Types
export const CARE_TYPES = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "live-in", label: "Live In" },
  { value: "hourly", label: "Hourly" },
  { value: "emergency", label: "Emergency" },
];

// Available Timings
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

// Gender Options
export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

// Languages
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

// Contact Status
export const CONTACT_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in-progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
};

// Notification Types
export const NOTIFICATION_TYPES = {
  BOOKING_CREATED: "booking_created",
  BOOKING_ACCEPTED: "booking_accepted",
  BOOKING_REJECTED: "booking_rejected",
  BOOKING_CANCELLED: "booking_cancelled",
  BOOKING_COMPLETED: "booking_completed",
  CAREGIVER_APPROVED: "caregiver_approved",
  CAREGIVER_REJECTED: "caregiver_rejected",
  PROFILE_UPDATE_REQUIRED: "profile_update_required",
  NEW_REVIEW: "new_review",
  GENERAL: "general",
};

// Status Badge Colors
export const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  accepted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "changes-required": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};
