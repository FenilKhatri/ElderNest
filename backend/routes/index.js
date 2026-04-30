import express from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import caregiverRoutes from "../modules/caregiver/caregiver.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
// import userRoutes from "../modules/user/user.routes.js";
// import bookingRoutes from "../modules/booking/booking.routes.js";
// import serviceRoutes from "../modules/service/service.routes.js";
// import elderRoutes from "../modules/elder/elder.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
// router.use("/users", userRoutes);
// router.use("/elders", elderRoutes);
router.use("/caregivers", caregiverRoutes);
// router.use("/bookings", bookingRoutes);
// router.use("/services", serviceRoutes);
router.use("/admin", adminRoutes);

export default router;