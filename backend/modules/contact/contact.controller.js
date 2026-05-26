import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import { validationResult } from "express-validator";
import Contact from "./contact.model.js";
import User from "../user/user.model.js";
import { createNotification } from "../../common/services/notification.service.js";
import { sendEmail } from "../../common/services/email.service.js";

// Create contact inquiry
export const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    const contact = await Contact.create({
        name,
        email,
        phone,
        subject,
        message,
    });

    // Notify all admins
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
        await createNotification(
            admin._id,
            "general",
            "New Contact Inquiry",
            `New message from ${name}: ${subject}`,
            "/admin/contacts"
        );

        // Send email to admin
        await sendEmail(admin.email, "contactAdminNotification", {
            name,
            email,
            subject,
            message,
        });
    }

    // Send confirmation email to user
    await sendEmail(email, "contactConfirmation", { name });

    return successResponse(res, 201, "Message sent successfully", { contact });
});
