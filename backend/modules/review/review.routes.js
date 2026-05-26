import express from "express";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";
import { ROLES } from "../../common/utils/constants.js";
import * as reviewController from "./review.controller.js";

const router = express.Router();

// Public route
router.get("/caregiver/:caregiverId", reviewController.getCaregiverReviews);

// Protected routes
router.use(protect);

router.post("/", authorizeRoles(ROLES.USER), reviewController.createReview);
router.get("/my-reviews", authorizeRoles(ROLES.USER), reviewController.getUserReviews);

export default router;
