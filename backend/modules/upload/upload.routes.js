import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { protect } from "../../common/middlewares/auth.middleware.js";
import getCloudinary from "../../config/cloudinary.js";

const router = express.Router();

/**
 * Determine the Cloudinary sub-folder inside "Eldernest" based on the
 * uploaded file's mimetype or an explicit `folder` field in the request body.
 *
 * Folder hierarchy on Cloudinary:
 *   Eldernest/
 *     photos/       ← images (profile pics, blog images, service covers, etc.)
 *     documents/    ← PDFs, certificates, experience letters, etc.
 */
const resolveFolder = (req, file) => {
    // Allow the client to explicitly request a sub-folder
    const explicit = req.body?.folder || req.query?.folder;
    if (explicit) return `Eldernest/${explicit}`;

    // Auto-detect from mimetype
    if (file.mimetype === "application/pdf") return "Eldernest/documents";
    if (file.mimetype?.startsWith("image/")) return "Eldernest/photos";

    // Fallback
    return "Eldernest/photos";
};

/**
 * Build a fresh multer instance on each request so that:
 *   1. Cloudinary is configured lazily (after dotenv has loaded).
 *   2. The folder is resolved per-request based on the file being uploaded.
 */
const getUploadMiddleware = () => {
    const cloudinary = getCloudinary();

    const storage = new CloudinaryStorage({
        cloudinary,
        params: async (req, file) => ({
            folder: resolveFolder(req, file),
            resource_type: file.mimetype === "application/pdf" ? "raw" : "auto",
            allowed_formats: ["jpg", "jpeg", "png", "webp", "avif", "pdf"],
        }),
    });

    return multer({
        storage,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    });
};

router.post("/", protect, (req, res, next) => {
    const upload = getUploadMiddleware();
    upload.single("image")(req, res, (err) => {
        if (err) {
            console.error("Upload error:", err);
            return res.status(400).json({
                success: false,
                message: err.message || "File upload failed",
            });
        }

        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, message: "No file uploaded" });
        }

        const fileUrl = req.file.path || req.file.secure_url;
        res.status(200).json({
            success: true,
            url: fileUrl,
            data: { url: fileUrl },
        });
    });
});

export default router;
