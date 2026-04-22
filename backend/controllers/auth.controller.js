import { asyncHandler } from "../helpers/async.helper.js";
import { createUser, existingUser } from "../services/auth.services.js";
import { ROLES } from "../utils/constants.js";
import { setAuthCookie } from "../utils/cookie.utils.js";
import generateToken from "../utils/generateToke.utils.js";
import { successResponse, errorResponse } from "../utils/responseHandler.utils.js";
import admin from "../config/firebaseAdmin.js";
import User from "../models/user.model.js";

// Register
export const register = asyncHandler(async (req, res) => {
    const user = await createUser(req.body);

    const token = generateToken(user._id, ROLES?.USER);

    setAuthCookie(res, token);

    return successResponse(res, 201, "User registered successfully!", {
        user,
    });
});

// Login
export const login = asyncHandler(async (req, res) => {
    const user = await existingUser(req.body);

    const token = generateToken(user._id, user.role);

    setAuthCookie(res, token);

    return successResponse(res, 200, "Login successful!", {
        user,
    });
});

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