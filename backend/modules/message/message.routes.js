import express from "express";
import { getMessages, sendMessage } from "./message.controller.js";
import { protect } from "../../common/middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.use(protect);

router.get("/:bookingId", getMessages);
router.post("/:bookingId", sendMessage);

export default router;
