import { COMPLAINT_STATUS } from "../statusConstants.js";

export const COMPLAINT_STATUS_OPTIONS = [
  { value: COMPLAINT_STATUS.PENDING, label: "Pending" },
  { value: COMPLAINT_STATUS.IN_PROGRESS, label: "In Progress" },
  { value: COMPLAINT_STATUS.RESOLVED, label: "Resolved" },
  { value: COMPLAINT_STATUS.CLOSED, label: "Closed" },
];

export const COMPLAINT_TYPE_FILTER = [
  { id: "all", label: "All Types" },
  { id: "user", label: "User Complaints" },
  { id: "caregiver", label: "Caregiver Complaints" },
];

