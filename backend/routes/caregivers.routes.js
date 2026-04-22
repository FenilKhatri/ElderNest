import express from "express";
import {
  validateLogin,
  validateRegister,
} from "../validators/auth.validators.js";
import { protect } from "../middlewares/auth.middleware.js";
import { logout } from "../controllers/logout.controller.js";
import { authLimiter } from "../helpers/limiter.js";
import {
  getMeCaregiver,
  loginCaregiver,
  registerCaregiver,
} from "../controllers/caregivers.controller.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { ROLES } from "../utils/constants.js";
import { googleAuthController } from "../controllers/googleOAuth.controller.js";

const router = express.Router();

router.post("/register", validateRegister, registerCaregiver);
router.post("/login", authLimiter, validateLogin, loginCaregiver);
router.post("/google", googleAuthController);
router.post("/logout", logout);

// Protected Routes for caregivers
router.use(protect, authorizeRoles(ROLES?.CAREGIVER));

router.get("/me", getMeCaregiver);

export default router;
