import express from "express";
import { getMe, login, logout, register } from "../controllers/auth.controller.js";
import { validateLogin, validateRegister } from "../validators/auth.validators.js";
import rateLimit from "express-rate-limit";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, //10 min
    max: 10,
    message: {
        success: false,
        message: "Too many login requests, please try again later!",
    }
})

router.post("/register", validateRegister, register);
router.post("/login", loginLimiter, validateLogin, login);
router.get("/me", protect, getMe);
router.get("/logout", logout);

export default router;