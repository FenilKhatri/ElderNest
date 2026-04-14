import express from "express";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/admin", adminController);

export default router;