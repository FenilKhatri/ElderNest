import { REFUND_STATUS } from "../statusConstants.js";

export const REFUND_STATUS_OPTIONS = [
  { id: "all", label: "All Statuses" },
  { id: REFUND_STATUS.PENDING, label: "Pending" },
  { id: REFUND_STATUS.APPROVED, label: "Approved" },
  { id: REFUND_STATUS.REJECTED, label: "Rejected" },
  { id: REFUND_STATUS.PROCESSED, label: "Processed" },
];

