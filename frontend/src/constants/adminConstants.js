// Complaint Status Options (for dropdown updates)
export const COMPLAINT_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

// Complaint Status Tab Filters
export const COMPLAINT_STATUS_TABS = [
  { id: "all", label: "All Complaints" },
  { id: "pending", label: "Pending" },
  { id: "in-progress", label: "In Progress" },
  { id: "resolved", label: "Resolved" },
  { id: "closed", label: "Closed" },
];

// Complaint Type Filter
export const COMPLAINT_TYPE_FILTER = [
  { id: "all", label: "All Types" },
  { id: "user", label: "User Complaints" },
  { id: "caregiver", label: "Caregiver Complaints" },
];

// Contact/General Status Options
export const CONTACT_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

// Transaction Type Filter
export const TRANSACTION_TYPE_OPTIONS = [
  { id: "all", label: "All Types" },
  { id: "payment", label: "Payment" },
  { id: "refund", label: "Refund" },
  { id: "payout", label: "Payout" },
];

// Caregiver management tabs (admin)
export const CAREGIVER_MGMT_TABS = [
  { id: "all", label: "All Caregivers" },
  { id: "pending", label: "Pending Registration" },
  { id: "profiles", label: "Pending Profiles" },
];

// User/caregiver status filter options
export const USER_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];
