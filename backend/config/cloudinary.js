import { v2 as cloudinary } from "cloudinary";

let configured = false;

/**
 * Lazily configure & return the cloudinary instance.
 * This avoids the race condition where cloudinary.config() runs
 * before dotenv has loaded the env vars.
 */
export const getCloudinary = () => {
    if (!configured) {
        if (
            !process.env.CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            console.warn(
                "Cloudinary is not configured. File uploads will fail until CLOUDINARY_* env vars are set."
            );
        }

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        configured = true;
    }

    return cloudinary;
};

/**
 * Extracts public ID from a Cloudinary URL and deletes the asset.
 * @param {string} url - The Cloudinary image/file URL.
 */
export const deleteFromCloudinary = async (url) => {
    if (!url) return;
    try {
        const cloudinary = getCloudinary();
        // Extract public ID from URL: e.g. "https://res.cloudinary.com/.../upload/v1234/folder/filename.ext" -> "folder/filename"
        const splitUrl = url.split("/");
        const filename = splitUrl.pop().split(".")[0];
        const folder = splitUrl.pop();
        
        let publicId = filename;
        // If it was in a specific folder (not raw upload)
        if (folder !== "upload" && !folder.startsWith("v")) {
             publicId = `${folder}/${filename}`;
        }

        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary deletion error:", error);
    }
};

export default getCloudinary;
