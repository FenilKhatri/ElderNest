import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        readTime: {
            type: String, // e.g. "5 min read"
            default: "5 min read",
        },
        excerpt: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        quote: {
            type: String, // Special blue text section
            default: "",
        },
        image: {
            type: String,
            default: "",
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        comments: [
            {
                name: { type: String, required: true },
                email: { type: String, required: true },
                text: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            }
        ],
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },
        seo: {
            metaTitle: { type: String, default: "" },
            metaDescription: { type: String, default: "" },
            metaKeywords: { type: [String], default: [] },
        },
        publishedAt: {
            type: Date,
            default: Date.now,
        }
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default mongoose.model("Blog", blogSchema);
