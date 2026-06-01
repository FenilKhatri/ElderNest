import express from "express";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";
import { ROLES } from "../../common/utils/constants.js";
import * as paymentController from "./payment.controller.js";
import { createBookingValidator } from "../booking/booking.validators.js";
import { validationResult } from "express-validator";
import { errorResponse } from "../../common/utils/responseHandler.utils.js";

const router = express.Router();

// Middleware to check validation results
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, "Validation failed", errors.array());
    }
    next();
};

// Public — frontend needs the key before auth in some flows
router.get("/key", paymentController.getRazorpayKey);

// Protected — user only
router.use(protect);

router.post(
    "/create-order",
    authorizeRoles(ROLES.USER),
    createBookingValidator,
    validateRequest,
    paymentController.createOrder
);

router.post(
    "/verify",
    authorizeRoles(ROLES.USER),
    paymentController.verifyPayment
);

export default router;
