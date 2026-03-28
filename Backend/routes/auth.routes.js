import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { login, register } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.get("/me", protect, (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
});

export default router;