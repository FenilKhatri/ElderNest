import Caregiver from "../models/caregiver.model.js";
import { errorResponse } from "../utils/responseHandler.utils.js";

// Role-based access
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return errorResponse(res, 403, "Access denied!");
        }
        next();
    };
};

// Caregiver approval check
export const requireApprovedCaregiver = async (req, res, next) => {
    const caregiver = await Caregiver.findOne({ userId: req.user.id });

    if (!caregiver) {
        return errorResponse(res, 403, "Caregiver profile not found");
    }

    if (!req.user.isApproved || req.user.status !== "approved") {
        return errorResponse(
            res,
            403,
            "Your profile is under review. Wait for admin approval."
        );
    }

    req.caregiver = caregiver;
    next();
};