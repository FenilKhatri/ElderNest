import { body, validationResult } from "express-validator";

export const validatePatient = [
    body("name").if((value, { req }) => req.body.status === "published").trim().notEmpty().withMessage("Patient name is required"),
    body("dob").if((value, { req }) => req.body.status === "published").isISO8601().toDate().withMessage("Valid Date of Birth is required"),
    body("gender").if((value, { req }) => req.body.status === "published").isIn(["male", "female", "other"]).withMessage("Valid gender is required"),
    body("bloodGroup").optional({ checkFalsy: true }).trim(),
    body("height").optional({ checkFalsy: true }).trim(),
    body("weight").optional({ checkFalsy: true }).trim(),
    body("primaryLanguage").optional({ checkFalsy: true }).trim(),
    body("relationship").if((value, { req }) => req.body.status === "published").trim().notEmpty().withMessage("Relationship is required"),
    
    // Address
    body("address.street").optional({ checkFalsy: true }).trim(),
    body("address.city").optional({ checkFalsy: true }).trim(),
    body("address.state").optional({ checkFalsy: true }).trim(),
    body("address.pincode").optional({ checkFalsy: true }).trim(),

    // Medical
    body("medicalConditions").optional({ checkFalsy: true }).isArray(),
    body("allergies").optional({ checkFalsy: true }).isArray(),
    body("currentMedications").optional({ checkFalsy: true }).isArray(),
    body("mobilityStatus").optional({ checkFalsy: true }).trim(),
    body("dietaryRestrictions").optional({ checkFalsy: true }).trim(),
    body("chronicDiseases").optional({ checkFalsy: true }).isArray(),
    body("pastSurgeries").optional({ checkFalsy: true }).isArray(),
    body("primaryDoctor").optional({ checkFalsy: true }).trim(),
    body("doctorContact").optional({ checkFalsy: true }).trim(),
    body("insuranceProvider").optional({ checkFalsy: true }).trim(),
    body("insuranceNumber").optional({ checkFalsy: true }).trim(),
    body("notes").optional({ checkFalsy: true }).trim(),

    // Emergency Contact
    body("emergencyContact.contactName").if((value, { req }) => req.body.status === "published").trim().notEmpty().withMessage("Emergency contact name is required"),
    body("emergencyContact.relationship").if((value, { req }) => req.body.status === "published").trim().notEmpty().withMessage("Emergency contact relationship is required"),
    body("emergencyContact.primaryPhone").if((value, { req }) => req.body.status === "published").trim().notEmpty().withMessage("Emergency contact primary phone is required"),
    body("emergencyContact.alternatePhone").optional({ checkFalsy: true }).trim(),
    body("emergencyContact.email").optional({ checkFalsy: true }).isEmail().withMessage("Valid emergency email is required"),
    body("emergencyContact.address").optional({ checkFalsy: true }).trim(),
];

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg).join(", ");
        return res.status(400).json({ success: false, message: errorMessages, errors: errors.array() });
    }
    next();
};
