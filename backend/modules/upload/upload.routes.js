import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { protect } from "../../common/middlewares/auth.middleware.js";

const router = express.Router();

let upload;

// If cloudinary is configured, use it
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "eldernest",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
    },
  });
  upload = multer({ storage });
} else {
  // Fallback to local storage
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  upload = multer({ storage });
}

router.post("/", protect, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  let fileUrl = req.file.path; // Cloudinary returns URL in 'path'
  
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    // If local, construct full URL
    fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }

  res.status(200).json({ success: true, url: fileUrl });
});

export default router;
