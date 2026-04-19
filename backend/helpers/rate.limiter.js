import rateLimit from "express-rate-limit";

export const createLimiter = (maxRequests, windowMs = 10 * 60 * 1000) => {
    return rateLimit({
        windowMs,
        max: maxRequests,
        message: {
            success: false,
            message: "Too many requests, please try again later!",
        },
    });
};