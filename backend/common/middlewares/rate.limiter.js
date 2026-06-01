import rateLimit from "express-rate-limit";

const TWO_MINUTES_MS = 2 * 60 * 1000;

export const createLimiter = (maxRequests, windowMs = TWO_MINUTES_MS) => {
    return rateLimit({
        windowMs,
        max: maxRequests,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message: "Too many requests. Please try again in 2 minutes.",
        },
    });
};