import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Clock, XCircle, Star } from "lucide-react";
import { getUserBookings, updateBookingStatus } from "../../booking/api/booking.api";
import http from "../../../lib/axios";
import { formatDate, formatCurrency } from "../../../utils/helpers";
import StatusBadge from "../../../components/ui/StatusBadge";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import UserPageLayout from "../../../layout/dashboard/UserPageLayout";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState({ open: false, id: null });
  const [cancelLoading, setCancelLoading] = useState(false);
  const [reviewModal, setReviewModal] = useState({ open: false, booking: null });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewLoading, setReviewLoading] = useState(false);

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

  const handleSubmitReview = async () => {
    try {
      setReviewLoading(true);
      await http.post("/reviews", {
        bookingId: reviewModal.booking._id,
        caregiverId: reviewModal.booking.caregiverId?._id || reviewModal.booking.caregiverId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      toast.success("Thank you for your review!");
      setReviewModal({ open: false, booking: null });
      fetchBookings();
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
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

  return (
    <UserPageLayout title="My bookings" description="Active and upcoming care appointments">
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-40 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No bookings yet</h3>
          <p className="text-slate-500 dark:text-slate-400">Book a caregiver for your loved ones to get started.</p>
        </div>
      ) : (
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
                
                <div className="flex gap-4">
                  {booking.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => setCancelModal({ open: true, id: booking._id })}
                      className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" /> Cancel
                    </button>
                  )}
                  {booking.status === "completed" && (
                    <button
                      type="button"
                      onClick={() => setReviewModal({ open: true, booking })}
                      className="text-sm font-medium text-amber-600 hover:underline flex items-center gap-1"
                    >
                      <Star className="w-4 h-4" /> Leave Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

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

      <Modal
        isOpen={reviewModal.open}
        onClose={() => setReviewModal({ open: false, booking: null })}
        title="Leave a Review"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Rating</label>
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} stars</option>
              ))}
            </select>
          </div>
          <textarea
            rows={3}
            placeholder="Share your experience..."
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setReviewModal({ open: false, booking: null })}>Cancel</Button>
            <Button size="sm" onClick={handleSubmitReview} disabled={reviewLoading}>
              {reviewLoading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </Modal>
    </UserPageLayout>
  );
};

export default MyBookings;