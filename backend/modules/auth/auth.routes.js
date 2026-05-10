import express from "express";

import {
    register,
    login,
    googleAuth,
    logout,
    getMe,
    registerCaregiver,
    loginCaregiver
} from "./auth.controller.js";

import { validateRegister, validateLogin } from "./auth.validator.js";
import { ROLES } from "../../common/utils/constants.js";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";
import { authLimiter } from "../../common/middlewares/limiter.js";

const router = express.Router();

// Public Routes
router.post("/register", validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.post("/caregiver-register", validateRegister, registerCaregiver);
router.post("/caregiver-login", authLimiter, validateLogin, loginCaregiver);
router.post("/google", googleAuth);

// Protected Routes
router.use(protect);
router.get("/me", getMe);

router.post("/logout", logout);

// Role based access control
router.use(authorizeRoles(ROLES.USER, ROLES.ADMIN));

export default router;