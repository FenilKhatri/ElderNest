import express from "express";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";
import { ROLES } from "../../common/utils/constants.js";
import { protect } from "../../common/middlewares/auth.middleware.js";
import * as adminController from "./admin.controller.js";

const router = express.Router();

// All routes require admin role
router.use(protect, authorizeRoles(ROLES.ADMIN));

router.get("/dashboard/stats", adminController.getDashboardStats);

// Caregiver details by user ID
router.get("/caregivers/by-id/:caregiverId", adminController.getCaregiverByIdAdmin);
router.get("/caregivers/user/:userId", adminController.getCaregiverByUserIdAdmin);

// Caregiver registration approval
router.get("/caregivers/pending", adminController.getPendingCaregivers);
router.patch("/caregivers/:userId/approve", adminController.approveCaregiverRegistration);
router.patch("/caregivers/:userId/reject", adminController.rejectCaregiverRegistration);

// Caregiver profile approval
router.get("/profiles/pending", adminController.getPendingProfiles);
router.patch("/profiles/:caregiverId/approve", adminController.approveCaregiverProfile);
router.patch("/profiles/:caregiverId/reject", adminController.rejectCaregiverProfile);

router.get("/caregivers/:caregiverId/verification", adminController.getCaregiverVerificationDetail);
router.patch("/caregivers/:caregiverId/verification", adminController.reviewCaregiverVerification);

router.get("/users", adminController.getAllUsers);
router.delete("/users/:userId", adminController.deleteUser);

router.get("/contacts", adminController.getAllContacts);
router.patch("/contacts/:contactId/status", adminController.updateContactStatus);

router.get("/settings", adminController.getSettings);
router.patch("/settings", adminController.updateSettings);

// Analytics & patients
router.get("/analytics", adminController.getAnalytics);
router.get("/patients", adminController.getAllPatients);
router.patch("/patients/:id", adminController.updatePatient);
router.delete("/patients/:id", adminController.deletePatient);

router.patch("/caregivers/:userId/suspend", adminController.suspendCaregiver);

export default router;