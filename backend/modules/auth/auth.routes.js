import express from "express";

import {
    register,
    login,
    adminLogin,
    googleAuth,
    logout,
    getMe,
    registerCaregiver,
    loginCaregiver,
    forgotPassword,
    resetPassword,
    validateResetToken
} from "./auth.controller.js";

import { validateRegister, validateLogin } from "./auth.validator.js";
import { ROLES } from "../../common/utils/constants.js";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";
import { authLimiter } from "../../common/middlewares/limiter.js";
import { createLimiter } from "../../common/middlewares/rate.limiter.js";

// Stricter rate limiter for password reset (5 requests per 15 minutes)
const forgotPasswordLimiter = createLimiter(5, 15 * 60 * 1000);

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.post("/admin-login", authLimiter, validateLogin, adminLogin);
router.post("/caregiver-register", validateRegister, registerCaregiver);
router.post("/caregiver-login", authLimiter, validateLogin, loginCaregiver);
router.post("/google", googleAuth);

// Forgot / Reset password (public routes, no auth required)
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/validate-reset-token", validateResetToken);

router.use(protect);
router.get("/me", getMe);

router.post("/logout", logout);

// Role based access control
router.use(authorizeRoles(ROLES.USER, ROLES.ADMIN));

export default router;