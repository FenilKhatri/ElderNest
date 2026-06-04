import { PAYOUT_STATUS } from "../statusConstants.js";

export const PAYOUT_STATUS_OPTIONS = [
  { id: "all", label: "All Statuses" },
  { id: PAYOUT_STATUS.PENDING, label: "Pending" },
  { id: PAYOUT_STATUS.PROCESSING, label: "Processing" },
  { id: PAYOUT_STATUS.COMPLETED, label: "Completed" },
  { id: PAYOUT_STATUS.FAILED, label: "Failed" },
];

