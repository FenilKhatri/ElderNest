import express from "express";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// router.get("/admin", protect, authorizeRoles("admin"), adminController);

export default router;