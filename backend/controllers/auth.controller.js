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
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role || "user",
        },
    });
})

// Login
export const login = asyncHandler(async (req, res) => {
    const user = await existingUser(req.body);

    const token = generateToken(user._id, user.role);

    // Set cookie
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

    return res.status(200).json({
        success: true,
        message: "Login successful!",
        data: responseData,
    });
});

// logout
export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    });
    return successResponse(res, 200, "Logout successful!");
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