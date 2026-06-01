import express from "express";
import { subscribeNewsletter, getNewsletterSubscribers } from "./newsletter.controller.js";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";
import { ROLES } from "../../common/utils/constants.js";

const router = express.Router();

router.post("/subscribe", subscribeNewsletter);

router.get("/subscribers", protect, authorizeRoles(ROLES.ADMIN), getNewsletterSubscribers);

export default router;
