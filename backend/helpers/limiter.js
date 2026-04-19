import { createLimiter } from "./rate.limiter.js";

// General API limiter
export const apiLimiter = createLimiter(100);

// Login/Register limiter (strict)
export const authLimiter = createLimiter(10);