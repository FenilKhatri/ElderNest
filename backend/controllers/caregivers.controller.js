import { asyncHandler } from "../helpers/async.helper.js";
import Caregiver from "../models/caregiver.model.js";
import { createCaregiver, existingCaregiver } from "../services/caregiver.auth.services.js";
import { ROLES } from "../utils/constants.js";
import { setAuthCookie } from "../utils/cookie.utils.js";
import generateToken from "../utils/generateToke.utils.js";
import { successResponse } from "../utils/responseHandler.utils.js";

// Register caregiver
export const registerCaregiver = asyncHandler(async (req, res) => {
    const user = await createCaregiver(req.body);

    const token = generateToken(user._id, user.role);

    setAuthCookie(res, token);

    return successResponse(res, 201, "Caregiver registered!", {
        user,
    });
});

// Login caregiver
export const loginCaregiver = asyncHandler(async (req, res) => {
    const user = await existingCaregiver(req.body);

    if (!user.isApproved) {
        return errorResponse(res, 403, "Awaiting admin approval");
    }

    const token = generateToken(user._id, user.role);

    setAuthCookie(res, token);

    return successResponse(res, 200, "Login successful", { user });
});

// me
export const getMeCaregiver = asyncHandler(async (req, res) => {
    // Fetch caregiver
    const caregiver = await Caregiver.findOne({ userId: req.user.id })
        .populate("userId", "name email phone role status")
        .lean();

    if (!caregiver) {
        return res.status(404).json({ message: "Caregiver not found" });
    }

    return res.json({
        user: caregiver.userId,
        caregiver: {
            bio: caregiver.bio,
            gender: caregiver.gender,
            age: caregiver.age,
            experienceYears: caregiver.experienceYears,
            skills: caregiver.skills,
            languages: caregiver.languages,
            hourlyRate: caregiver.hourlyRate,
            location: caregiver.location,
            rating: caregiver.rating,
            totalReviews: caregiver.totalReviews,
            profileCompleted: caregiver.profileCompleted,
        },
    });
});