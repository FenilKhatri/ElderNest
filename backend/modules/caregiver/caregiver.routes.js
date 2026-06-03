import express from "express";
import { ROLES } from "../../common/utils/constants.js";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";
import * as caregiverController from "./caregivers.controller.js";
import {
    completeProfileValidator,
    updateAvailabilityValidator,
    getCaregiverByIdValidator,
} from "./caregiver.validators.js";
import { requirePublishedCaregiver } from "../../common/middlewares/caregiverOnboarding.middleware.js";
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

// Public routes (without parameters)
router.get("/", caregiverController.getCaregivers);

// Protected static routes (must come BEFORE parameter routes like /:id)
const protectCaregiver = [protect, authorizeRoles(ROLES.CAREGIVER)];

router.get("/onboarding/status", protectCaregiver, caregiverController.getOnboardingStatus);
router.get("/profile/me", protectCaregiver, caregiverController.getMyProfile);
router.patch("/profile", protectCaregiver, caregiverController.updateProfile);
router.post("/profile/complete", protectCaregiver, completeProfileValidator, validateRequest, caregiverController.completeProfile);
router.post("/verification/submit", protectCaregiver, caregiverController.submitVerification);
router.get("/availability", protectCaregiver, requirePublishedCaregiver, caregiverController.getMyAvailability);
router.patch("/availability", protectCaregiver, requirePublishedCaregiver, updateAvailabilityValidator, validateRequest, caregiverController.updateAvailability);
router.get("/dashboard", protectCaregiver, requirePublishedCaregiver, caregiverController.caregiverDashboard);

// Public route with parameter (must be LAST to avoid swallowing static routes)
router.get("/:id", getCaregiverByIdValidator, validateRequest, caregiverController.getCaregiver);

export default router;
