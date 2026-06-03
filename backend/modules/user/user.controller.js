import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import User from "./user.model.js";

export const updateProfile = asyncHandler(async (req, res) => {
    const { name, phone, profileImage, email } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
        return errorResponse(res, 404, "User not found");
    }

    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
        const existingEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
            return errorResponse(res, 400, "Email is already in use by another account");
        }
        user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    return successResponse(res, 200, "Profile updated successfully", { user });
});

// Set password for OAuth users
export const setPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    
    if (!password || password.length < 6) {
        return errorResponse(res, 400, "Password must be at least 6 characters long");
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        return errorResponse(res, 404, "User not found");
    }

    if (user.password) {
        return errorResponse(res, 400, "Password is already set. Please use change password functionality instead.");
    }

    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.default.hash(password, 10);
    user.password = hashedPassword;

    // Upgrade authProvider to "both" since user now has both Google and password
    if (user.authProvider === "google") {
        user.authProvider = "both";
    }

    await user.save();
    return successResponse(res, 200, "Password set successfully");
});
