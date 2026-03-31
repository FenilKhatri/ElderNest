import AppError from "../utils/AppError.js";
import { MESSAGES, STATUS_CODES } from "../utils/constants.js";

const roleLevels = {
    user: 1,
    caregiver: 2,
    admin: 3,
};

export const authorize = (minRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED));
        }

        const userLevel = roleLevels[req.user.role];
        const requiredLevel = roleLevels[minRole];

        if (userLevel < requiredLevel) {
            return next(new AppError("Access Denied", STATUS_CODES.FORBIDDEN));
        }

        next();
    };
};