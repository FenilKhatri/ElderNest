import { body, param } from "express-validator";

export const completeProfileValidator = [
    body("fullName")
        .notEmpty()
        .withMessage("Full name is required")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2-100 characters"),
    
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    
    body("contactNumber")
        .notEmpty()
        .withMessage("Contact number is required")
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Invalid Indian mobile number"),
    
    body("alternateContact")
        .optional({ values: "falsy" })
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Invalid alternate contact number"),
    
    body("gender")
        .notEmpty()
        .withMessage("Gender is required")
        .isIn(["male", "female", "other"])
        .withMessage("Invalid gender"),
    
    body("age")
        .notEmpty()
        .withMessage("Age is required")
        .toInt()
        .isInt({ min: 18, max: 80 })
        .withMessage("Age must be between 18-80"),
    
    body("experienceYears")
        .notEmpty()
        .withMessage("Experience is required")
        .toInt()
        .isInt({ min: 0, max: 60 })
        .withMessage("Experience must be between 0-60 years"),
    
    body("location.state")
        .notEmpty()
        .withMessage("State is required")
        .trim(),
    
    body("location.city")
        .notEmpty()
        .withMessage("City is required")
        .trim(),
    
    body("location.pincode")
        .notEmpty()
        .withMessage("Pincode is required")
        .matches(/^\d{6}$/)
        .withMessage("Pincode must be 6 digits"),
    
    body("location.fullAddress")
        .notEmpty()
        .withMessage("Full address is required")
        .trim()
        .isLength({ min: 10, max: 300 })
        .withMessage("Address must be between 10-300 characters"),
    
    body("bio")
        .notEmpty()
        .withMessage("Bio is required")
        .trim()
        .isLength({ min: 50, max: 1000 })
        .withMessage("Bio must be between 50-1000 characters"),
    
    body("servicesOffered")
        .notEmpty()
        .withMessage("Services are required")
        .isArray({ min: 1, max: 3 })
        .withMessage("Select 1-3 services")
        .custom((services) => {
            const uniqueServices = new Set(services);
            if (uniqueServices.size !== services.length) {
                throw new Error("Duplicate services not allowed");
            }
            return true;
        }),
    
    body("servicesOffered.*")
        .isMongoId()
        .withMessage("Invalid service ID"),
    
    body("pricing.hourlyRate")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Hourly rate must be a positive number"),
    
    body("pricing.dailyRate")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Daily rate must be a positive number"),
    
    body("pricing.monthlyRate")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Monthly rate must be a positive number"),
    
    body("languages")
        .notEmpty()
        .withMessage("Languages are required")
        .isArray({ min: 1 })
        .withMessage("Select at least one language"),
    
    body("certifications")
        .optional()
        .isArray()
        .withMessage("Certifications must be an array"),
];

export const updateAvailabilityValidator = [
    body("blocks")
        .notEmpty()
        .withMessage("Blocks array is required")
        .isArray()
        .withMessage("Blocks must be an array"),
    
    body("blocks.*.dayOfWeek")
        .notEmpty()
        .withMessage("dayOfWeek is required")
        .isInt({ min: 0, max: 6 })
        .withMessage("dayOfWeek must be between 0 (Sun) and 6 (Sat)"),
    
    body("blocks.*.startTime")
        .notEmpty()
        .withMessage("Start time is required")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Invalid time format (HH:MM)"),
    
    body("blocks.*.endTime")
        .notEmpty()
        .withMessage("End time is required")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Invalid time format (HH:MM)"),
        
    body("blocks.*.slotDuration")
        .notEmpty()
        .withMessage("Slot duration is required")
        .isInt({ min: 15, max: 480 })
        .withMessage("Slot duration must be between 15 and 480 minutes"),
];

export const getCaregiverByIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid caregiver ID"),
];
