// User Roles
export const ROLES = {
  USER: "user",
  CAREGIVER: "caregiver",
  ADMIN: "admin",
};

// Booking Status enum values
export const BOOKING_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Caregiver Status enum values
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

// Blog Categories
export const BLOG_CATEGORIES = [
  "All Categories",
  "Health",
  "Tips",
  "Wellness",
  "Caregiving",
  "Eldercare",
  "Lifestyle"
];
