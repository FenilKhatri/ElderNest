import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, History as HistoryIcon, Download, FileText, CreditCard, Receipt, CalendarDays, User, Undo2 } from "lucide-react";
import http from "../../../lib/axios";
import { getUserBookings } from "../../booking/api/booking.api";
import { formatDate, formatCurrency } from "../../../utils/helpers";
import { generateBookingReceipt } from "../../../utils/pdfGenerator";
import StatusBadge from "../../../components/ui/StatusBadge";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import UserPageLayout from "../../../layout/dashboard/UserPageLayout";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import Textarea from "../../../components/ui/Textarea";

const History = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [refundModal, setRefundModal] = useState({ open: false, bookingId: null });
  const [refundReason, setRefundReason] = useState("");
  const [refundLoading, setRefundLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getUserBookings();
      const pastBookings = (res.data?.bookings || []).filter(
        b => ["completed", "cancelled", "rejected"].includes(b.status)
      ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setBookings(pastBookings);
    } catch (error) {
      toast.error("Failed to load booking history");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = filter === "all" 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const filters = [
    { key: "all", label: "All" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
    { key: "rejected", label: "Rejected" },
  ];

  const handleDownloadReceipt = (booking) => {
    if (booking.paymentReceiptUrl) {
      window.open(`http://localhost:8000${booking.paymentReceiptUrl}`, "_blank");
    } else {
      generateBookingReceipt(booking);
    }
  };

  const handleDownloadBookingPdf = (booking) => {
    if (booking.bookingPdfUrl) {
      window.open(`http://localhost:8000${booking.bookingPdfUrl}`, "_blank");
    } else {
      toast.info("Booking details PDF is not available for this booking.");
    }
  };

  const handleRequestRefund = async () => {
    if (!refundReason.trim()) {
      return toast.error("Please provide a reason for the refund");
    }
    try {
      setRefundLoading(true);
      await http.post("/refunds", {
        bookingId: refundModal.bookingId,
        reason: refundReason
      });
      toast.success("Refund request submitted successfully");
      setRefundModal({ open: false, bookingId: null });
      setRefundReason("");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit refund request");
    } finally {
      setRefundLoading(false);
    }
  };

  return (
    <UserPageLayout title="Service History" description="Your completed and past bookings">
      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar">
        {filters.map(f => (
          <Button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === f.key
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl overflow-hidden">
              <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <HistoryIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No history yet</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Your completed and cancelled bookings will appear here.
          </p>
        </div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
          <AnimatePresence>
            {filteredBookings.map((booking) => (
              <motion.div 
                key={booking._id} 
                variants={fadeUp}
                layout
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:shadow-blue-600/5 transition-all duration-300"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        booking.status === "completed" 
                          ? "bg-emerald-100 dark:bg-emerald-900/30" 
                          : booking.status === "cancelled"
                          ? "bg-amber-100 dark:bg-amber-900/30"
                          : "bg-red-100 dark:bg-red-900/30"
                      }`}>
                        {booking.status === "completed" ? (
                          <CreditCard className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                          {booking.careType} Care
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                          {booking.bookingId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {booking.paymentStatus === "paid" && (
                        <span className="px-3 py-1 text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
                          💳 Paid
                        </span>
                      )}
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-y border-slate-100 dark:border-slate-800">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-0.5">Patient</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{booking.patientName}, {booking.patientAge}y</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CalendarDays className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-0.5">Schedule</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatDate(booking.bookingDate)}</p>
                        <p className="text-xs text-slate-500">{booking.timeSlot?.startTime} - {booking.timeSlot?.endTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-0.5">Service</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{booking.serviceId?.title || "Care Service"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Receipt className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-0.5">Amount</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(booking.totalAmount)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex flex-wrap gap-3 justify-end">
                    {booking.status === "completed" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownloadReceipt(booking)}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Download className="w-4 h-4" /> Payment Receipt
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownloadBookingPdf(booking)}
                          className="flex items-center gap-2 text-sm"
                        >
                          <FileText className="w-4 h-4" /> Booking Details
                        </Button>
                      </>
                    )}
                    {["cancelled", "rejected", "completed"].includes(booking.status) && booking.paymentStatus === "paid" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRefundModal({ open: true, bookingId: booking._id })}
                        className="flex items-center gap-2 text-sm text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Undo2 className="w-4 h-4" /> Request Refund
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Refund Modal */}
      <Modal isOpen={refundModal.open} onClose={() => setRefundModal({ open: false, bookingId: null })} title="Request a Refund" size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Please provide a detailed reason for requesting a refund. Our team will review your request.
          </p>
          <Textarea
            rows={4}
            placeholder="Why are you requesting a refund?"
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setRefundModal({ open: false, bookingId: null })}>Cancel</Button>
            <Button size="sm" disabled={refundLoading || !refundReason.trim()} onClick={handleRequestRefund}>
              {refundLoading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </div>
      </Modal>
    </UserPageLayout>
  );
};

export default History;