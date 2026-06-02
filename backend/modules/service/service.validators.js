import { body, param } from "express-validator";

const categories = [
    "personal-care",
    "medical-care",
    "companionship",
    "household-help",
    "specialized-care",
    "emergency-care",
];

const serviceModeValues = ["home-visit", "online", "both"];
const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export const createServiceValidator = [
    body("title")
        .notEmpty()
        .withMessage("Service title is required")
        .trim()
        .isLength({ min: 2, max: 100 }),

    body("category").notEmpty().isIn(categories),

    body("description")
        .notEmpty()
        .trim()
        .isLength({ min: 10, max: 5000 }),

    body("shortDescription").optional().trim().isLength({ max: 500 }),
    body("coverImage").optional().trim(),
    body("image").optional().trim(),
    body("images").optional().isArray(),
    body("duration").optional().isFloat({ min: 0 }),
    body("price").optional().isFloat({ min: 0 }),
    body("serviceMode").optional().isIn(serviceModeValues),
    body("features").optional().isArray(),
    body("benefits").optional().isArray(),
    body("caregivers").optional().isArray(),
    body("isFeatured").optional().isBoolean(),
    body("isActive").optional().isBoolean(),
    body("isDraft").optional().isBoolean(),
    ...days.map((day) =>
        body(`availability.${day}`).optional().isBoolean()
    ),
];

export const updateServiceValidator = [
    param("id").isMongoId(),
    body("title").optional().trim().isLength({ min: 2, max: 100 }),
    body("category").optional().isIn(categories),
    body("description").optional().trim().isLength({ min: 10, max: 5000 }),
    body("shortDescription").optional().trim().isLength({ max: 1000 }),
    body("coverImage").optional().trim(),
    body("image").optional().trim(),
    body("images").optional().isArray(),
    body("duration").optional().isFloat({ min: 0 }),
    body("price").optional().isFloat({ min: 0 }),
    body("serviceMode").optional().isIn(serviceModeValues),
    body("features").optional().isArray(),
    body("benefits").optional().isArray(),
    body("caregivers").optional().isArray(),
    body("isFeatured").optional().isBoolean(),
    body("isActive").optional().isBoolean(),
    body("isDraft").optional().isBoolean(),
    ...days.map((day) =>
        body(`availability.${day}`).optional().isBoolean()
    ),
];

export const deleteServiceValidator = [
    param("id").isMongoId().withMessage("Invalid service ID"),
];
