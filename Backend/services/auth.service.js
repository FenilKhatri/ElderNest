import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import AppError from "../utils/AppError.js";
import { MESSAGES, STATUS_CODES } from "../utils/constants.js";

// Register
export const registerUserService = async ({ name, email, phone, password }) => {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError(MESSAGES.ALREADY_EXISTS, STATUS_CODES.BAD_REQUEST);
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
export const loginUserService = async ({ email, password } = {}) => {

    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new AppError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.BAD_REQUEST);


    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) throw new AppError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.BAD_REQUEST);

    const token = generateToken(user);

    user.password = undefined;
    return { user, token };
};