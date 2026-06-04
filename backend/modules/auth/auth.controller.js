import crypto from "crypto";
import bcrypt from "bcrypt";
import axios from "axios";
import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { createUser, existingUser, createCaregiver, existingCaregiver, loginAdmin } from "./auth.service.js";
import User from "../user/user.model.js";
import Caregiver from "../caregiver/caregiver.model.js";
import ResetToken from "./resetToken.model.js";

import generateToken from "../../common/utils/generateToken.utils.js";
import { CAREGIVER_STATUSES, ROLES } from "../../common/utils/constants.js";
import { setAuthCookie, clearAuthCookie } from "../../common/utils/cookie.utils.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import { createNotification } from "../../common/services/notification.service.js";
import { sanitizeUser, sanitizeCaregiver } from "../../common/utils/sanitizeUser.js";
import { sendPasswordResetEmail } from "../../common/services/email.service.js";

import admin from "../../config/firebaseAdmin.js";

export const register = asyncHandler(async (req, res) => {
    const user = await createUser(req.body);

    const token = generateToken(user);
    setAuthCookie(res, token);

    return successResponse(res, 201, "User registered successfully!", { user: sanitizeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
    const user = await existingUser(req.body);

    if (user.role === ROLES.ADMIN) {
        return errorResponse(res, 401, "Invalid email or password.");
    }

    const token = generateToken(user);
    setAuthCookie(res, token);

    return successResponse(res, 200, "Login successful!", { user: sanitizeUser(user) });
});

export const adminLogin = asyncHandler(async (req, res) => {
    const user = await loginAdmin(req.body);

    const token = generateToken(user);
    setAuthCookie(res, token);

    return successResponse(res, 200, "Admin login successful", { user: sanitizeUser(user) });
});

export const registerCaregiver = asyncHandler(async (req, res) => {
    const user = await createCaregiver(req.body);

    const token = generateToken(user);

    setAuthCookie(res, token);

    return successResponse(res, 201, "Caregiver registered!", {
        user: sanitizeUser(user),
    });
});

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

        // Upgrade authProvider to "both" if user originally signed up with form
        if (user.authProvider === "local") {
            user.authProvider = "both";
        }

        // Fill in profile image from Google if not already set
        if (!user.profileImage && picture) {
            user.profileImage = picture;
        }

        await user.save();

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

    if (role === ROLES.CAREGIVER) {
        let caregiver = await Caregiver.findOne({ userId: user._id });
        if (!caregiver) {
            caregiver = await Caregiver.create({ userId: user._id });
        }

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

export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
        return errorResponse(res, 404, "User not found");
    }

    const hasPassword = Boolean(user.password);
    user.password = undefined; // clear before sanitizing

    const safeUser = sanitizeUser(user);
    safeUser.hasPassword = hasPassword;

    if (user.role === ROLES.CAREGIVER) {
        const caregiver = await Caregiver.findOne({ userId: user._id })
            .populate("userId", "name email profileImage phone")
            .select(
                "profileCompleted profileApprovalStatus onboardingStage isPublished fullName bio experienceYears adminFeedback"
            );

        return successResponse(res, 200, "User fetched", {
            user: {
                ...safeUser,
                profileCompleted: caregiver?.profileCompleted ?? false,
                profileApprovalStatus: caregiver?.profileApprovalStatus,
                onboardingStage: caregiver?.onboardingStage,
                isPublished: caregiver?.isPublished ?? false,
                adminFeedback: caregiver?.adminFeedback,
            },
            caregiver: sanitizeCaregiver(caregiver),
        });
    }

    return successResponse(res, 200, "User fetched", { user: safeUser });
});

export const logout = (req, res) => {
    clearAuthCookie(res);
    return successResponse(res, 200, "Logout successful!");
};

// ─── Forgot Password ───
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email, captchaToken } = req.body;

    if (!email) {
        return errorResponse(res, 400, "Email is required");
    }

    if (!captchaToken) {
        return errorResponse(res, 400, "CAPTCHA verification is required");
    }

    // Verify reCAPTCHA
    try {
        const captchaRes = await axios.post(
            "https://www.google.com/recaptcha/api/siteverify",
            null,
            {
                params: {
                    secret: process.env.RECAPTCHA_SECRET_KEY,
                    response: captchaToken,
                },
            }
        );
        if (!captchaRes.data.success) {
            return errorResponse(res, 400, "CAPTCHA verification failed. Please try again.");
        }
    } catch {
        return errorResponse(res, 500, "CAPTCHA verification service unavailable");
    }

    // Find user (user or caregiver only, not admin)
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to avoid email enumeration
    const genericMsg = "If an account exists with this email, a password reset link has been sent.";

    if (!user || user.role === ROLES.ADMIN) {
        return successResponse(res, 200, genericMsg);
    }

    // Delete any existing tokens for this user
    await ResetToken.deleteMany({ userId: user._id });

    // Generate a secure token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    // Store hashed token with 30-min expiry
    await ResetToken.create({
        userId: user._id,
        tokenHash,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });

    // Build reset URL
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

    // Send email
    try {
        await sendPasswordResetEmail(user.email, user.name, resetUrl);
    } catch (emailError) {
        console.error("Failed to send reset email:", emailError);
        // Don't reveal the error to the user
    }

    return successResponse(res, 200, genericMsg);
});

// ─── Validate Reset Token ───
export const validateResetToken = asyncHandler(async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return errorResponse(res, 400, "Reset token is required");
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const resetToken = await ResetToken.findOne({
        tokenHash,
        expiresAt: { $gt: new Date() },
    });

    if (!resetToken) {
        return errorResponse(res, 400, "Invalid or expired reset token");
    }

    return successResponse(res, 200, "Token is valid");
});

// ─── Reset Password ───
export const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return errorResponse(res, 400, "Token and password are required");
    }

    if (password.length < 8) {
        return errorResponse(res, 400, "Password must be at least 8 characters long");
    }

    // Validate password strength
    if (!/[A-Z]/.test(password)) {
        return errorResponse(res, 400, "Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
        return errorResponse(res, 400, "Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
        return errorResponse(res, 400, "Password must contain at least one number");
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const resetToken = await ResetToken.findOne({
        tokenHash,
        expiresAt: { $gt: new Date() },
    });

    if (!resetToken) {
        return errorResponse(res, 400, "Invalid or expired reset token");
    }

    const user = await User.findById(resetToken.userId);
    if (!user) {
        return errorResponse(res, 404, "User not found");
    }

    // Hash and set the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Update authProvider if user was Google-only
    if (user.authProvider === "google") {
        user.authProvider = "both";
    }

    // Reset failed login attempts
    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    await user.save();

    // Invalidate all tokens for this user (single-use)
    await ResetToken.deleteMany({ userId: user._id });

    return successResponse(res, 200, "Password updated successfully. Please login with your new password.");
});
