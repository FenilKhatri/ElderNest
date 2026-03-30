import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import AppError from "../utils/AppError.js";

// Register
export const registerUserService = async ({ name, email, phone, password }) => {
    if (!name || !email || !phone || !password) throw new AppError("All fields are required!", 400);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError("User already exists", 400);
    }

    // normalize input
    const normalizedName = String(name || "").trim();
    const normalizedEmail = String(email || "").trim();
    const normalizedPhone = String(phone || "").trim();
    const normalizedPassword = String(password || "").trim();

    const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

    const user = await User.create({
        name: normalizedName,
        email: normalizedEmail,
        phone: normalizedPhone,
        password: hashedPassword,
    });
    return user;
};

// Login
export const loginUserService = async (res, { email, password } = {}) => {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError("Invalid credentials", 401);
    }

    const token = generateToken(user);

    user.password = undefined;
    return { user, token };
};