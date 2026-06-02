/**
 * Centralized constants for the ElderNest backend.
 * Use these instead of hardcoding string arrays in Mongoose models/validators.
 *
 * These values MUST stay in sync with the frontend constants in:
 *   frontend/src/constants/
 */
// BOOKING
export const CARE_TYPES = ["full-time", "part-time", "live-in", "hourly", "emergency"];
export const DURATION_TYPES = ["hourly", "daily", "long-term"];
export const BOOKING_STATUSES = ["pending", "accepted", "rejected", "in-progress", "completed", "cancelled"];
export const PAYMENT_STATUSES = ["pending", "paid", "refunded", "failed", "completed"];
export const CANCELLED_BY = ["user", "caregiver", "admin"];
// USER / AUTH
export const USER_ROLES = ["user", "admin", "caregiver"];
export const AUTH_PROVIDERS = ["local", "google"];
// CAREGIVER
export const GENDER_TYPES = ["male", "female", "other"];
export const AVAILABLE_TIMINGS = ["morning", "afternoon", "evening", "night", "full-day", "flexible"];
export const CAREGIVER_STATUSES = ["pending", "approved", "rejected", "changes-required"];
export const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
// PAYOUT
export const PAYOUT_STATUSES = ["pending", "processing", "completed", "failed"];
// REFUND
export const REFUND_STATUSES = ["pending", "approved", "rejected", "processed"];
// REVIEW
export const REVIEW_STATUSES = ["pending", "approved", "rejected"];
// TRANSACTION
export const TRANSACTION_TYPES = ["payment", "refund", "payout"];
export const TRANSACTION_STATUSES = ["pending", "completed", "failed", "refunded"];
// COMPLAINT
export const COMPLAINT_TYPES = ["user", "caregiver"];
export const COMPLAINT_STATUSES = ["pending", "in-progress", "resolved", "closed"];
// CONTACT
export const CONTACT_STATUSES = ["pending", "in-progress", "resolved", "closed"];
// SERVICE
export const SERVICE_MODES = ["home-visit", "online", "both"];
// NEWSLETTER
export const NEWSLETTER_STATUSES = ["subscribed", "unsubscribed"];
// USER STATUS
export const USER_STATUSES = ["pending", "approved", "rejected"];
