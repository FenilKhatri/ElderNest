import { body, param } from "express-validator";

export const createBookingValidator = [
    body("caregiverId")
        .notEmpty()
        .withMessage("Caregiver ID is required")
        .isMongoId()
        .withMessage("Invalid caregiver ID"),
    
    body("serviceId")
        .notEmpty()
        .withMessage("Service ID is required")
        .isMongoId()
        .withMessage("Invalid service ID"),
    
    body("patientName")
        .notEmpty()
        .withMessage("Patient name is required")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Patient name must be between 2-100 characters"),
    
    body("patientAge")
        .notEmpty()
        .withMessage("Patient age is required")
        .isInt({ min: 1, max: 150 })
        .withMessage("Patient age must be between 1-150"),
    
    body("disease")
        .notEmpty()
        .withMessage("Disease/condition is required")
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage("Disease description must be between 2-200 characters"),
    
    body("patientId")
        .optional()
        .isMongoId()
        .withMessage("Invalid patient ID"),

    body("durationType")
        .optional()
        .isIn(["hourly", "daily", "long-term"])
        .withMessage("Invalid duration type"),

    body("careType")
        .notEmpty()
        .withMessage("Care type is required")
        .isIn(["full-time", "part-time", "live-in", "hourly", "emergency"])
        .withMessage("Invalid care type"),
    
    body("contactNumber")
        .notEmpty()
        .withMessage("Contact number is required")
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Invalid Indian mobile number"),
    
    body("alternateContact")
        .optional()
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Invalid alternate contact number"),
    
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    
    body("address.street")
        .notEmpty()
        .withMessage("Street address is required")
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage("Street address must be between 5-200 characters"),
    
    body("address.city")
        .notEmpty()
        .withMessage("City is required")
        .trim(),
    
    body("address.state")
        .notEmpty()
        .withMessage("State is required")
        .trim(),
    
    body("address.pincode")
        .notEmpty()
        .withMessage("Pincode is required")
        .matches(/^\d{6}$/)
        .withMessage("Pincode must be 6 digits"),
    
    body("emergencyContact.name")
        .notEmpty()
        .withMessage("Emergency contact name is required")
        .trim(),
    
    body("emergencyContact.phone")
        .notEmpty()
        .withMessage("Emergency contact phone is required")
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Invalid emergency contact number"),
    
    body("emergencyContact.relation")
        .notEmpty()
        .withMessage("Emergency contact relation is required")
        .trim(),
    
    body("bookingDate")
        .notEmpty()
        .withMessage("Booking date is required")
        .isISO8601()
        .withMessage("Invalid date format")
        .custom((value) => {
            const bookingDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (bookingDate < today) {
                throw new Error("Booking date cannot be in the past");
            }
            return true;
        }),
    
    body("timeSlot.startTime")
        .notEmpty()
        .withMessage("Start time is required")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Invalid time format (HH:MM)"),
    
    body("timeSlot.endTime")
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Invalid time format (HH:MM)")
        .custom((endTime, { req }) => {
            if (req.body.timeSlot?.startTime && endTime) {
                const start = req.body.timeSlot.startTime.split(":").map(Number);
                const end = endTime.split(":").map(Number);
                const startMinutes = start[0] * 60 + start[1];
                const endMinutes = end[0] * 60 + end[1];
                if (endMinutes <= startMinutes) {
                    throw new Error("End time must be after start time");
                }
            }
            return true;
        }),
    
    body("notes")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Notes cannot exceed 1000 characters"),
];

export const updateBookingStatusValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid booking ID"),
    
    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["pending", "accepted", "rejected", "in-progress", "completed", "cancelled"])
        .withMessage("Invalid status"),
    
    body("rejectionReason")
        .if(body("status").equals("rejected"))
        .notEmpty()
        .withMessage("Rejection reason is required when rejecting booking")
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage("Rejection reason must be between 10-500 characters"),
    
    body("cancellationReason")
        .if(body("status").equals("cancelled"))
        .notEmpty()
        .withMessage("Cancellation reason is required when cancelling booking")
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage("Cancellation reason must be between 10-500 characters"),
];

export const getBookingByIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid booking ID"),
];
