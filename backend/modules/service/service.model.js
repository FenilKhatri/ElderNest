import mongoose from "mongoose";

const dayAvailabilitySchema = {
    type: Boolean,
    default: true,
};

const serviceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
        },
        category: {
            type: String,
            required: true,
            enum: [
                "personal-care",
                "medical-care",
                "companionship",
                "household-help",
                "specialized-care",
                "emergency-care",
            ],
        },
        shortDescription: {
            type: String,
            trim: true,
            default: "",
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            default: "",
        },
        coverImage: {
            type: String,
            default: "",
        },
        images: {
            type: [String],
            default: [],
        },

        serviceMode: {
            type: String,
            enum: ["home-visit", "online", "both"],
            default: "home-visit",
        },
        features: {
            type: [String],
            default: [],
        },
        benefits: {
            type: [String],
            default: [],
        },
        availability: {
            monday: dayAvailabilitySchema,
            tuesday: dayAvailabilitySchema,
            wednesday: dayAvailabilitySchema,
            thursday: dayAvailabilitySchema,
            friday: dayAvailabilitySchema,
            saturday: dayAvailabilitySchema,
            sunday: dayAvailabilitySchema,
        },
        caregivers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Caregiver",
            },
        ],
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
        totalBookings: {
            type: Number,
            default: 0,
            min: 0,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDraft: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

serviceSchema.pre("save", async function (next) {
    if (this.title && (this.isModified("title") || !this.slug)) {
        let baseSlug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
            
        let uniqueSlug = baseSlug;
        let counter = 1;
        while (true) {
            const existing = await mongoose.models.Service.findOne({ slug: uniqueSlug, _id: { $ne: this._id } });
            if (!existing) break;
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
        }
        this.slug = uniqueSlug;
    }
    if (!this.coverImage && this.image) {
        this.coverImage = this.image;
    }
    if (!this.image && this.coverImage) {
        this.image = this.coverImage;
    }
    if (!this.shortDescription && this.description) {
        this.shortDescription = this.description.slice(0, 160);
    }
});

export default mongoose.model("Service", serviceSchema);
