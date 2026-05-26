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
        subject: "ElderNest - Caregiver Registration Pending Approval",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Welcome to ElderNest!</h2>
                <p>Dear ${name},</p>
                <p>Thank you for registering as a caregiver with ElderNest.</p>
                <p><strong>Your registration is currently pending admin approval.</strong></p>
                <p>You will receive an email notification once your account is approved.</p>
                <p>Best regards,<br/>ElderNest Team</p>
            </div>
        `,
    }),

    // Admin - New Caregiver Registration
    adminCaregiverNotification: (caregiverName, caregiverEmail) => ({
        subject: "New Caregiver Registration - Action Required",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">New Caregiver Registration</h2>
                <p>A new caregiver has registered and requires approval:</p>
                <ul>
                    <li><strong>Name:</strong> ${caregiverName}</li>
                    <li><strong>Email:</strong> ${caregiverEmail}</li>
                </ul>
                <p>Please review and approve/reject the registration from the admin dashboard.</p>
                <p>ElderNest Admin System</p>
            </div>
        `,
    }),

    // Caregiver Approval
    caregiverApproval: (name) => ({
        subject: "ElderNest - Your Account Has Been Approved!",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #16a34a;">Congratulations!</h2>
                <p>Dear ${name},</p>
                <p>Great news! Your caregiver account has been approved by our admin team.</p>
                <p>You can now complete your profile and start receiving booking requests.</p>
                <p><strong>Next Steps:</strong></p>
                <ol>
                    <li>Complete your caregiver profile</li>
                    <li>Add your services and availability</li>
                    <li>Start accepting bookings</li>
                </ol>
                <p>Best regards,<br/>ElderNest Team</p>
            </div>
        `,
    }),

    // Caregiver Rejection
    caregiverRejection: (name, reason) => ({
        subject: "ElderNest - Registration Status Update",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">Registration Update</h2>
                <p>Dear ${name},</p>
                <p>Thank you for your interest in joining ElderNest as a caregiver.</p>
                <p>Unfortunately, we are unable to approve your registration at this time.</p>
                ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
                <p>If you have any questions, please contact our support team.</p>
                <p>Best regards,<br/>ElderNest Team</p>
            </div>
        `,
    }),

    // Caregiver Profile Approval
    caregiverProfileApproval: (name) => ({
        subject: "ElderNest - Your Profile is Now Live!",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #16a34a;">Profile Approved!</h2>
                <p>Dear ${name},</p>
                <p>Your caregiver profile has been approved and is now visible to users.</p>
                <p>You can start receiving booking requests from families looking for care services.</p>
                <p>Best regards,<br/>ElderNest Team</p>
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
