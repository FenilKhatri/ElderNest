import mongoose from "mongoose";
import { REVIEW_STATUS } from "../../common/utils/constants.js";

const reviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        caregiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Caregiver",
            index: true,
        },
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            index: true,
        },
        // Optional: linking review to a specific booking (for verified caregiver reviews)
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
        suggestions: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isReported: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: Object.values(REVIEW_STATUS),
            default: REVIEW_STATUS.APPROVED, 
        },
        replies: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                comment: {
                    type: String,
                    required: true,
                    trim: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Ensure at least one target is provided
reviewSchema.pre("validate", function () {
    if (!this.caregiverId && !this.serviceId) {
        throw new Error("Review must be associated with a caregiver or a service.");
    } else if (this.caregiverId && this.serviceId) {
        throw new Error("Review cannot be associated with both caregiver and service.");
    }
});

// Prevent duplicate reviews on same booking
reviewSchema.index(
    { userId: 1, bookingId: 1 },
    { unique: true, partialFilterExpression: { bookingId: { $exists: true, $type: "objectId" } } }
);

// Prevent duplicate reviews on same service by same user
reviewSchema.index(
    { userId: 1, serviceId: 1 },
    { unique: true, partialFilterExpression: { serviceId: { $exists: true, $type: "objectId" } } }
);

// Prevent duplicate reviews on same caregiver by same user (if no bookingId provided)
reviewSchema.index(
    { userId: 1, caregiverId: 1 },
    { unique: true, partialFilterExpression: { bookingId: { $exists: false }, caregiverId: { $exists: true, $type: "objectId" } } }
);

export default mongoose.model("Review", reviewSchema);
