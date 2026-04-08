import generateToken from "../utils/generateToken.js";
import { successResponse } from "../utils/responseHandler.js"
import { asyncHandler } from "../helpers/async.helper.js";
import { createUser, existingUser } from "../services/auth.services.js";

// Register
export const register = asyncHandler(async (req, res) => {
    const user = await createUser(req.body);

    const token = generateToken(user._id, "user");

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, 201, "User registered successfully!", {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
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
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return successResponse(res, 200, "Login successful", {
        user: {
            id: user._id,
            email: user.email,
        },
    });
});

export const logout = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ success: true, message: "Logged out" });
};