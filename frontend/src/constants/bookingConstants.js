// Booking Status Options (for dropdowns / filters)
export const BOOKING_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// Care Types available for booking
export const CARE_TYPES = [
  { value: "hourly", label: "Hourly Care" },
  { value: "part-time", label: "Part-Time Care" },
  { value: "full-time", label: "Full-Time Care" },
  { value: "live-in", label: "Live-In Care" },
  { value: "emergency", label: "Emergency Care" },
];

// Duration types for booking
export const DURATION_TYPES = [
  { value: "hourly", label: "Hourly Basis" },
  { value: "daily", label: "Daily Basis" },
  { value: "long-term", label: "Long-Term Basis" },
];

// Payout Status Options
export const PAYOUT_STATUS_OPTIONS = [
  { id: "all", label: "All Statuses" },
  { id: "pending", label: "Pending" },
  { id: "processing", label: "Processing" },
  { id: "completed", label: "Completed" },
  { id: "failed", label: "Failed" },
];

// Refund Status Options
export const REFUND_STATUS_OPTIONS = [
  { id: "all", label: "All Statuses" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "processed", label: "Processed" },
];
