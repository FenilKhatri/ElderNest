import { asyncHandler } from "../helpers/async.helper.js";
import { createUser, existingUser } from "../services/auth.services.js";
import { ROLES } from "../utils/constants.js";
import { setAuthCookie } from "../utils/cookie.utils.js";
import generateToken from "../utils/generateToken.utils.js";
import { successResponse, errorResponse } from "../utils/responseHandler.utils.js";
import User from "../models/user.model.js";
import admin from "../config/firebaseAdmin.js";

// Register
export const register = asyncHandler(async (req, res) => {
    const user = await createUser(req.body);

    const token = generateToken(user);

    setAuthCookie(res, token);

    return successResponse(res, 201, "User registered successfully!", {
        user,
    });
});

// Login
export const login = asyncHandler(async (req, res) => {
    const user = await existingUser(req.body);

    const token = generateToken(user);

    setAuthCookie(res, token);

    return successResponse(res, 200, "Login successful!", {
        user,
    });
});