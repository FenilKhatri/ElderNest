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

export default getCloudinary;
