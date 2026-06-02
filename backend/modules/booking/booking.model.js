import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        // References
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

        // Patient Information
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
        careType: {
            type: String,
            required: true,
            enum: ["full-time", "part-time", "live-in", "hourly", "emergency"],
        },

        // Contact Details
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

        // Address
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

        // Emergency Contact
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

        // Booking Schedule
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

        // Additional Information
        notes: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
        specialRequirements: {
            type: [String],
            default: [],
        },

        // Pricing
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        duration: {
            type: Number, // in hours
            required: true,
        },
        durationType: {
            type: String,
            enum: ["hourly", "daily", "long-term"],
            default: "hourly",
        },

        // Status Management
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "in-progress", "completed", "cancelled"],
            default: "pending",
            index: true,
        },
        
        // Cancellation
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

        // Rejection
        rejectionReason: {
            type: String,
            trim: true,
        },

        // Completion
        completedAt: {
            type: Date,
        },
        
        // Payment
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "refunded", "failed", "completed"],
            default: "pending",
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

// Generate unique booking ID before saving
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

// Compound unique index to prevent overlapping double bookings
bookingSchema.index(
    { caregiverId: 1, bookingDate: 1, "timeSlot.startTime": 1, "timeSlot.endTime": 1 },
    { 
        unique: true,
        partialFilterExpression: { status: { $in: ["pending", "accepted", "in-progress"] } }
    }
);

export default mongoose.model("Booking", bookingSchema);
