import { asyncHandler } from "../helpers/async.helper";
import Caregiver from "../models/caregiver.model";
import User from "../models/user.model";

export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // caregiver logic
    if (user.role === "caregiver") {
        const caregiver = await Caregiver.findOne({ userId: user._id });

        return res.json({
            user,
            caregiver,
        });
    }

    // normal user/admin
    return res.json({ user });
});