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

// Protected routes
router.use(protect);

// User routes
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

// Caregiver routes
router.get(
    "/caregiver/:caregiverId",
    authorizeRoles(ROLES.CAREGIVER, ROLES.ADMIN),
    bookingController.getCaregiverBookings
);

// Shared routes (user, caregiver, admin)
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

// Admin routes
router.get(
    "/admin/all",
    authorizeRoles(ROLES.ADMIN),
    bookingController.getAllBookings
);

export default router;
