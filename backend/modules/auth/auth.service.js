import bcrypt from "bcrypt";
import User from "../user/user.model.js";
import { ROLES, LOCK_TIME, MAX_FAILED_ATTEMPTS, CAREGIVER_STATUSES } from "../../common/utils/constants.js";
import { AppError } from "../../common/utils/appError.js";
import Caregiver from "../caregiver/caregiver.model.js";

// Registration Logic
export const createUser = async (data) => {
    const { name, email, phone, password } = data;

    const existing = await User.findOne({ email });
    if (existing) {
        throw new AppError("User already exists!", 400);
    }

    if (!password || typeof password !== "string") {
        throw new AppError("Password is required", 400);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch {
        throw new AppError("Invalid password format", 400);
    }

    const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: ROLES.USER,
        isApproved: true,
        status: "approved",
    });

    return user;
};

// Login Logic
export const existingUser = async (data) => {
    const { email, password } = data;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new AppError("User does not exist!", 404);
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
        throw new AppError("Account is locked. Try again later!", 403);
    }

    // Check if password exists (for OAuth users)
    if (!user.password || typeof user.password !== "string") {
        throw new AppError("Please login with Google", 400);
    }

    if (!password || typeof password !== "string") {
        throw new AppError("Invalid credentials!", 401);
    }

    let isMatch;
    try {
        isMatch = await bcrypt.compare(password, user.password);
    } catch {
        throw new AppError("Invalid credentials!", 401);
    }

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

    user.password = undefined;
    return user;
};

// Caregiver Registeration Logic
export const createCaregiver = async (data) => {
    const { name, email, phone, password } = data;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) throw new AppError("User already exists!", 400);

    // 2. Hash password
    if (!password || typeof password !== "string") {
        throw new AppError("Password is required", 400);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch {
        throw new AppError("Invalid password format", 400);
    }

    // 3. Create user (auth layer)
    const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: ROLES.CAREGIVER,
        status: CAREGIVER_STATUSES.PENDING,
        isApproved: false,
    });

    // 4. Create caregiver profile
    await Caregiver.create({
        userId: user._id,
    });

    return user;
};

// Caregiver Login Logic
export const existingCaregiver = async (data) => {
    const { email, password } = data;

    // 1. Find user
    const user = await User.findOne({ email }).select("+password");

    if (!user || user.role !== ROLES.CAREGIVER) {
        throw new AppError("Caregiver not found!", 404);
    }

    // 2. Check account lock
    if (user.lockUntil && user.lockUntil > Date.now()) {
        const error = new AppError("Account is locked. Try again later!", 403);
        error.statusCode = 403;
        throw error;
    }

    // Check if password exists (for OAuth users)
    if (!user.password || typeof user.password !== "string") {
        throw new AppError("Please login with Google", 400);
    }

    if (!password || typeof password !== "string") {
        throw new AppError("Invalid credentials", 401);
    }

    // 3. Compare password
    let isMatch;
    try {
        isMatch = await bcrypt.compare(password, user.password);
    } catch {
        throw new AppError("Invalid credentials", 401);
    }

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

    user.password = undefined;
    return user;
};