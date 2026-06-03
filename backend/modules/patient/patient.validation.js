import { body, validationResult } from "express-validator";

export const validatePatient = [
    body("name").trim().notEmpty().withMessage("Patient name is required"),
    body("dob").isISO8601().toDate().withMessage("Valid Date of Birth is required"),
    body("gender").isIn(["male", "female", "other"]).withMessage("Valid gender is required"),
    body("bloodGroup").optional().trim(),
    body("height").optional().trim(),
    body("weight").optional().trim(),
    body("primaryLanguage").optional().trim(),
    body("relationship").trim().notEmpty().withMessage("Relationship is required"),
    
    // Address
    body("address.street").optional().trim(),
    body("address.city").optional().trim(),
    body("address.state").optional().trim(),
    body("address.pincode").optional().trim(),

    // Medical
    body("medicalConditions").optional().isArray(),
    body("allergies").optional().isArray(),
    body("currentMedications").optional().isArray(),
    body("mobilityStatus").optional().trim(),
    body("dietaryRestrictions").optional().trim(),
    body("chronicDiseases").optional().isArray(),
    body("pastSurgeries").optional().isArray(),
    body("primaryDoctor").optional().trim(),
    body("doctorContact").optional().trim(),
    body("insuranceProvider").optional().trim(),
    body("insuranceNumber").optional().trim(),
    body("notes").optional().trim(),

    // Emergency Contact
    body("emergencyContact.contactName").trim().notEmpty().withMessage("Emergency contact name is required"),
    body("emergencyContact.relationship").trim().notEmpty().withMessage("Emergency contact relationship is required"),
    body("emergencyContact.primaryPhone").trim().notEmpty().withMessage("Emergency contact primary phone is required"),
    body("emergencyContact.alternatePhone").optional().trim(),
    body("emergencyContact.email").optional().isEmail().withMessage("Valid emergency email is required"),
    body("emergencyContact.address").optional().trim(),
];

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg).join(", ");
        return res.status(400).json({ success: false, message: errorMessages, errors: errors.array() });
    }
    next();
};
