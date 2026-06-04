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
import settingsRoutes from "../modules/settings/settings.routes.js";
import newsletterRoutes from "../modules/newsletter/newsletter.routes.js";
import patientRoutes from "../modules/patient/patient.routes.js";
import careNoteRoutes from "../modules/careNote/careNote.routes.js";
import complaintRoutes from "../modules/complaint/complaint.routes.js";
import paymentRoutes from "../modules/payment/payment.routes.js";
import transactionRoutes from "../modules/transaction/transaction.routes.js";
import refundRoutes from "../modules/refund/refund.routes.js";
import payoutRoutes from "../modules/payout/payout.routes.js";
import messageRoutes from "../modules/message/message.routes.js";
import walletRoutes from "../modules/wallet/wallet.routes.js";
import { maintenanceMiddleware } from "../common/middlewares/maintenance.middleware.js";

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
router.use("/settings", settingsRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/patients", patientRoutes);
router.use("/care-notes", careNoteRoutes);
router.use("/complaints", complaintRoutes);
router.use("/payments", paymentRoutes);
router.use("/messages", messageRoutes);
router.use("/transactions", transactionRoutes);
router.use("/refunds", refundRoutes);
router.use("/payouts", payoutRoutes);
router.use("/wallet", walletRoutes);

export default router;