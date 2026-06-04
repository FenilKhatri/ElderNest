import { Resend } from "resend";

/**
 * Send a password reset email with a secure link.
 */
export const sendPasswordResetEmail = async (email, name, resetUrl) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromAddress = process.env.RESEND_FROM || "ElderNest <onboarding@resend.dev>";
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; background-color:#f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width:560px; margin:40px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 32px 24px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:24px; font-weight:700;">ElderNest</h1>
                <p style="color:rgba(255,255,255,0.85); margin:8px 0 0; font-size:14px;">Password Reset Request</p>
            </div>
            <!-- Body -->
            <div style="padding: 32px 24px;">
                <p style="color:#1e293b; font-size:16px; margin:0 0 16px;">Hi <strong>${name || "there"}</strong>,</p>
                <p style="color:#475569; font-size:14px; line-height:1.6; margin:0 0 24px;">
                    We received a request to reset your password. Click the button below to set a new password. This link will expire in <strong>30 minutes</strong>.
                </p>
                <div style="text-align:center; margin:32px 0;">
                    <a href="${resetUrl}" style="display:inline-block; background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color:#ffffff; text-decoration:none; padding:14px 32px; border-radius:10px; font-weight:600; font-size:15px;">
                        Reset Password
                    </a>
                </div>
                <p style="color:#94a3b8; font-size:13px; line-height:1.5; margin:0 0 8px;">
                    If you didn't request a password reset, you can safely ignore this email. Your password won't be changed.
                </p>
                <hr style="border:none; border-top:1px solid #e2e8f0; margin:24px 0;">
                <p style="color:#94a3b8; font-size:12px; margin:0;">
                    If the button doesn't work, copy and paste this URL into your browser:<br>
                    <a href="${resetUrl}" style="color:#2563eb; word-break:break-all;">${resetUrl}</a>
                </p>
            </div>
            <!-- Footer -->
            <div style="background:#f8fafc; padding:16px 24px; text-align:center; border-top:1px solid #e2e8f0;">
                <p style="color:#94a3b8; font-size:12px; margin:0;">© ${new Date().getFullYear()} ElderNest. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;

    await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: "Reset Your ElderNest Password",
        html,
    });
};
