import express from "express";
import * as userController from "./user.controller.js";
import { protect } from "../../common/middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.patch("/profile", userController.updateProfile);

export default router;
