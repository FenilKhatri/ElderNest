import express from "express";
import { protect } from "../../common/middlewares/auth.middleware.js";
import * as notificationController from "./notification.controller.js";

const router = express.Router();

// Protected routes
router.use(protect);

router.get("/", notificationController.getNotifications);
router.get("/unread-count", notificationController.getUnreadCount);
router.patch("/:id/read", notificationController.markAsRead);
router.patch("/read-all", notificationController.markAllAsRead);
router.delete("/:id", notificationController.deleteNotification);

export default router;
