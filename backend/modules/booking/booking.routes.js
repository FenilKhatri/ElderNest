import express from "express";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";
import { ROLES } from "../../common/utils/constants.js";
import * as bookingController from "./booking.controller.js";
import {
    createBookingValidator,
    updateBookingStatusValidator,
    getBookingByIdValidator,
} from "./booking.validators.js";

const router = express.Router();

router.use(protect);

router.post(
    "/create",
    authorizeRoles(ROLES.USER),
    createBookingValidator,
    bookingController.createBooking
);

router.get(
    "/user/my-bookings",
    authorizeRoles(ROLES.USER),
    bookingController.getUserBookings
);

router.get(
    "/admin/all",
    authorizeRoles(ROLES.ADMIN),
    bookingController.getAllBookings
);

router.get(
    "/caregiver/:caregiverId",
    authorizeRoles(ROLES.CAREGIVER, ROLES.ADMIN),
    bookingController.getCaregiverBookings
);

router.get(
    "/:id",
    getBookingByIdValidator,
    bookingController.getBookingById
);

router.patch(
    "/:id/status",
    updateBookingStatusValidator,
    bookingController.updateBookingStatus
);

router.delete(
    "/:id",
    authorizeRoles(ROLES.ADMIN),
    bookingController.deleteBooking
);

export default router;
