import mongoose from "mongoose";

const caregiverSchema = new mongoose.Schema(
    {
        // Link to User
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },

        // Basic Profile
        fullName: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        contactNumber: {
            type: String,
            trim: true,
        },
        alternateContact: {
            type: String,
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        age: {
            type: Number,
            min: 18,
            max: 80,
        },
        experienceYears: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Profile Image
        profileImage: {
            type: String,
            default: "",
        },

        // Location Details
        location: {
            state: {
                type: String,
                trim: true,
            },
            city: {
                type: String,
                trim: true,
            },
            pincode: {
                type: String,
                trim: true,
            },
            fullAddress: {
                type: String,
                trim: true,
            },
            country: {
                type: String,
                default: "India",
            },
        },

        // Services Offered (max 3)
        servicesOffered: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Service",
                }
            ],
            validate: {
                validator: function (v) {
                    return v.length <= 3;
                },
                message: "Cannot select more than 3 services",
            },
            default: [],
        },

        // Skills & Languages
        languages: {
            type: [String],
            default: [],
        },

        // Certifications
        certifications: {
            type: [String],
            default: [],
        },

        // Pricing
        pricing: {
            hourlyRate: {
                type: Number,
                min: 0,
            },
            dailyRate: {
                type: Number,
                min: 0,
            },
            monthlyRate: {
                type: Number,
                min: 0,
            },
        },

        // Availability Timing
        availableTiming: {
            type: String,
            enum: ["morning", "afternoon", "evening", "night", "full-day", "flexible"],
        },

        // Availability Schedule
        availability: [
            {
                day: {
                    type: String,
                    enum: [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                    ],
                },
                slots: [
                    {
                        startTime: String,
                        endTime: String,
                        isBooked: {
                            type: Boolean,
                            default: false,
                        },
                    },
                ],
            },
        ],

        // Documents
        documents: {
            aadharCard: String,
            idProof: String,
            certificates: [String],
            policeClearance: String,
        },

        // Rating System
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalReviews: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Status Control
        isActive: {
            type: Boolean,
            default: true,
        },
        profileCompleted: {
            type: Boolean,
            default: false,
        },
        profileApprovalStatus: {
            type: String,
            enum: ["pending", "approved", "rejected", "changes-required"],
            default: "pending",
        },
        adminFeedback: {
            type: String,
            trim: true,
        },

        // Total Bookings
        totalBookings: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Caregiver", caregiverSchema);