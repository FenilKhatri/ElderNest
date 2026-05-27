import { body, param } from "express-validator";

export const createServiceValidator = [
    body("title")
        .notEmpty()
        .withMessage("Service title is required")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Service title must be between 2-100 characters"),
    
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
    
    body("description")
        .notEmpty()
        .withMessage("Description is required")
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage("Description must be between 10-500 characters"),
    
    body("image")
        .optional()
        .trim(),
];

export const updateServiceValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid service ID"),
    
    body("title")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Service title must be between 2-100 characters"),
    
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
    
    body("description")
        .optional()
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage("Description must be between 10-500 characters"),
    
    body("image")
        .optional()
        .trim(),
    
    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean"),
];

export const deleteServiceValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid service ID"),
];
