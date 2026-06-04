import mongoose from "mongoose";
import { PAYMENT_STATUS, REFUND_STATUS, BOOKING_STATUS } from "../../common/utils/constants.js";

const bookingSchema = new mongoose.Schema(
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
            required: true,
            index: true,
        },
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
        },

        patientName: {
            type: String,
            required: true,
            trim: true,
        },
        patientAge: {
            type: Number,
            required: true,
            min: 1,
            max: 150,
        },
        disease: {
            type: String,
            required: true,
            trim: true,
        },
        serviceType: {
            type: String,
            required: true,
            enum: ["hourly", "part-time", "full-time", "live-in", "emergency"],
        },
        billingType: {
            type: String,
            required: true,
            enum: ["hourly", "daily", "monthly"],
        },

        contactNumber: {
            type: String,
            required: true,
            trim: true,
        },
        alternateContact: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        address: {
            street: {
                type: String,
                required: true,
                trim: true,
            },
            landmark: {
                type: String,
                trim: true,
            },
            city: {
                type: String,
                required: true,
                trim: true,
            },
            state: {
                type: String,
                required: true,
                trim: true,
            },
            pincode: {
                type: String,
                required: true,
                trim: true,
            },
        },

        emergencyContact: {
            name: {
                type: String,
                required: true,
                trim: true,
            },
            phone: {
                type: String,
                required: true,
                trim: true,
            },
            relation: {
                type: String,
                required: true,
                trim: true,
            },
        },

        bookingDate: {
            type: Date,
            required: true,
            index: true,
        },
        timeSlot: {
            startTime: {
                type: String,
                required: true,
            },
            endTime: {
                type: String,
                required: true,
            },
        },

        notes: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
        specialRequirements: {
            type: [String],
            default: [],
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number, 
            required: true,
            min: 1,
        },
        unitRate: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: Object.values(BOOKING_STATUS),
            default: BOOKING_STATUS.PENDING,
            index: true,
        },
        
        cancellationReason: {
            type: String,
            trim: true,
        },
        cancelledBy: {
            type: String,
            enum: ["user", "caregiver", "admin"],
        },
        cancelledAt: {
            type: Date,
        },

        rejectionReason: {
            type: String,
            trim: true,
        },

        completedAt: {
            type: Date,
        },
        
        paymentStatus: {
            type: String,
            enum: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.PAID, PAYMENT_STATUS.REFUNDED, PAYMENT_STATUS.FAILED, PAYMENT_STATUS.COMPLETED],
            default: PAYMENT_STATUS.PENDING,
        },
        refundStatus: {
            type: String,
            enum: [REFUND_STATUS.PENDING, REFUND_STATUS.APPROVED, REFUND_STATUS.REJECTED, REFUND_STATUS.PROCESSED, REFUND_STATUS.REFUNDED],
            default: REFUND_STATUS.PENDING,
        },
        paymentId: {
            type: String,
        },
        transactionId: {
            type: String,
        },
        razorpayOrderId: {
            type: String,
        },
        razorpayPaymentId: {
            type: String,
        },
        paymentReceiptUrl: {
            type: String,
        },
        bookingPdfUrl: {
            type: String,
        },
        paymentDate: {
            type: Date,
        },
        
        // Booking ID for receipt
        bookingId: {
            type: String,
            unique: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

bookingSchema.pre("save", async function () {
    if (!this.bookingId) {
        const count = await mongoose.model("Booking").countDocuments();
        this.bookingId = `BK${Date.now()}${String(count + 1).padStart(4, "0")}`;
    }
});

// Index for efficient queries
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ caregiverId: 1, status: 1 });
bookingSchema.index({ bookingDate: 1, status: 1 });

// Compound unique index to prevent overlapping double bookings for the same start time
bookingSchema.index(
    { caregiverId: 1, bookingDate: 1, "timeSlot.startTime": 1 },
    { 
        unique: true,
        partialFilterExpression: { status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.IN_PROGRESS] } }
    }
);

export default mongoose.model("Booking", bookingSchema);
