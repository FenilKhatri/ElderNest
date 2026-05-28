import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { getUserBookings, updateBookingStatus } from "../../booking/api/booking.api";
import { formatDate, formatCurrency } from "../../../utils/helpers";
import StatusBadge from "../../../components/ui/StatusBadge";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState({ open: false, id: null });
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getUserBookings();
      // sort by date descending
      const sorted = (res.data?.bookings || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(sorted);
    } catch (error) {
      toast.error("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      setCancelLoading(true);
      await updateBookingStatus(cancelModal.id, { status: "cancelled", reason: "Cancelled by user" });
      toast.success("Booking cancelled successfully");
      setCancelModal({ open: false, id: null });
      fetchBookings();
    } catch (error) {
      toast.error(error.message || "Failed to cancel booking");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse h-40" />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No bookings yet</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          You haven't made any bookings yet. Book a caregiver for your loved ones today.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">My Bookings</h2>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {booking.careType} Care
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Booking ID: <span className="font-mono">{booking.bookingId}</span>
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4 border-y border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">Patient Details</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{booking.patientName}, {booking.patientAge}y</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{booking.disease}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">Schedule</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(booking.bookingDate)}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{booking.timeSlot?.startTime} - {booking.timeSlot?.endTime}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">Caregiver</p>
                  {booking.caregiverId ? (
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Assigned</p>
                  ) : (
                    <p className="text-sm text-amber-600 dark:text-amber-400">Finding the best match...</p>
                  )}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Booked on {formatDate(booking.createdAt)}
                </div>
                
                {booking.status === "pending" && (
                  <button
                    onClick={() => setCancelModal({ open: true, id: booking._id })}
                    className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 hover:underline flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" /> Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={cancelModal.open}
        onClose={() => setCancelModal({ open: false, id: null })}
        title="Cancel Booking"
        size="sm"
      >
        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelModal({ open: false, id: null })}
              disabled={cancelLoading}
            >
              No, Keep It
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleCancelBooking}
              disabled={cancelLoading}
            >
              {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyBookings;