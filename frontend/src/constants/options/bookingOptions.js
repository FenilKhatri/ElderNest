import { BOOKING_STATUS } from "../statusConstants.js";

export const BOOKING_STATUS_OPTIONS = [
  { value: BOOKING_STATUS.PENDING, label: "Pending" },
  { value: BOOKING_STATUS.ACCEPTED, label: "Accepted" },
  { value: BOOKING_STATUS.REJECTED, label: "Rejected" },
  { value: BOOKING_STATUS.IN_PROGRESS, label: "In Progress" },
  { value: BOOKING_STATUS.COMPLETED, label: "Completed" },
  { value: BOOKING_STATUS.CANCELLED, label: "Cancelled" },
];

export const CARE_TYPES = [
  { value: "hourly", label: "Hourly Care" },
  { value: "part-time", label: "Part-Time Care" },
  { value: "full-time", label: "Full-Time Care" },
  { value: "live-in", label: "Live-In Care" },
  { value: "emergency", label: "Emergency Care" },
];

export const DURATION_TYPES = [
  { value: "hourly", label: "Hourly Basis" },
  { value: "daily", label: "Daily Basis" },
  { value: "long-term", label: "Long-Term Basis" },
];

