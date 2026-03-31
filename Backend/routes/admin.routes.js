import express from "express";
import { authorize } from "../middlewares/role.middleware";
import { protect } from "../middlewares/auth.middleware";

const adminRoutes = express.Router();

adminRoutes.post("/login", protect, authorize("admin"),adminController);

export default adminRoutes;