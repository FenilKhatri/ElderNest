import bcrypt from "bcrypt";
import { LOCK_TIME, MAX_FAILED_ATTEMPTS, ROLES } from "../utils/constants.js";
import User from "../models/user.model.js";

// Register
export const createUser = async (data) => {
    const { name, email, phone, password } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: ROLES.USER,
    });

    return user;
};

// Login
export const existingUser = async (data) => {
    const { email, password } = data;

    const user = await User.findOne({ email }).select("+password +role").lean();
    if (!user) {
        throw new Error("User not exists!");
    }

    if(user.lockUntil && user.lockUntil > Date.now()) {
        const error = new Error("Account is locked. Try again later!");
        error.statusCode = 403;
        throw error;
    };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        user.failedLoginAttempts += 1;

        if (user.failedLoginAttempts !== 0 || user.lockUntil !== null) {
            user.failedLoginAttempts = 0;
            user.lockUntil = null;
        }
        
        await user.save();
        throw new Error("Invalid credentials");
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    return user;
};