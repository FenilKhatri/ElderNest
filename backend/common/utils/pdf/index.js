import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve to project root /uploads
const uploadsRoot = path.resolve(__dirname, "../../../uploads");

const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

export const generateReceiptPdf = async (booking) => {
    return new Promise((resolve, reject) => {
        try {
            const dir = path.join(uploadsRoot, "receipts");
            ensureDir(dir);

            const fileName = `receipt_${booking.bookingId || booking._id}_${Date.now()}.pdf`;
            const filePath = path.join(dir, fileName);

            const amount = booking.totalAmount || 0;
            const tax = Math.round(amount * 0.18);
            const total = amount + tax;

            const doc = new PDFDocument({ margin: 50 });
            const stream = fs.createWriteStream(filePath);
            
            doc.pipe(stream);

            // Header
            doc.fontSize(20).text("ELDERNEST CARE SERVICES", { align: 'center' });
            doc.fontSize(14).text("PAYMENT RECEIPT", { align: 'center' });
            doc.moveDown();
            
            // Meta
            doc.fontSize(10);
            doc.text(`Receipt No: REC-${booking.bookingId || booking._id}`);
            doc.text(`Transaction ID: ${booking.transactionId || booking.razorpayPaymentId || "N/A"}`);
            doc.text(`Payment Date: ${booking.paymentDate ? new Date(booking.paymentDate).toLocaleDateString("en-IN") : new Date().toLocaleDateString("en-IN")}`);
            doc.text(`Payment Method: Razorpay Online Payment`);
            doc.moveDown();

            // Customer Details
            doc.fontSize(12).text("CUSTOMER DETAILS", { underline: true });
            doc.fontSize(10);
            doc.text(`Name: ${booking.userId?.name || booking.patientName}`);
            doc.text(`Email: ${booking.userId?.email || booking.email}`);
            doc.text(`Phone: ${booking.userId?.phone || booking.contactNumber}`);
            doc.moveDown();

            // Service Details
            doc.fontSize(12).text("SERVICE DETAILS", { underline: true });
            doc.fontSize(10);
            doc.text(`Service: ${booking.serviceId?.title || "Care Service"}`);
            doc.text(`Category: ${booking.serviceId?.category || "Healthcare"}`);
            doc.text(`Care Type: ${booking.careType || "N/A"}`);
            doc.text(`Caregiver: ${booking.caregiverId?.userId?.name || "Assigned"}`);
            doc.moveDown();

            // Payment Breakdown
            doc.fontSize(12).text("PAYMENT BREAKDOWN", { underline: true });
            doc.fontSize(10);
            doc.text(`Service Amount: Rs. ${amount.toLocaleString("en-IN")}`);
            doc.text(`GST (18%): Rs. ${tax.toLocaleString("en-IN")}`);
            doc.moveDown();
            doc.fontSize(12).text(`TOTAL PAID: Rs. ${total.toLocaleString("en-IN")}`, { bold: true });
            
            doc.moveDown(2);
            doc.fontSize(10).text("Thank you for choosing ElderNest for your loved ones.", { align: 'center' });
            doc.text("For queries: support@eldernest.com | +91-9876543210", { align: 'center' });

            doc.end();

            stream.on('finish', () => resolve(`/uploads/receipts/${fileName}`));
            stream.on('error', reject);
        } catch (error) {
            console.error("Receipt PDF generation failed:", error);
            resolve(null);
        }
    });
};

export const generateBookingPdf = async (booking) => {
    return new Promise((resolve, reject) => {
        try {
            const dir = path.join(uploadsRoot, "bookings");
            ensureDir(dir);

            const fileName = `booking_${booking.bookingId || booking._id}_${Date.now()}.pdf`;
            const filePath = path.join(dir, fileName);

            const addr = booking.address || {};
            const ec = booking.emergencyContact || {};

            const doc = new PDFDocument({ margin: 50 });
            const stream = fs.createWriteStream(filePath);
            
            doc.pipe(stream);

            // Header
            doc.fontSize(20).text("ELDERNEST BOOKING SUMMARY", { align: 'center' });
            doc.moveDown();
            
            // Meta
            doc.fontSize(10);
            doc.text(`Booking ID: ${booking.bookingId || booking._id}`);
            doc.text(`Created: ${new Date(booking.createdAt).toLocaleDateString("en-IN")}`);
            doc.text(`Status: ${(booking.status || "pending").toUpperCase()}`);
            doc.text(`Payment Status: ${(booking.paymentStatus || "pending").toUpperCase()}`);
            doc.moveDown();

            // Patient
            doc.fontSize(12).text("PATIENT INFORMATION", { underline: true });
            doc.fontSize(10);
            doc.text(`Patient Name: ${booking.patientName}`);
            doc.text(`Patient Age: ${booking.patientAge} years`);
            doc.text(`Condition: ${booking.disease || "N/A"}`);
            doc.moveDown();

            // Caregiver
            doc.fontSize(12).text("CAREGIVER & SERVICE", { underline: true });
            doc.fontSize(10);
            doc.text(`Caregiver: ${booking.caregiverId?.userId?.name || "Assigned"}`);
            doc.text(`Service: ${booking.serviceId?.title || "Care Service"}`);
            doc.text(`Category: ${booking.serviceId?.category || "Healthcare"}`);
            doc.text(`Care Type: ${(booking.careType || "N/A").toUpperCase()}`);
            doc.text(`Duration Type: ${(booking.durationType || "hourly").toUpperCase()}`);
            doc.moveDown();

            // Schedule
            doc.fontSize(12).text("SCHEDULE", { underline: true });
            doc.fontSize(10);
            doc.text(`Date: ${new Date(booking.bookingDate).toLocaleDateString("en-IN")}`);
            doc.text(`Time: ${booking.timeSlot?.startTime || "N/A"} - ${booking.timeSlot?.endTime || "N/A"}`);
            doc.text(`Duration: ${booking.duration || 0} hours`);
            doc.moveDown();

            // Address
            doc.fontSize(12).text("ADDRESS", { underline: true });
            doc.fontSize(10);
            doc.text(`Street: ${addr.street || "N/A"}`);
            doc.text(`City: ${addr.city || "N/A"}`);
            doc.text(`State: ${addr.state || "N/A"}`);
            doc.text(`Pincode: ${addr.pincode || "N/A"}`);
            doc.moveDown();

            // Emergency
            doc.fontSize(12).text("EMERGENCY CONTACT", { underline: true });
            doc.fontSize(10);
            doc.text(`Name: ${ec.name || "N/A"}`);
            doc.text(`Phone: ${ec.phone || "N/A"}`);
            doc.text(`Relation: ${ec.relation || "N/A"}`);
            doc.moveDown();

            // Payment
            doc.fontSize(12).text("PAYMENT", { underline: true });
            doc.fontSize(10);
            doc.text(`Amount: Rs. ${(booking.totalAmount || 0).toLocaleString("en-IN")}`);
            doc.text(`Transaction ID: ${booking.transactionId || booking.razorpayPaymentId || "N/A"}`);
            
            if (booking.notes) {
                doc.moveDown();
                doc.text(`Special Instructions: ${booking.notes}`);
            }
            
            doc.moveDown(2);
            doc.fontSize(10).text("ElderNest — Compassionate Care, Always.", { align: 'center' });

            doc.end();

            stream.on('finish', () => resolve(`/uploads/bookings/${fileName}`));
            stream.on('error', reject);
        } catch (error) {
            console.error("Booking PDF generation failed:", error);
            resolve(null);
        }
    });
};
