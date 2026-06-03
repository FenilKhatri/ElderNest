import express from "express";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";
import { ROLES } from "../../common/utils/constants.js";
import * as reviewController from "./review.controller.js";

const router = express.Router();

router.get("/caregiver/:caregiverId", reviewController.getCaregiverReviews);
router.get("/service/:serviceId", reviewController.getServiceReviews);

router.use(protect);

router.post("/", authorizeRoles(ROLES.USER), reviewController.createReview);
router.patch("/:id", authorizeRoles(ROLES.USER), reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);
router.get("/my-reviews", authorizeRoles(ROLES.USER), reviewController.getUserReviews);

router.post("/:id/reply", authorizeRoles(ROLES.ADMIN, ROLES.CAREGIVER), reviewController.addReply);
router.post("/:id/report", authorizeRoles(ROLES.USER, ROLES.CAREGIVER), reviewController.reportReview);

export default router;
