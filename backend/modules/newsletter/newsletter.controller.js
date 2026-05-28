import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse, errorResponse } from "../../common/utils/responseHandler.utils.js";
import Newsletter from "./newsletter.model.js";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const subscribeNewsletter = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return errorResponse(res, 400, "Email is required");
    }

    // Check for duplicate
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
        if (existingSubscriber.status === 'unsubscribed') {
            existingSubscriber.status = 'subscribed';
            await existingSubscriber.save();
        } else {
            return errorResponse(res, 400, "Email is already subscribed");
        }
    } else {
        await Newsletter.create({ email });
    }

    // Send confirmation email
    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM || "ElderNest <onboarding@resend.dev>",
            to: email,
            subject: "Welcome to ElderNest Newsletter!",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #2563eb; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">ElderNest</h1>
                    </div>
                    <div style="padding: 30px; background-color: #ffffff;">
                        <h2 style="color: #0f172a; margin-top: 0;">Welcome to our Newsletter!</h2>
                        <p style="color: #475569; line-height: 1.6; font-size: 16px;">
                            Thank you for subscribing to the ElderNest newsletter. We're thrilled to have you in our community.
                        </p>
                        <p style="color: #475569; line-height: 1.6; font-size: 16px;">
                            You will now receive the latest updates, essential home care tips, and inspiring stories about elder care directly in your inbox.
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="#" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                Explore Services
                            </a>
                        </div>
                        <p style="color: #94a3b8; font-size: 14px; text-align: center; margin-bottom: 0;">
                            If you did not request this subscription, please ignore this email.
                        </p>
                    </div>
                </div>
            `
        });
    } catch (err) {
        console.error("Resend error:", err);
        // Continue anyway since subscription succeeded
    }

    // Notify admins
    const User = (await import("../user/user.model.js")).default;
    const { createNotification } = await import("../../common/services/notification.service.js");
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
        await createNotification(
            admin._id,
            "general",
            "New Newsletter Subscription",
            `${email} has subscribed to the newsletter.`,
            "/admin/users"
        );
    }

    return successResponse(res, 201, "Successfully subscribed to newsletter");
});
