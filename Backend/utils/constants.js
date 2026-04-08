export const ROLES = {
  USER: "user",
  CAREGIVER: "caregiver",
  ADMIN: "admin",
};

export const BOOKING_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const SERVICE_TYPES = {
  NURSING: "nursing",
  ATTENDANT: "attendant",
  PHYSIOTHERAPY: "physiotherapy",
};

export const MAX_FAILED_ATTEMPTS = 5;

export const LOCK_TIME = 10 * 60 * 1000; // 10 minutes