import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve to project root /uploads
const uploadsRoot = path.resolve(__dirname, "../../../uploads");

/**
 * Ensure the directory exists, create recursively if not.
 */
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

/**
 * Generate Payment Receipt PDF using jsPDF-style manual layout.
 * Uses only Node built-in + simple text writing for maximum portability.
 */
export const generateReceiptPdf = async (booking) => {
    try {
        const dir = path.join(uploadsRoot, "receipts");
        ensureDir(dir);

        const fileName = `receipt_${booking.bookingId || booking._id}_${Date.now()}.txt`;
        const filePath = path.join(dir, fileName);

        const amount = booking.totalAmount || 0;
        const tax = Math.round(amount * 0.18);
        const total = amount + tax;

        const content = [
            "═══════════════════════════════════════════════════════",
            "                  ELDERNEST CARE SERVICES              ",
            "                    PAYMENT RECEIPT                    ",
            "═══════════════════════════════════════════════════════",
            "",
            `Receipt No:      REC-${booking.bookingId || booking._id}`,
            `Transaction ID:  ${booking.transactionId || booking.razorpayPaymentId || "N/A"}`,
            `Payment Date:    ${booking.paymentDate ? new Date(booking.paymentDate).toLocaleDateString("en-IN") : new Date().toLocaleDateString("en-IN")}`,
            `Payment Method:  Razorpay Online Payment`,
            "",
            "───────────────────────────────────────────────────────",
            "CUSTOMER DETAILS",
            "───────────────────────────────────────────────────────",
            `Name:            ${booking.userId?.name || booking.patientName}`,
            `Email:           ${booking.userId?.email || booking.email}`,
            `Phone:           ${booking.userId?.phone || booking.contactNumber}`,
            "",
            "───────────────────────────────────────────────────────",
            "SERVICE DETAILS",
            "───────────────────────────────────────────────────────",
            `Service:         ${booking.serviceId?.title || "Care Service"}`,
            `Category:        ${booking.serviceId?.category || "Healthcare"}`,
            `Care Type:       ${booking.careType || "N/A"}`,
            `Caregiver:       ${booking.caregiverId?.userId?.name || "Assigned"}`,
            "",
            "───────────────────────────────────────────────────────",
            "PAYMENT BREAKDOWN",
            "───────────────────────────────────────────────────────",
            `Service Amount:              ₹${amount.toLocaleString("en-IN")}`,
            `GST (18%):                   ₹${tax.toLocaleString("en-IN")}`,
            "                             ─────────",
            `TOTAL PAID:                  ₹${total.toLocaleString("en-IN")}`,
            "",
            "═══════════════════════════════════════════════════════",
            "Thank you for choosing ElderNest for your loved ones.",
            "For queries: support@eldernest.com | +91-9876543210",
            "═══════════════════════════════════════════════════════",
        ].join("\n");

        fs.writeFileSync(filePath, content, "utf-8");

        // Return a relative URL that can be served statically
        return `/uploads/receipts/${fileName}`;
    } catch (error) {
        console.error("Receipt PDF generation failed:", error);
        return null;
    }
};

/**
 * Generate Booking Details PDF
 */
export const generateBookingPdf = async (booking) => {
    try {
        const dir = path.join(uploadsRoot, "bookings");
        ensureDir(dir);

        const fileName = `booking_${booking.bookingId || booking._id}_${Date.now()}.txt`;
        const filePath = path.join(dir, fileName);

        const addr = booking.address || {};
        const ec = booking.emergencyContact || {};

        const content = [
            "═══════════════════════════════════════════════════════",
            "               ELDERNEST BOOKING SUMMARY               ",
            "═══════════════════════════════════════════════════════",
            "",
            `Booking ID:      ${booking.bookingId || booking._id}`,
            `Created:         ${new Date(booking.createdAt).toLocaleDateString("en-IN")}`,
            `Status:          ${(booking.status || "pending").toUpperCase()}`,
            `Payment Status:  ${(booking.paymentStatus || "pending").toUpperCase()}`,
            "",
            "───────────────────────────────────────────────────────",
            "PATIENT INFORMATION",
            "───────────────────────────────────────────────────────",
            `Patient Name:    ${booking.patientName}`,
            `Patient Age:     ${booking.patientAge} years`,
            `Condition:       ${booking.disease || "N/A"}`,
            "",
            "───────────────────────────────────────────────────────",
            "CAREGIVER & SERVICE",
            "───────────────────────────────────────────────────────",
            `Caregiver:       ${booking.caregiverId?.userId?.name || "Assigned"}`,
            `Service:         ${booking.serviceId?.title || "Care Service"}`,
            `Category:        ${booking.serviceId?.category || "Healthcare"}`,
            `Care Type:       ${(booking.careType || "N/A").toUpperCase()}`,
            `Duration Type:   ${(booking.durationType || "hourly").toUpperCase()}`,
            "",
            "───────────────────────────────────────────────────────",
            "SCHEDULE",
            "───────────────────────────────────────────────────────",
            `Date:            ${new Date(booking.bookingDate).toLocaleDateString("en-IN")}`,
            `Time:            ${booking.timeSlot?.startTime || "N/A"} - ${booking.timeSlot?.endTime || "N/A"}`,
            `Duration:        ${booking.duration || 0} hours`,
            "",
            "───────────────────────────────────────────────────────",
            "ADDRESS",
            "───────────────────────────────────────────────────────",
            `Street:          ${addr.street || "N/A"}`,
            `City:            ${addr.city || "N/A"}`,
            `State:           ${addr.state || "N/A"}`,
            `Pincode:         ${addr.pincode || "N/A"}`,
            "",
            "───────────────────────────────────────────────────────",
            "EMERGENCY CONTACT",
            "───────────────────────────────────────────────────────",
            `Name:            ${ec.name || "N/A"}`,
            `Phone:           ${ec.phone || "N/A"}`,
            `Relation:        ${ec.relation || "N/A"}`,
            "",
            "───────────────────────────────────────────────────────",
            "PAYMENT",
            "───────────────────────────────────────────────────────",
            `Amount:          ₹${(booking.totalAmount || 0).toLocaleString("en-IN")}`,
            `Transaction ID:  ${booking.transactionId || booking.razorpayPaymentId || "N/A"}`,
            "",
            booking.notes ? `Special Instructions: ${booking.notes}` : "",
            "",
            "═══════════════════════════════════════════════════════",
            "        ElderNest — Compassionate Care, Always.        ",
            "═══════════════════════════════════════════════════════",
        ].filter(Boolean).join("\n");

        fs.writeFileSync(filePath, content, "utf-8");

        return `/uploads/bookings/${fileName}`;
    } catch (error) {
        console.error("Booking PDF generation failed:", error);
        return null;
    }
};
