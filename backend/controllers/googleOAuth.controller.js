import admin from "../config/firebaseAdmin.js";
import Caregiver from "../models/caregiver.model.js";
import User from "../models/user.model.js";
import { ROLES } from "../utils/constants.js";
import { setAuthCookie } from "../utils/cookie.utils.js";
import generateToken from "../utils/generateToke.utils.js";
import { successResponse, errorResponse } from "../utils/responseHandler.utils.js";

export const googleAuthController = async (req, res) => {
    try {
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
                status: role === ROLES.USER ? "approved" : "pending",
            });
        }

        if (role === ROLES?.CAREGIVER) {
            let caregiver = await Caregiver.findOne({ userId: user._id });

            if (!caregiver) {
                return errorResponse(res, 404, "Caregiver not found!");
            }

            if (!user.isApproved) {
                return errorResponse(res, 403, "Awaiting admin approval");
            }
        }

        const jwtToken = generateToken(user._id, user.role);
        setAuthCookie(res, jwtToken);

        return successResponse(res, 200, "Login successful", { user });

    } catch (error) {
        console.error("Google Auth Error:", error);
        return errorResponse(res, 401, error.message || "Invalid Google token");
    }
};