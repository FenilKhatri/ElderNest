import generateToken from "../utils/generate.token.js";
import { successResponse } from "../utils/response.handler.js"
import { asyncHandler } from "../helpers/async.helper.js";
import { createUser, existingUser } from "../services/auth.services.js";
import User from "../models/user.model.js";

// Register
export const register = asyncHandler(async (req, res) => {
    const user = await createUser(req.body);

    const token = generateToken(user._id, "user");

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, 201, "User registered successfully!", {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role || "user",
        },
    });
});

// Login
export const login = asyncHandler(async (req, res) => {
    const user = await existingUser(req.body);

    const token = generateToken(user._id, user.role);

    res.cookie("token", token, {
        httpOnly: true, // Protect from XSS
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const responseData = {
        user: {
            id: user._id,
            email: user.email,
            role: user.role || "user",
        },
    };

    return successResponse(res, 200, "Login successful!", responseData);
});

// Google OAuth
export const googleAuthController = async (req, res) => {
    try {
        const { name, email, profileImage } = req.body;

        let user = await User.findOne({ email });

        // Create if not exists
        if (!user) {
            user = await User.create({
                name,
                email,
                profileImage,
                role: "user",
                isApproved: true,
                status: "approved",
            });
        }

        const token = generateToken(user._id, user.role);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return successResponse(res, 200, "Google login successful", {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Google authentication failed",
        });
    }
};

// Me
export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.json({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});
