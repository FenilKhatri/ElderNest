import { errorResponse } from "../utils/responseHandler.js";

export const validateRegister = (req, res, next) => {
    let { name, email, phone, password } = req.body;

    // Trim inputs
    name = name?.trim();
    email = email?.trim().toLowerCase();
    phone = phone?.trim();
    password = password?.trim();

    // Required fields
    if (!name || !email || !phone || !password) {
        return errorResponse(res, 400, "All fields are required!");
    }
    
    // Input length validation
    if (name.length > 50) return errorResponse(res, 400, "Name must be less than 50 chars.")
    if (email.length > 100) return errorResponse(res, 400, "Email must be less then 100 chars.");

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
    
    // Phone validation (India: 10 digits, starts with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        return errorResponse(res, 400, "Invalid phone number");
    }

    // Weak Passwords
    const weakPasswords = ["123456", "password", "qwerty"];
    if (weakPasswords.includes(password)) {
        return errorResponse(res, 400, "Password is too weak");
    }
    
    // Password strength validation
    const passwordRegex = /^([A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(){}[\]\/+\-*]).{5,}$/;
    if (!passwordRegex.test(password)) {
        return errorResponse(
            res,
            400,
            "Password must contain uppercase, lowercase, and a number"
        );
    }

    next();
};

export const validateLogin = (req, res, next) => {
    let { email, password } = req.body;

    // Trim fields
    email = email?.trim().toLowerCase();
    password = password?.trim();

    // Required fields
    if (!email || !password) {
        return errorResponse(res, 400, "All fields are required!");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return errorResponse(res, 400, "Invalid email format");
    }

    next();
}