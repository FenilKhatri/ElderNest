import express from "express";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";
import {
    createRefundRequest,
    getAllRefunds,
    updateRefundStatus,
} from "./refund.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", createRefundRequest);

router.use(authorizeRoles("admin"));
router.get("/", getAllRefunds);
router.patch("/:id/status", updateRefundStatus);

export default router;
