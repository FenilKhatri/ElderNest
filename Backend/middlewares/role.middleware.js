import AppError from "../utils/AppError.js";

const roleLevels = {
    user: 1,
    caregiver: 2,
    admin: 3,
};

export const authorize = (minRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError("Not authenticated", 401));
        }

        const userLevel = roleLevels[req.user.role];
        const requiredLevel = roleLevels[minRole];

        if (userLevel < requiredLevel) {
            return next(new AppError("Access Denied", 403));
        }

        next();
    };
};