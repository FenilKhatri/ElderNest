import mongoose from "mongoose";
import { CAREGIVER_STATUSES } from "../../common/utils/constants.js";

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

        profileImage: {
            type: String,
            default: "",
        },

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

        skills: {
            type: [String],
            default: [],
        },

        languages: {
            type: [String],
            default: [],
        },

        certifications: {
            type: [String],
            default: [],
        },

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

        availableTiming: {
            type: String,
            enum: ["morning", "afternoon", "evening", "night", "full-day", "flexible"],
        },

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
                careTypes: {
                    type: [String],
                    enum: ["hourly", "part-time", "full-time", "live-in", "emergency"],
                    default: [],
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

        documents: {
            aadharCard: String,
            idProof: String,
            certificates: [String],
            policeClearance: String,
        },

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
            enum: [...Object.values(CAREGIVER_STATUSES), "changes-required"],
            default: CAREGIVER_STATUSES.PENDING,
        },
        onboardingStage: {
            type: String,
            enum: [
                "pending_account",
                "account_approved",
                "verification_pending",
                "verification_changes",
                "active",
                CAREGIVER_STATUSES.REJECTED,
            ],
            default: "pending_account",
            index: true,
        },
        isPublished: {
            type: Boolean,
            default: false,
            index: true,
        },
        verificationSubmittedAt: {
            type: Date,
            default: null,
        },
        verificationInfo: {
            type: String,
            trim: true,
            default: "",
        },
        adminFeedback: {
            type: String,
            trim: true,
        },

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