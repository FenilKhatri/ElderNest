import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Email Templates
const emailTemplates = {
    // User Registration
    userRegistration: (name) => ({
        subject: "Welcome to ElderNest - Registration Successful",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Welcome to ElderNest!</h2>
                <p>Dear ${name},</p>
                <p>Thank you for registering with ElderNest. Your account has been created successfully.</p>
                <p>You can now browse and book trusted caregivers for your loved ones.</p>
                <p>Best regards,<br/>ElderNest Team</p>
            </div>
        `,
    }),

    // Caregiver Registration
    caregiverRegistration: (name) => ({
        subject: "Welcome to ElderNest - Registration Pending Approval",
        html: `
            <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #0f766e, #0369a1); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Welcome to ElderNest!</h1>
                    <p style="color: #ccfbf1; margin: 10px 0 0; font-size: 16px;">Compassionate Care, Always.</p>
                </div>
                
                <div style="padding: 40px 30px; background: #ffffff;">
                    <h2 style="color: #0f172a; font-size: 20px; margin-top: 0;">Hi ${name},</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Thank you for taking the first step to join the ElderNest caregiver network! We are thrilled to see your interest in providing compassionate care to our elders.
                    </p>
                    
                    <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 24px 0;">
                        <p style="margin: 0; color: #b45309; font-size: 15px; font-weight: 500;">
                            ⏳ Your registration is currently pending admin approval.
                        </p>
                    </div>

                    <h3 style="color: #0f172a; font-size: 16px; margin-top: 30px;">What happens next?</h3>
                    <ul style="color: #475569; font-size: 15px; line-height: 1.6; padding-left: 20px;">
                        <li style="margin-bottom: 8px;">Our team will review your application details.</li>
                        <li style="margin-bottom: 8px;">You will receive an email once your account is approved.</li>
                        <li style="margin-bottom: 8px;">After approval, you can set up your full profile, pricing, and services.</li>
                    </ul>

                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                        In the meantime, feel free to explore our platform to learn more about how ElderNest works.
                    </p>
                </div>
                
                <div style="padding: 30px; background: #f1f5f9; text-align: center;">
                    <p style="color: #64748b; font-size: 13px; margin: 0 0 10px; line-height: 1.5;">
                        As a reminder, please ensure you have all your certifications ready for the next onboarding step.
                    </p>
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} ElderNest LLC. All rights reserved.<br/>
                        This email was sent as part of your onboarding process.
                    </p>
                </div>
            </div>
        `,
    }),

    // Admin - New Caregiver Registration
    adminCaregiverNotification: (caregiverName, caregiverEmail) => ({
        subject: "New Caregiver Registration - Action Required",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
                <div style="background: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <h2 style="color: #dc2626; margin-top: 0;">New Caregiver Registration</h2>
                    <p style="color: #475569;">A new caregiver has registered and requires approval:</p>
                    <ul style="background: #f1f5f9; padding: 15px 30px; border-radius: 6px; color: #0f172a;">
                        <li><strong>Name:</strong> ${caregiverName}</li>
                        <li><strong>Email:</strong> ${caregiverEmail}</li>
                    </ul>
                    <p style="color: #475569;">Please review and approve/reject the registration from the admin dashboard.</p>
                </div>
            </div>
        `,
    }),

    // Caregiver Approval
    caregiverApproval: (name) => ({
        subject: "ElderNest - Your Account Has Been Approved!",
        html: `
            <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #15803d, #166534); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">You're Approved!</h1>
                    <p style="color: #dcfce7; margin: 10px 0 0; font-size: 16px;">Welcome officially to the ElderNest family.</p>
                </div>
                
                <div style="padding: 40px 30px; background: #ffffff;">
                    <h2 style="color: #0f172a; font-size: 20px; margin-top: 0;">Hi ${name},</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Great news! We have reviewed your registration and are excited to let you know that your caregiver account has been <strong>approved</strong>.
                    </p>
                    
                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 20px;">
                        To start accepting bookings and helping families, you need to complete your profile verification.
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/caregiver/login" style="display: inline-block; background: #16a34a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">Log in to your Dashboard →</a>
                    </div>

                    <h3 style="color: #0f172a; font-size: 16px; margin-top: 30px;">Next Steps for Liftoff:</h3>
                    <ul style="color: #475569; font-size: 15px; line-height: 1.6; padding-left: 20px;">
                        <li style="margin-bottom: 8px;"><strong>Complete Profile:</strong> Add your biography and specialized experience.</li>
                        <li style="margin-bottom: 8px;"><strong>Upload Documents:</strong> Provide your ID proof and certifications.</li>
                        <li style="margin-bottom: 8px;"><strong>Set Services:</strong> Define what services you offer and your pricing.</li>
                    </ul>
                </div>
                
                <div style="padding: 30px; background: #f1f5f9; text-align: center;">
                    <p style="color: #64748b; font-size: 13px; margin: 0 0 10px; line-height: 1.5;">
                        We're here to support you. If you have questions, reach out to our support team.
                    </p>
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} ElderNest LLC. All rights reserved.
                    </p>
                </div>
            </div>
        `,
    }),

    // Caregiver Rejection
    caregiverRejection: (name, reason) => ({
        subject: "ElderNest - Registration Status Update",
        html: `
            <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #b91c1c, #991b1b); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Application Update</h1>
                    <p style="color: #fee2e2; margin: 10px 0 0; font-size: 16px;">Regarding your recent caregiver registration.</p>
                </div>
                
                <div style="padding: 40px 30px; background: #ffffff;">
                    <h2 style="color: #0f172a; font-size: 20px; margin-top: 0;">Hi ${name},</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Thank you for your interest in joining ElderNest. Our team has carefully reviewed your application. 
                        Unfortunately, we are unable to approve your registration at this time.
                    </p>
                    
                    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 24px 0;">
                        <p style="margin: 0; color: #991b1b; font-size: 15px; line-height: 1.5;">
                            <strong>Reason:</strong><br/>
                            ${reason || "Your application did not meet our current requirements for the caregiver network."}
                        </p>
                    </div>

                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                        We appreciate the time you took to apply. If you believe this was an error, or if you acquire the necessary requirements in the future, you are welcome to contact our support team.
                    </p>
                </div>
                
                <div style="padding: 30px; background: #f1f5f9; text-align: center;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} ElderNest LLC. All rights reserved.
                    </p>
                </div>
            </div>
        `,
    }),

    // Caregiver Profile Approval
    caregiverProfileApproval: (name) => ({
        subject: "ElderNest - Your Profile is Now Live!",
        html: `
            <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #4f46e5, #4338ca); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">You're Live!</h1>
                    <p style="color: #e0e7ff; margin: 10px 0 0; font-size: 16px;">Your profile is now visible to families.</p>
                </div>
                
                <div style="padding: 40px 30px; background: #ffffff;">
                    <h2 style="color: #0f172a; font-size: 20px; margin-top: 0;">Congratulations, ${name}!</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Your caregiver verification has been successfully processed, and your profile is now <strong>Live</strong> on ElderNest!
                    </p>
                    
                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 20px;">
                        Families looking for compassionate care can now find you in our search results and send you booking requests.
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/caregiver/dashboard" style="display: inline-block; background: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">View Dashboard →</a>
                    </div>

                    <h3 style="color: #0f172a; font-size: 16px; margin-top: 30px;">Tips for Success:</h3>
                    <ul style="color: #475569; font-size: 15px; line-height: 1.6; padding-left: 20px;">
                        <li style="margin-bottom: 8px;">Respond promptly to booking requests.</li>
                        <li style="margin-bottom: 8px;">Keep your availability calendar updated.</li>
                        <li style="margin-bottom: 8px;">Ask families for reviews after completing a service.</li>
                    </ul>
                </div>
                
                <div style="padding: 30px; background: #f1f5f9; text-align: center;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} ElderNest LLC. All rights reserved.
                    </p>
                </div>
            </div>
        `,
    }),

    // Booking Confirmation - User
    bookingConfirmationUser: (userName, bookingId, caregiverName, date, time) => ({
        subject: `Booking Confirmation - ${bookingId}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Booking Confirmed!</h2>
                <p>Dear ${userName},</p>
                <p>Your booking has been created successfully.</p>
                <p><strong>Booking Details:</strong></p>
                <ul>
                    <li><strong>Booking ID:</strong> ${bookingId}</li>
                    <li><strong>Caregiver:</strong> ${caregiverName}</li>
                    <li><strong>Date:</strong> ${date}</li>
                    <li><strong>Time:</strong> ${time}</li>
                    <li><strong>Status:</strong> Pending Caregiver Acceptance</li>
                </ul>
                <p>You will receive a notification once the caregiver accepts your booking.</p>
                <p>Best regards,<br/>ElderNest Team</p>
            </div>
        `,
    }),

    // Booking Notification - Caregiver
    bookingNotificationCaregiver: (caregiverName, bookingId, patientName, date, time) => ({
        subject: `New Booking Request - ${bookingId}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">New Booking Request</h2>
                <p>Dear ${caregiverName},</p>
                <p>You have received a new booking request.</p>
                <p><strong>Booking Details:</strong></p>
                <ul>
                    <li><strong>Booking ID:</strong> ${bookingId}</li>
                    <li><strong>Patient:</strong> ${patientName}</li>
                    <li><strong>Date:</strong> ${date}</li>
                    <li><strong>Time:</strong> ${time}</li>
                </ul>
                <p>Please review and accept/reject the booking from your dashboard.</p>
                <p>Best regards,<br/>ElderNest Team</p>
            </div>
        `,
    }),

    // Booking Accepted
    bookingAccepted: (userName, bookingId, caregiverName) => ({
        subject: `Booking Accepted - ${bookingId}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #16a34a;">Booking Accepted!</h2>
                <p>Dear ${userName},</p>
                <p>Great news! Your booking has been accepted by ${caregiverName}.</p>
                <p><strong>Booking ID:</strong> ${bookingId}</p>
                <p>The caregiver will contact you shortly to confirm the details.</p>
                <p>Best regards,<br/>ElderNest Team</p>
            </div>
        `,
    }),

    // Booking Rejected
    bookingRejected: (userName, bookingId, reason) => ({
        subject: `Booking Update - ${bookingId}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">Booking Update</h2>
                <p>Dear ${userName},</p>
                <p>Unfortunately, your booking (${bookingId}) could not be accepted.</p>
                ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
                <p>Please try booking another caregiver or contact support for assistance.</p>
                <p>Best regards,<br/>ElderNest Team</p>
            </div>
        `,
    }),

    // Contact Form Submission - User
    contactConfirmation: (name) => ({
        subject: "We Received Your Message - ElderNest",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Thank You for Contacting Us</h2>
                <p>Dear ${name},</p>
                <p>We have received your message and will get back to you within 24-48 hours.</p>
                <p>Our support team is reviewing your inquiry.</p>
                <p>Best regards,<br/>ElderNest Team</p>
            </div>
        `,
    }),

    // Contact Form - Admin Notification
    contactAdminNotification: (name, email, subject, message) => ({
        subject: `New Contact Form Submission - ${subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">New Contact Form Submission</h2>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p style="background: #f3f4f6; padding: 15px; border-radius: 5px;">${message}</p>
                <p>Please respond from the admin dashboard.</p>
            </div>
        `,
    }),

    // Booking Payment Confirmation
    bookingPaymentConfirmation: (userName, bookingId, caregiverName, serviceName, amount, transactionId, date, time) => ({
        subject: `Booking Confirmed - ElderNest #${bookingId}`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
                <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">ElderNest</h1>
                    <p style="color: #93c5fd; margin: 8px 0 0;">Compassionate Care, Always</p>
                </div>
                
                <div style="padding: 30px; background: #ffffff;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <div style="display: inline-block; background: #dcfce7; color: #166534; padding: 8px 20px; border-radius: 20px; font-weight: 600; font-size: 14px;">
                            ✓ Payment Successful
                        </div>
                    </div>
                    
                    <p style="color: #334155; font-size: 16px;">Dear ${userName},</p>
                    <p style="color: #64748b; line-height: 1.6;">
                        Thank you for your payment! Your booking has been confirmed and the caregiver has been notified. 
                        Here's a summary of your booking:
                    </p>
                    
                    <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #1e3a8a; margin: 0 0 16px; font-size: 16px;">📋 Booking Summary</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 6px 0; color: #64748b; font-size: 14px;">Booking ID</td><td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right; font-size: 14px;">${bookingId}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b; font-size: 14px;">Service</td><td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right; font-size: 14px;">${serviceName}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b; font-size: 14px;">Caregiver</td><td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right; font-size: 14px;">${caregiverName}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b; font-size: 14px;">Date</td><td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right; font-size: 14px;">${date}</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b; font-size: 14px;">Time</td><td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right; font-size: 14px;">${time}</td></tr>
                        </table>
                    </div>
                    
                    <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0;">
                        <p style="margin: 0; color: #1e40af; font-size: 14px;">
                            <strong>💰 Amount Paid:</strong> ₹${amount?.toLocaleString?.("en-IN") || amount}<br/>
                            <strong>🔖 Transaction ID:</strong> ${transactionId}
                        </p>
                    </div>
                    
                    <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
                        The caregiver will review your booking shortly. You will receive a notification once it is accepted.
                    </p>
                </div>
                
                <div style="padding: 20px 30px; background: #f1f5f9; text-align: center; border-radius: 0 0 12px 12px;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                        Need help? Contact us at support@eldernest.com<br/>
                        © ${new Date().getFullYear()} ElderNest. All rights reserved.
                    </p>
                </div>
            </div>
        `,
    }),
};

// Send Email Function
export const sendEmail = async (to, templateName, templateData) => {
    try {
        const template = emailTemplates[templateName];
        if (!template) {
            throw new Error(`Email template '${templateName}' not found`);
        }

        const { subject, html } = typeof template === "function" 
            ? template(...Object.values(templateData)) 
            : template;

        // Mock sending if no SMTP credentials are provided
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
            return { success: true, messageId: "mock-id-" + Date.now() };
        }

        const mailOptions = {
            from: `"ElderNest" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Email sending failed:", error);
        return { success: false, error: error.message };
    }
};

// Send Multiple Emails
export const sendBulkEmails = async (recipients, templateName, templateData) => {
    const promises = recipients.map((email) =>
        sendEmail(email, templateName, templateData)
    );
    return Promise.allSettled(promises);
};
