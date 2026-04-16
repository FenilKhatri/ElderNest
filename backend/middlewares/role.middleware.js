import { errorResponse } from "../utils/response.handler.js";

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return errorResponse(res, 403, "Access denied");
        }
        next();
    };
};