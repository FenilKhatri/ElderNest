import express from "express";
import { validateLogin, validateRegister } from "../auth/auth.validator.js";
import { googleAuth, logout } from "../auth/auth.controller.js";
import { ROLES } from "../../common/utils/constants.js";
import { loginCaregiver, registerCaregiver } from "./caregivers.controller.js";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { authLimiter } from "../../common/middlewares/limiter.js";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";

const router = express.Router();

router.post("/register", validateRegister, registerCaregiver);
router.post("/login", authLimiter, validateLogin, loginCaregiver);
router.post("/google", googleAuth);
router.post("/logout", logout);

// Protected Routes for caregivers
router.use(protect, authorizeRoles(ROLES?.CAREGIVER));

// router.get("/dashboard", caregiverDashboard);

export default router;
