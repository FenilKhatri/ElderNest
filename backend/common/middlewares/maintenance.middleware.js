import Settings from "../../modules/settings/settings.model.js";
import { errorResponse } from "../utils/responseHandler.utils.js";
import jwt from "jsonwebtoken";
import User from "../../modules/user/user.model.js";

const EXEMPT_PATHS = [
    "/health",
    "/settings",
    "/auth/admin-login",
    "/auth/login",
    "/auth/google",
    "/auth/caregiver-login",
    "/auth/register",
    "/auth/caregiver-register",
    "/auth/logout",
    "/auth/me",
];

const getTokenFromRequest = (req) => {
    if (req.headers.authorization?.startsWith("Bearer")) {
        return req.headers.authorization.split(" ")[1];
    }
    return req.cookies?.token || null;
};

let cachedSettings = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

/** Block non-admin API traffic when maintenance mode is on */
export const maintenanceMiddleware = async (req, res, next) => {
    try {
        const now = Date.now();
        if (!cachedSettings || (now - lastFetchTime) > CACHE_TTL) {
            cachedSettings = await Settings.findOne().lean();
            lastFetchTime = now;
        }

        if (!cachedSettings?.maintenanceMode) {
            return next();
        }

        const path = req.path || "";
        if (EXEMPT_PATHS.some((p) => path === p || path.startsWith(`${p}/`))) {
            return next();
        }

        const token = getTokenFromRequest(req);
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id).select("role");
                if (user?.role === "admin") {
                    return next();
                }
            } catch {
                // ignore invalid token
            }
        }

        return errorResponse(
            res,
            503,
            "ElderNest is under maintenance. Please check back soon."
        );
    } catch (err) {
        return next(err);
    }
};
