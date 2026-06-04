import { BOOKING_STATUS } from "../statusConstants";

export const TABS = [
  { id: "all", label: "All Bookings" },
  { id: BOOKING_STATUS.PENDING, label: "Pending" },
  { id: BOOKING_STATUS.ACCEPTED, label: "Accepted" },
  { id: BOOKING_STATUS.IN_PROGRESS, label: "In Progress" },
  { id: BOOKING_STATUS.COMPLETED, label: "Completed" },
  { id: BOOKING_STATUS.CANCELLED, label: "Cancelled" },
];

export const PER_PAGE = 6;