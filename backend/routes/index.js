import express from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import caregiverRoutes from "../modules/caregiver/caregiver.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import bookingRoutes from "../modules/booking/booking.routes.js";
import serviceRoutes from "../modules/service/services.routes.js";
import contactRoutes from "../modules/contact/contact.routes.js";
import notificationRoutes from "../modules/notification/notification.routes.js";
import reviewRoutes from "../modules/review/review.routes.js";
import blogRoutes from "../modules/blog/blog.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import uploadRoutes from "../modules/upload/upload.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/caregivers", caregiverRoutes);
router.use("/bookings", bookingRoutes);
router.use("/services", serviceRoutes);
router.use("/admin", adminRoutes);
router.use("/contact", contactRoutes);
router.use("/notifications", notificationRoutes);
router.use("/reviews", reviewRoutes);
router.use("/blogs", blogRoutes);
router.use("/users", userRoutes);
router.use("/upload", uploadRoutes);

export default router;