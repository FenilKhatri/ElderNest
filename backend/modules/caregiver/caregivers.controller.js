import { asyncHandler } from "../../common/middlewares/async.helper.js";

// Caregiver dashboard
export const caregiverDashboard = asyncHandler(async (req, res) => {
    return res.json({
        message: "Welcome to your dashboard! Here you can manage your profile, view appointments, and more.",
    });
});