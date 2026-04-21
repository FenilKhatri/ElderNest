import User from "../models/user.model.js";
import { errorResponse, successResponse } from "../utils/responseHandler.utils.js";

// Get pending caregivers
export const getPendingCaregivers = async (req, res) => {
    const caregivers = await User.find({
        role: "caregiver",
        status: "pending",
    });

    return successResponse(res, 200, "Pending caregivers", caregivers);
};

// Approve caregiver
export const approveCaregiver = async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
        id,
        { isApproved: true, status: "approved" },
        { new: true }
    );

    if (!user) return errorResponse(res, 404, "User not found");

    return successResponse(res, 200, "Caregiver approved", user);
};