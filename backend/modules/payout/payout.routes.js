import express from "express";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";
import {
    getAllPayouts,
    getMyPayouts,
    createPayout,
    updatePayoutStatus,
} from "./payout.controller.js";

const router = express.Router();

router.use(protect);

router.get("/my-payouts", authorizeRoles("caregiver"), getMyPayouts);

router.use(authorizeRoles("admin"));
router.get("/", getAllPayouts);
router.post("/", createPayout);
router.patch("/:id/status", updatePayoutStatus);

export default router;
