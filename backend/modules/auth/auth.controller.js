import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { createUser, existingUser } from "./auth.service.js";
import User from "../user/user.model.js";
import Caregiver from "../caregiver/caregiver.model.js";

import { ROLES } from "../../common/utils/constants.js";
import { setAuthCookie, clearAuthCookie } from "../../common/utils/cookie.utils.js";
import generateToken from "../../common/utils/generateToken.utils.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";

import admin from "../../config/firebaseAdmin.js";

// Register
export const register = asyncHandler(async (req, res) => {
    const user = await createUser(req.body);

    const token = generateToken(user);
    setAuthCookie(res, token);

    return successResponse(res, 201, "User registered successfully!", { user });
});

// login
export const login = asyncHandler(async (req, res) => {
    const user = await existingUser(req.body);

    const token = generateToken(user);
    setAuthCookie(res, token);

    return successResponse(res, 200, "Login successful!", { user });
});

// OAuth with Google
export const googleAuth = asyncHandler(async (req, res) => {
    const { token, role } = req.body;

    const decoded = await admin.auth().verifyIdToken(token);
    const { name, email, picture } = decoded;

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            name,
            email,
            profileImage: picture,
            role,
            isApproved: role === ROLES.USER,
            authProvider: "google",
            status: role === ROLES.USER ? "approved" : "pending",
        });
    }

    // caregiver validation
    if (role === ROLES.CAREGIVER) {
        const caregiver = await Caregiver.findOne({ userId: user._id });

        if (!caregiver) {
            return errorResponse(res, 404, "Caregiver not found!");
        }
    }

    const jwtToken = generateToken(user);
    setAuthCookie(res, jwtToken);

    return successResponse(res, 200, "Login successful", {
        user,
        isApproved: user.isApproved,
    });
});

// getME
export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return errorResponse(res, 404, "User not found");
    }

    // caregiver
    if (user.role === ROLES.CAREGIVER) {
        const caregiver = await Caregiver.findOne({ userId: user._id });

        return successResponse(res, 200, "User fetched", {
            user,
            caregiver,
        });
    }

    return successResponse(res, 200, "User fetched", { user });
});

// Logout
export const logout = (req, res) => {
    clearAuthCookie(res);
    return successResponse(res, 200, "Logout successful!");
};
