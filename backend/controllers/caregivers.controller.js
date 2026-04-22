import { asyncHandler } from "../helpers/async.helper.js";
import Caregiver from "../models/caregiver.model.js";
import { createCaregiver, existingCaregiver } from "../services/caregiver.auth.services.js";
import { ROLES } from "../utils/constants.js";
import { setAuthCookie } from "../utils/cookie.utils.js";
import generateToken from "../utils/generateToken.utils.js";
import { successResponse, errorResponse } from "../utils/responseHandler.utils.js";

// Register caregiver
export const registerCaregiver = asyncHandler(async (req, res) => {
    const user = await createCaregiver(req.body);

    const token = generateToken(user);

    setAuthCookie(res, token);

    return successResponse(res, 201, "Caregiver registered!", {
        user,
    });
});

// Login caregiver
export const loginCaregiver = asyncHandler(async (req, res) => {
    const user = await existingCaregiver(req.body);

    const token = generateToken(user);

    setAuthCookie(res, token);

    return successResponse(res, 200, "Login successful", { user, isApproved: user.isApproved });
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

// Caregiver dashboard
export const caregiverDashboard = asyncHandler(async (req, res) => {
    return res.json({
        message: "Welcome to your dashboard! Here you can manage your profile, view appointments, and more.",
    });
});