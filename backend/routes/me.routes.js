import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getMe } from "../controllers/me.controller.js";

const router = express.Router();

router.get("/", protect, getMe);

export default router;