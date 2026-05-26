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

const router = express.Router();

// Public routes
router.get("/", caregiverController.getCaregivers);
router.get("/:id", getCaregiverByIdValidator, caregiverController.getCaregiver);

// Protected caregiver routes
router.use(protect, authorizeRoles(ROLES.CAREGIVER));

router.get("/profile/me", caregiverController.getMyProfile);
router.post("/profile/complete", completeProfileValidator, caregiverController.completeProfile);
router.patch("/availability", updateAvailabilityValidator, caregiverController.updateAvailability);
router.get("/dashboard", caregiverController.caregiverDashboard);

export default router;
