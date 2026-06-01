import express from "express";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";
import { ROLES } from "../../common/utils/constants.js";
import * as complaintController from "./complaint.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", authorizeRoles(ROLES.USER, ROLES.CAREGIVER), complaintController.submitComplaint);
router.get("/my", authorizeRoles(ROLES.USER, ROLES.CAREGIVER), complaintController.getMyComplaints);

router.get("/", authorizeRoles(ROLES.ADMIN), complaintController.getAllComplaints);
router.patch("/:id/status", authorizeRoles(ROLES.ADMIN), complaintController.updateComplaintStatus);

export default router;
