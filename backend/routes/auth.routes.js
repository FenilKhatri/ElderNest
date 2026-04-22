import express from "express";
import { getMe, login, register } from "../controllers/auth.controller.js";
import { validateLogin, validateRegister } from "../validators/auth.validators.js";
import { protect } from "../middlewares/auth.middleware.js";
import { logout } from "../controllers/logout.controller.js";
import { authLimiter } from "../helpers/limiter.js";
import { googleAuthController } from "../controllers/googleOAuth.controller.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { ROLES } from "../utils/constants.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.post("/google", googleAuthController);
router.post("/logout", logout);

// Protected Routes
router.use(protect, authorizeRoles(ROLES?.ADMIN || ROLES?.USER));

router.get("/me", getMe);

export default router;