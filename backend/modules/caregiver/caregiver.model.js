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
        bio: {
            type: String,
            trim: true,
            default: "",
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },

        age: {
            type: Number,
            min: 18,
        },

        experienceYears: {
            type: Number,
            default: 0,
        },

        // Skills & Languages
        skills: {
            type: [String],
            default: [],
        },

        languages: {
            type: [String],
            default: ["English"],
        },

        // Pricing
        hourlyRate: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Location
        location: {
            city: {
                type: String,
                trim: true,
            },
            state: {
                type: String,
                trim: true,
            },
            country: {
                type: String,
                default: "India",
            },
        },

        // Documents
        documents: {
            aadhar: String,
            idProof: String,
            certificates: [String],
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

        // Availability
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
                from: String,
                to: String, 
            },
        ],

        profileCompleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Caregiver", caregiverSchema);