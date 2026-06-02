import express from "express";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/role.middleware.js";
import {
    getAllTransactions,
    getTransactionById,
    updateTransactionStatus,
} from "./transaction.controller.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("admin"));

router.get("/", getAllTransactions);
router.get("/:id", getTransactionById);
router.patch("/:id/status", updateTransactionStatus);

export default router;
