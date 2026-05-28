import express from "express";
import * as settingsController from "./settings.controller.js";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";
import { ROLES } from "../../common/utils/constants.js";

const router = express.Router();

router.get("/", settingsController.getSettings);

router.use(protect);
router.use(authorizeRoles(ROLES.ADMIN));

router.patch("/", settingsController.updateSettings);

export default router;
