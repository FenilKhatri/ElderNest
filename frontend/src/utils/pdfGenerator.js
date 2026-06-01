import jsPDF from "jspdf";
import "jspdf-autotable";
import { formatDate, formatCurrency } from "./helpers";

export const generateBookingReceipt = (booking) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(30, 58, 138); // Blue 900
  doc.text("ElderNest", 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Receipt of Care Services", 14, 30);
  doc.text(`Date Generated: ${formatDate(new Date())}`, 14, 36);

  // Status & ID
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Booking ID: ${booking.bookingId || booking._id}`, 140, 22);
  doc.text(`Status: ${booking.status.toUpperCase()}`, 140, 30);

  // Line
  doc.setLineWidth(0.5);
  doc.line(14, 45, 196, 45);

  // Patient Details
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138);
  doc.text("Patient Details", 14, 55);
  
  doc.setFontSize(11);
  doc.setTextColor(50);
  doc.text(`Name: ${booking.patientName}`, 14, 65);
  doc.text(`Age: ${booking.patientAge} years`, 14, 72);
  doc.text(`Condition: ${booking.disease || 'N/A'}`, 14, 79);

  // Service Details
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138);
  doc.text("Service Details", 110, 55);
  
  doc.setFontSize(11);
  doc.setTextColor(50);
  doc.text(`Care Type: ${booking.careType.toUpperCase()}`, 110, 65);
  doc.text(`Schedule: ${formatDate(booking.bookingDate)}`, 110, 72);
  doc.text(`Time: ${booking.timeSlot?.startTime} - ${booking.timeSlot?.endTime}`, 110, 79);

  // Location
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text("Location & Contact", 14, 95);
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(`Phone: ${booking.contactNumber}`, 14, 103);
  doc.text(`Email: ${booking.email}`, 14, 110);
  const addr = booking.address;
  doc.text(`Address: ${addr?.street}, ${addr?.city}, ${addr?.state} - ${addr?.pincode}`, 14, 117);

  // Payment Table (Dummy for now if payment not fully integrated)
  const amount = booking.totalAmount || 5000; 
  const tax = amount * 0.18;
  const total = amount + tax;

  doc.autoTable({
    startY: 135,
    head: [['Description', 'Amount']],
    body: [
      [`${booking.careType} Care Service`, formatCurrency(amount)],
      ['Taxes (18% GST)', formatCurrency(tax)],
    ],
    foot: [
      ['Total Paid', formatCurrency(total)]
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138] },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("Thank you for choosing ElderNest for your loved ones' care.", 14, pageHeight - 20);
  doc.text("For any queries, contact fenilkatri931@gmail.com", 14, pageHeight - 15);

  // Save
  doc.save(`ElderNest_Receipt_${booking.bookingId || 'booking'}.pdf`);
};
