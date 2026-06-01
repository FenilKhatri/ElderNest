import mongoose from "mongoose";

const careNoteSchema = new mongoose.Schema(
    {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            index: true,
        },
        caregiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Caregiver",
            required: true,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            trim: true,
            default: "Care Note",
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
        },
        vitals: {
            type: String,
            trim: true,
        },
        medications: {
            type: String,
            trim: true,
        },
        followUp: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("CareNote", careNoteSchema);
