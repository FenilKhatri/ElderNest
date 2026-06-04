import mongoose from "mongoose";
import { CAREGIVER_STATUSES, ROLES, AUTH_PROVIDERS } from "../../common/utils/constants.js";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        password: {
            type: String,
            required: function () {
                return this.authProvider === AUTH_PROVIDERS.LOCAL;
            },
            select: false
        },

        authProvider: {
            type: String,
            enum: Object.values(AUTH_PROVIDERS),
            default: AUTH_PROVIDERS.LOCAL
        },

        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.USER,
            index: true,
        },

        profileImage: {
            type: String,
            default: "",
        }, 
        
        failedLoginAttempts: {
            type: Number,
            default: 0,
        },

        lockUntil: {
            type: Date,
            default: null,
        },

        isApproved: {
            type: Boolean,
            default: function() {
                return this.role !== ROLES.CAREGIVER;
            },
        },

        status: {
            type: String,
            enum: Object.values(CAREGIVER_STATUSES),
            default: function() {
                return this.role === ROLES.CAREGIVER ? CAREGIVER_STATUSES.PENDING : CAREGIVER_STATUSES.APPROVED;
            },
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);