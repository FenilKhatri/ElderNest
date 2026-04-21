import { clearAuthCookie } from "../utils/cookie.utils.js";

export const logout = (req, res) => {
    clearAuthCookie(res);
    return successResponse(res, 200, "Logout successful!");
};