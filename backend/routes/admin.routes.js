import express from "express";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { ROLES } from "../utils/constants.js";

const router = express.Router();

router.use(protect, authorizeRoles(ROLES?.ADMIN));

export default router;