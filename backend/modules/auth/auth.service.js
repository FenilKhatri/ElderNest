import bcrypt from "bcrypt";
import User from "../user/user.model.js";
import { ROLES, LOCK_TIME } from "../../common/utils/constants.js";
import { AppError } from "../../common/utils/appError.js";

// Registration Logic
export const createUser = async (data) => {
    const { name, email, phone, password } = data;

    const existing = await User.findOne({ email });
    if (existing) {
        throw new AppError("User already exists!", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: ROLES.USER,
    });

    return user;
};

// Login Logic
export const existingUser = async (data) => {
    const { email, password } = data;

    const user = await User.findOne({ email }).select("+password +role");

    if (!user) {
        throw new AppError("User does not exist!", 404);
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
        throw new AppError("Account is locked. Try again later!", 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        user.failedLoginAttempts += 1;

        // Lock account after failed attempts
        if (user.failedLoginAttempts >= 3) {
            user.lockUntil = Date.now() + LOCK_TIME;
        }

        await user.save();

        throw new AppError("Invalid credentials!", 401);
    }

    // Reset login attempts on success
    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    await user.save();

    return user;
};