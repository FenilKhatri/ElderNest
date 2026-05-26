import express from "express";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";
import { ROLES } from "../../common/utils/constants.js";
import { protect } from "../../common/middlewares/auth.middleware.js";
import * as adminController from "./admin.controller.js";

const router = express.Router();

// All routes require admin role
router.use(protect, authorizeRoles(ROLES.ADMIN));

// Dashboard stats
router.get("/dashboard/stats", adminController.getDashboardStats);

// Caregiver registration approval
router.get("/caregivers/pending", adminController.getPendingCaregivers);
router.patch("/caregivers/:userId/approve", adminController.approveCaregiverRegistration);
router.patch("/caregivers/:userId/reject", adminController.rejectCaregiverRegistration);

// Caregiver profile approval
router.get("/profiles/pending", adminController.getPendingProfiles);
router.patch("/profiles/:caregiverId/approve", adminController.approveCaregiverProfile);
router.patch("/profiles/:caregiverId/reject", adminController.rejectCaregiverProfile);

// User management
router.get("/users", adminController.getAllUsers);

// Contact management
router.get("/contacts", adminController.getAllContacts);
router.patch("/contacts/:contactId/status", adminController.updateContactStatus);

export default router;