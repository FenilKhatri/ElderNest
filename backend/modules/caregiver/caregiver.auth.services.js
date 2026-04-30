import bcrypt from "bcrypt";
import { LOCK_TIME, MAX_FAILED_ATTEMPTS, ROLES } from "../../common/utils/constants.js";
import User from "../user/user.model.js";
import Caregiver from "./caregiver.model.js";
import { AppError } from "../../common/utils/appError.js";

// Register
export const createCaregiver = async (data) => {
    const { name, email, phone, password } = data;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) throw new AppError("User already exists!", 400);

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user (auth layer)
    const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: ROLES.CAREGIVER,
        status: "pending",
        isApproved: false,
    });

    // 4. Create caregiver profile
    await Caregiver.create({
        userId: user._id,
    });

    return user;
};

// Login
export const existingCaregiver = async (data) => {
    const { email, password } = data;

    // 1. Find user
    const user = await User.findOne({ email }).select("+password +role");

    if (!user || user.role !== ROLES.CAREGIVER) {
        throw new AppError("Caregiver not found!", 404);
    }

    // 2. Check account lock
    if (user.lockUntil && user.lockUntil > Date.now()) {
        const error = new AppError("Account is locked. Try again later!", 403);
        error.statusCode = 403;
        throw error;
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    // WRONG PASSWORD
    if (!isMatch) {
        user.failedLoginAttempts += 1;

        if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
            user.lockUntil = Date.now() + LOCK_TIME;
        }

        await user.save();
        throw new AppError("Invalid credentials", 401);
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    return user;
};