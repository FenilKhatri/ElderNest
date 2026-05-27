import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import User from "./user.model.js";

// Update profile
export const updateProfile = asyncHandler(async (req, res) => {
    const { name, phone, profileImage } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
        return errorResponse(res, 404, "User not found");
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    return successResponse(res, 200, "Profile updated successfully", { user });
});
