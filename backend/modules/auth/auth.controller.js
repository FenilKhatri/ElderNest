import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { createUser, existingUser, createCaregiver, existingCaregiver, loginAdmin } from "./auth.service.js";
import User from "../user/user.model.js";
import Caregiver from "../caregiver/caregiver.model.js";

import generateToken from "../../common/utils/generateToken.utils.js";
import { CAREGIVER_STATUSES, ROLES } from "../../common/utils/constants.js";
import { setAuthCookie, clearAuthCookie } from "../../common/utils/cookie.utils.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import { createNotification } from "../../common/services/notification.service.js";
import { sanitizeUser, sanitizeCaregiver } from "../../common/utils/sanitizeUser.js";

import admin from "../../config/firebaseAdmin.js";

// Register
export const register = asyncHandler(async (req, res) => {
    const user = await createUser(req.body);

    const token = generateToken(user);
    setAuthCookie(res, token);

    return successResponse(res, 201, "User registered successfully!", { user: sanitizeUser(user) });
});

// login
export const login = asyncHandler(async (req, res) => {
    const user = await existingUser(req.body);

    if (user.role === ROLES.ADMIN) {
        return errorResponse(res, 401, "Invalid email or password.");
    }

    const token = generateToken(user);
    setAuthCookie(res, token);

    return successResponse(res, 200, "Login successful!", { user: sanitizeUser(user) });
});

// Admin login
export const adminLogin = asyncHandler(async (req, res) => {
    const user = await loginAdmin(req.body);

    const token = generateToken(user);
    setAuthCookie(res, token);

    return successResponse(res, 200, "Admin login successful", { user: sanitizeUser(user) });
});

// Register caregiver
export const registerCaregiver = asyncHandler(async (req, res) => {
    const user = await createCaregiver(req.body);

    const token = generateToken(user);

    setAuthCookie(res, token);

    return successResponse(res, 201, "Caregiver registered!", {
        user: sanitizeUser(user),
    });
});

// Login caregiver
export const loginCaregiver = asyncHandler(async (req, res) => {
    const user = await existingCaregiver(req.body);

    const token = generateToken(user);

    setAuthCookie(res, token);

    return successResponse(res, 200, "Login successful", {
        user: sanitizeUser(user),
        isApproved: user.isApproved,
    });
});

// OAuth with Google
export const googleAuth = asyncHandler(async (req, res) => {
    const { token, role } = req.body;
    if (!token) {
        return errorResponse(res, 400, "Token missing");
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const { name, email, picture } = decoded;

    if (role === ROLES.ADMIN) {
        const existing = await User.findOne({ email });
        if (!existing) {
            return errorResponse(res, 403, "No admin account found for this Google email.");
        }
        if (existing.role !== ROLES.ADMIN) {
            return errorResponse(
                res,
                403,
                "This Google account is not registered as an admin."
            );
        }
    }

    let user = await User.findOne({ email });

    if (user) {
        const requestedRole = role || user.role;
        const roleAllowed =
            user.role === requestedRole ||
            (requestedRole === ROLES.USER && user.role === ROLES.ADMIN) ||
            (requestedRole === ROLES.ADMIN && user.role === ROLES.ADMIN);

        if (!roleAllowed) {
            return errorResponse(
                res,
                403,
                `This account is registered as a ${user.role}. Please use the correct login page.`
            );
        }

        const jwtToken = generateToken(user);
        setAuthCookie(res, jwtToken);

        return successResponse(res, 200, "Login successful", {
            user: sanitizeUser(user),
            isApproved: user.isApproved,
        });
    }

    // ✅ New user — create with provided role
    const newRole =
        role === ROLES.CAREGIVER
            ? ROLES.CAREGIVER
            : role === ROLES.ADMIN
              ? ROLES.ADMIN
              : ROLES.USER;

    user = await User.create({
        name,
        email,
        profileImage: picture,
        role: newRole,
        isApproved: newRole === ROLES.USER || newRole === ROLES.ADMIN,
        authProvider: "google",
        status:
            newRole === ROLES.CAREGIVER ? CAREGIVER_STATUSES.PENDING : CAREGIVER_STATUSES.APPROVED,
    });

    // Create caregiver profile if needed
    if (role === ROLES.CAREGIVER) {
        let caregiver = await Caregiver.findOne({ userId: user._id });
        if (!caregiver) {
            caregiver = await Caregiver.create({ userId: user._id });
        }

        // Notify admin
        const admins = await User.find({ role: ROLES.ADMIN });
        for (const adminUser of admins) {
            await createNotification(
                adminUser._id,
                "general",
                "New Caregiver Registration (Google)",
                `${user.name} has registered as a caregiver and is waiting for approval.`,
                "/admin/caregivers"
            );
        }
    }

    const jwtToken = generateToken(user);
    setAuthCookie(res, jwtToken);

    return successResponse(res, 200, "Login successful", {
        user: sanitizeUser(user),
        isApproved: user.isApproved,
    });
});

// getME
export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return errorResponse(res, 404, "User not found");
    }

    const safeUser = sanitizeUser(user);
    safeUser.hasPassword = Boolean(user.password);

    if (user.role === ROLES.CAREGIVER) {
        const caregiver = await Caregiver.findOne({ userId: user._id })
            .populate("userId", "name email profileImage phone")
            .select(
                "profileCompleted profileApprovalStatus onboardingStage isPublished fullName bio experienceYears"
            );

        return successResponse(res, 200, "User fetched", {
            user: {
                ...safeUser,
                profileCompleted: caregiver?.profileCompleted ?? false,
                profileApprovalStatus: caregiver?.profileApprovalStatus,
                onboardingStage: caregiver?.onboardingStage,
                isPublished: caregiver?.isPublished ?? false,
            },
            caregiver: sanitizeCaregiver(caregiver),
        });
    }

    return successResponse(res, 200, "User fetched", { user: safeUser });
});

// Logout
export const logout = (req, res) => {
    clearAuthCookie(res);
    return successResponse(res, 200, "Logout successful!");
};
