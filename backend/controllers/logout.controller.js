import { successResponse } from "../utils/response.handler.js";

// Logout
export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    });

    return successResponse(res, 200, "Logout successful!");
};