import express from "express";
import { getMe, googleAuthController, login, register } from "../controllers/auth.controller.js";
import { validateLogin, validateRegister } from "../validators/auth.validators.js";
import { protect } from "../middlewares/auth.middleware.js";
import { logout } from "../controllers/logout.controller.js";
import { authLimiter } from "../helpers/limiter.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.post("/google", googleAuthController);
router.get("/me", protect, getMe);
router.post("/logout", logout);

export default router;