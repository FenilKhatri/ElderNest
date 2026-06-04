import express from "express";
import { getWalletSummary, getWalletTransactions, payWithWallet } from "./wallet.controller.js";
import { protect } from "../../common/middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getWalletSummary);
router.get("/transactions", getWalletTransactions);
router.post("/pay", payWithWallet);

export default router;
