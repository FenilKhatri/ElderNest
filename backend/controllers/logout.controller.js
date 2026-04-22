import { clearAuthCookie } from "../utils/cookie.utils.js";
import { successResponse } from "../utils/responseHandler.utils.js";

export const logout = (req, res) => {
    clearAuthCookie(res);
    return successResponse(res, 200, "Logout successful!");
};