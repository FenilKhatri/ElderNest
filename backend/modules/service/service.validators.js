import { body, param } from "express-validator";

export const createServiceValidator = [
    body("name")
        .notEmpty()
        .withMessage("Service name is required")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Service name must be between 2-100 characters"),
    
    body("description")
        .notEmpty()
        .withMessage("Description is required")
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage("Description must be between 10-500 characters"),
    
    body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isIn([
            "personal-care",
            "medical-care",
            "companionship",
            "household-help",
            "specialized-care",
            "emergency-care",
        ])
        .withMessage("Invalid category"),
    
    body("basePrice")
        .notEmpty()
        .withMessage("Base price is required")
        .isFloat({ min: 0 })
        .withMessage("Base price must be a positive number"),
    
    body("duration")
        .notEmpty()
        .withMessage("Duration is required")
        .isInt({ min: 1 })
        .withMessage("Duration must be at least 1 hour"),
    
    body("features")
        .optional()
        .isArray()
        .withMessage("Features must be an array"),
    
    body("icon")
        .optional()
        .trim(),
];

export const updateServiceValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid service ID"),
    
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Service name must be between 2-100 characters"),
    
    body("description")
        .optional()
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage("Description must be between 10-500 characters"),
    
    body("category")
        .optional()
        .isIn([
            "personal-care",
            "medical-care",
            "companionship",
            "household-help",
            "specialized-care",
            "emergency-care",
        ])
        .withMessage("Invalid category"),
    
    body("basePrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Base price must be a positive number"),
    
    body("duration")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Duration must be at least 1 hour"),
    
    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean"),
    
    body("features")
        .optional()
        .isArray()
        .withMessage("Features must be an array"),
];

export const deleteServiceValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid service ID"),
];
