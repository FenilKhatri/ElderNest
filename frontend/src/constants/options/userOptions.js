import { CAREGIVER_STATUSES } from "../statusConstants.js";

export const USER_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: CAREGIVER_STATUSES.PENDING, label: "Pending" },
  { value: CAREGIVER_STATUSES.APPROVED, label: "Approved" },
  { value: CAREGIVER_STATUSES.REJECTED, label: "Rejected" },
];

