import { errorResponse } from "../../common/utils/responseHandler.utils.js";

// Registration Validation
export const validateRegister = (req, res, next) => {
    let { name, email, phone, password } = req.body;

    // Normalize inputs
    name = name?.trim();
    email = email?.trim().toLowerCase();
    phone = phone?.trim();
    password = password?.trim();

    // Required fields
    if (!name || !email || !phone || !password) {
        return errorResponse(res, 400, "All fields are required!");
    }

    // Length checks
    if (name.length > 50) {
        return errorResponse(res, 400, "Name must be less than 50 characters");
    }

    if (email.length > 100) {
        return errorResponse(res, 400, "Email must be less than 100 characters");
    }

    // Name validation
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(name)) {
        return errorResponse(res, 400, "Invalid name format");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return errorResponse(res, 400, "Invalid email format");
    }

    // Phone validation (India)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        return errorResponse(res, 400, "Invalid phone number");
    }

    // Weak password check
    const weakPasswords = ["123456", "password", "qwerty"];
    if (weakPasswords.includes(password)) {
        return errorResponse(res, 400, "Password is too weak");
    }

    // Strong password rule
    const passwordRegex =
        /^([A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(){}[\]\/+\-*]).{5,}$/;

    if (!passwordRegex.test(password)) {
        return errorResponse(
            res,
            400,
            "Password must start with uppercase and include lowercase, number, and special character"
        );
    }

    req.body = { name, email, phone, password };

    next();
};

// Login Validation
export const validateLogin = (req, res, next) => {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
        return errorResponse(res, 400, "All fields are required!");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return errorResponse(res, 400, "Invalid email format");
    }

    req.body = { email, password };

    next();
};