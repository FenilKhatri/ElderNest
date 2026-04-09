import rateLimit from "express-rate-limit";

// Rate limit
export const limiter = rateLimit({
    windowMs: 10 *60 * 1000, //10 min
    max: 100,
    message: {
        success: false,
        message: "Too many requests, please try again later!",
    }
})