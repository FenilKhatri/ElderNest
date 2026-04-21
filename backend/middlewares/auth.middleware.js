import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorResponse } from "../utils/responseHandler.utils.js";

export const protect = async (req, res, next) => {
    try {
        const token = req?.cookies?.token;
        if (!token) {
            return errorResponse(res, 401, "Not authorized, no token");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return errorResponse(res, 401, "User not found");
        }

        req.user = {
            id: user._id,
            role: user.role,
            isApproved: user.isApproved,
            status: user.status,
        };

        next();
    } catch (error) {
        return errorResponse(res, 401, "Not authorized, token failed");
    }
};