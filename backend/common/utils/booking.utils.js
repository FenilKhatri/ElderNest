import { ROLES } from "./constants.js";

export const isBookingOwner = (user, booking) => {
    if (!booking || !booking.userId || !user || !user.id) return false;
    if (user.role === ROLES.ADMIN) return true;
    return booking.userId.toString() === user.id.toString();
};
