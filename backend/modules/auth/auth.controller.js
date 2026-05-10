import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { createUser, existingUser, createCaregiver, existingCaregiver } from "./auth.service.js";
import User from "../user/user.model.js";
import Caregiver from "../caregiver/caregiver.model.js";

import generateToken from "../../common/utils/generateToken.utils.js";
import { CAREGIVER_STATUSES, ROLES } from "../../common/utils/constants.js";
import { setAuthCookie, clearAuthCookie } from "../../common/utils/cookie.utils.js";
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

    return successResponse(res, 200, "Login successful", { user, token, isApproved: user.isApproved });
});

// OAuth with Google
export const googleAuth = asyncHandler(async (req, res) => {
    const { token, role } = req.body;
    if (!token) {
        return errorResponse(res, 400, "Token missing");
     }

    const decoded = await admin.auth().verifyIdToken(token);
    const { name, email, picture } = decoded;

    let user = await User.findOne({ email });
    if (user && user.role !== role) {
        return errorResponse(
            res,
            400,
            `Account already exists as ${user.role}`
        );
    }

    if (!user) {
        user = await User.create({
            name,
            email,
            profileImage: picture,
            role: role === ROLES.CAREGIVER
                ? ROLES.CAREGIVER
                : ROLES.USER,
            isApproved: role === ROLES.USER,
            authProvider: "google",
            status: role === ROLES.USER ? CAREGIVER_STATUSES.APPROVED : CAREGIVER_STATUSES.PENDING,
        });
    }

    // caregiver validation
    if (role === ROLES.CAREGIVER) {
        let caregiver = await Caregiver.findOne({ userId: user._id });

        if (!caregiver) {
            caregiver = await Caregiver.create({
                userId: user._id,
            });
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
        const caregiver = await Caregiver.findOne({ userId: user._id }).populate("userId", "-password");;

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
