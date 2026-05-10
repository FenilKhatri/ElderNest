import express from "express";
import { ROLES } from "../../common/utils/constants.js";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";

const router = express.Router();

// Protected Routes for caregivers
router.use(protect, authorizeRoles(ROLES?.CAREGIVER));

// router.get("/dashboard", caregiverDashboard);

export default router;
