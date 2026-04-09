import { errorResponse } from "../utils/responseHandler";

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return errorResponse(res, 403, "Access denied");
        }
        next();
    };
};