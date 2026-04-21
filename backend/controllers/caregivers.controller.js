import generateToken from "../utils/generate.token.js";
import { successResponse } from "../utils/response.handler.js";
import { asyncHandler } from "../helpers/async.helper.js";
import User from "../models/user.model.js";
import Caregiver from "../models/caregiver.model.js";
import {
    createCaregiver,
    existingCaregiver,
} from "../services/caregiver.auth.services.js";

// Register
export const registerCaregiver = asyncHandler(async (req, res) => {
    const user = await createCaregiver(req.body);

    const token = generateToken(user._id, user.role);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, 201, "Caregiver registered successfully!", {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role || "caregiver",
            status: user.status || "pending",
            profileCompleted: false,
        },
    });
});

// Login
export const loginCaregiver = asyncHandler(async (req, res) => {
    const user = await existingCaregiver(req.body);

    const token = generateToken(user._id, user.role);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const responseData = {
        user: {
            id: user._id,
            email: user.email,
            role: user.role || "caregiver",
        },
    };

    return successResponse(res, 200, "Login successful!", responseData);
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