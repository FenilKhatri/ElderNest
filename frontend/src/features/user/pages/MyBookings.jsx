import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, XCircle, Star, Plus, LayoutGrid, List,
  ChevronLeft, ChevronRight, MessageSquare,
  User
} from "lucide-react";
import { getUserBookings, updateBookingStatus } from "../../booking/api/booking.api";
import http from "../../../lib/axios";
import { formatDate, formatCurrency, formatTime, getInitials } from "../../../utils/helpers";
import StatusBadge from "../../../components/ui/StatusBadge";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import UserPageLayout from "../../../layout/dashboard/UserPageLayout";
import MessagePanel from "../../booking/components/MessagePanel";
import { useAuth } from "../../../context/AuthContext";
import Textarea from "../../../components/ui/Textarea";
import EmptyState from "../../../components/ui/EmptyState";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import { resolveAssetUrl } from "../../../utils/blogImage";
import { BOOKING_STATUS } from "../../../constants/statusConstants";
import { TABS, PER_PAGE } from "../../../constants/tabs/myBookings";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [layout, setLayout] = useState("list");
  const [page, setPage] = useState(1);
  const [cancelModal, setCancelModal] = useState({ open: false, id: null });
  const [cancelLoading, setCancelLoading] = useState(false);
  const [reviewModal, setReviewModal] = useState({ open: false, booking: null });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [activeMessageBooking, setActiveMessageBooking] = useState(null);
  const { user } = useAuth();
  const currentUserId = user?._id;

  useEffect(() => {
    fetchBookings();
  }, []);

  // Reset page when tab changes
  useEffect(() => {
    setPage(1);
  }, [tab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getUserBookings();
      const sorted = (res.data?.bookings || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBookings(sorted);
    } catch (error) {
      toast.error("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  // Filtered bookings
  const filtered = useMemo(() => {
    if (tab === "all") return bookings;
    return bookings.filter((b) => b.status === tab);
  }, [bookings, tab]);

  // Tab counts
  const counts = useMemo(() => {
    const c = { all: bookings.length };
    TABS.forEach((t) => {
      if (t.id !== "all") c[t.id] = bookings.filter((b) => b.status === t.id).length;
    });
    return c;
  }, [bookings]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [filtered, page]
  );
  const showingStart = filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1;
  const showingEnd = Math.min(page * PER_PAGE, filtered.length);

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
      await updateBookingStatus(cancelModal.id, { status: BOOKING_STATUS.CANCELLED, reason: "Cancelled by user" });
      toast.success("Booking cancelled successfully");
      setCancelModal({ open: false, id: null });
      fetchBookings();
    } catch (error) {
      toast.error(error.message || "Failed to cancel booking");
    } finally {
      setCancelLoading(false);
    }
  };

  const getCaregiverName = (booking) => {
    if (booking.caregiverId?.userId?.name) return booking.caregiverId.userId.name;
    if (booking.caregiverId?.fullName) return booking.caregiverId.fullName;
    return "Caregiver";
  };

  const getCaregiverImage = (booking) => {
    const img =
      booking.caregiverId?.userId?.profileImage ||
      booking.caregiverId?.profileImage;
    return img ? resolveAssetUrl(img) : null;
  };

  const getCaregiverRole = (booking) => {
    if (booking.serviceId?.title) return booking.serviceId.title;
    return booking.careType ? `${booking.careType} Care` : "Caregiver";
  };

  /* ─── Booking Card (List View) ─── */
  const BookingCardList = ({ booking }) => {
    const name = getCaregiverName(booking);
    const img = getCaregiverImage(booking);
    const role = getCaregiverRole(booking);

    return (
      <motion.div
        variants={fadeUp}
        onClick={() => navigate(`/user/bookings/${booking._id}`)}
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          {/* Caregiver info */}
          <div className="flex items-center gap-3 lg:w-[220px] shrink-0">
            {img ? (
              <img src={img} alt={name} className="w-11 h-11 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                {getInitials(name)}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{role}</p>
            </div>
          </div>

          {/* Details grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-0.5">Service</p>
              <p className="font-medium text-slate-800 dark:text-slate-200">{booking.serviceId?.title || booking.careType}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-0.5">Schedule</p>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {formatDate(booking.bookingDate)}
                {booking.timeSlot?.startTime && (
                  <span className="text-slate-500 dark:text-slate-400"> at {formatTime(booking.timeSlot.startTime)}</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-0.5">Patient</p>
              <p className="font-medium text-slate-800 dark:text-slate-200">{booking.patientName}</p>
            </div>
          </div>

          {/* Status + actions */}
          <div className="flex flex-col items-end gap-2 shrink-0 lg:w-[140px]">
            <StatusBadge status={booking.status} />
            {booking.refundStatus && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800 capitalize">
                Refund: {booking.refundStatus}
              </span>
            )}
            <div className="flex gap-2">
              {booking.status === BOOKING_STATUS.PENDING && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCancelModal({ open: true, id: booking._id });
                  }}
                  className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" /> Cancel
                </button>
              )}
              {[BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.IN_PROGRESS].includes(booking.status) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMessageBooking(booking);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Message
                </button>
              )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReviewModal({ open: true, booking });
                  }}
                  className="text-xs text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1 transition-colors"
                >
                  <Star className="w-3.5 h-3.5" /> Review
                </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/user/bookings/${booking._id}`);
                }}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1 transition-colors cursor-pointer"
              >
                <List className="w-3.5 h-3.5" /> View Details
              </button>
            </div>
          </div>
        </div>
        
        {/* Refund / Rejection Reason Section */}
        {(booking.rejectionReason || booking.cancellationReason) && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg p-3">
            <p className="text-[11px] uppercase tracking-wider text-red-600 dark:text-red-400 font-semibold mb-1">
              {booking.status === 'rejected' ? 'Rejection Reason' : 'Cancellation Reason'}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {booking.rejectionReason || booking.cancellationReason}
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  /* ─── Booking Card (Grid View) ─── */
  const BookingCardGrid = ({ booking }) => {
    const name = getCaregiverName(booking);
    const img = getCaregiverImage(booking);
    const role = getCaregiverRole(booking);

    return (
      <motion.div
        variants={fadeUp}
        onClick={() => navigate(`/user/bookings/${booking._id}`)}
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-shadow flex flex-col cursor-pointer"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {img ? (
              <img src={img} alt={name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                {getInitials(name)}
              </div>
            )}
            <div>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">{name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusBadge status={booking.status} />
            {booking.refundStatus && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800 capitalize">
                Refund: {booking.refundStatus}
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm flex-1">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-0.5">Service</p>
            <p className="font-medium text-slate-800 dark:text-slate-200">{booking.serviceId?.title || booking.careType}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-0.5">Patient</p>
            <p className="font-medium text-slate-800 dark:text-slate-200">{booking.patientName}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-0.5">Schedule</p>
            <p className="font-medium text-slate-800 dark:text-slate-200">
              {formatDate(booking.bookingDate)}
              {booking.timeSlot?.startTime && ` at ${formatTime(booking.timeSlot.startTime)}`}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-0.5">Amount</p>
            <p className="font-medium text-slate-800 dark:text-slate-200">{formatCurrency(booking.totalAmount)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-0.5">Booking ID</p>
            <p className="font-mono text-xs text-slate-600 dark:text-slate-400">{booking.bookingId}</p>
          </div>
        </div>

        {/* Refund / Rejection Reason Section */}
        {(booking.rejectionReason || booking.cancellationReason) && (
          <div className="mt-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg p-3">
            <p className="text-[11px] uppercase tracking-wider text-red-600 dark:text-red-400 font-semibold mb-1">
              {booking.status === 'rejected' ? 'Rejection Reason' : 'Cancellation Reason'}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {booking.rejectionReason || booking.cancellationReason}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          {booking.status === BOOKING_STATUS.PENDING && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCancelModal({ open: true, id: booking._id });
              }}
              className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" /> Cancel
            </button>
          )}
          {[BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.IN_PROGRESS].includes(booking.status) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveMessageBooking(booking);
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Message
            </button>
          )}
          {booking.status === BOOKING_STATUS.COMPLETED && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setReviewModal({ open: true, booking });
              }}
              className="text-xs text-amber-600 hover:underline flex items-center gap-1"
            >
              <Star className="w-3.5 h-3.5" /> Review
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/user/bookings/${booking._id}`);
            }}
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <List className="w-3.5 h-3.5" /> View Details
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <UserPageLayout
      title="My bookings"
      description="Active and upcoming care appointments"
      action={
        <Button onClick={() => navigate("/caregivers")} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Booking
        </Button>
      }
    >
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
        {/* ─── Tabs + Layout Toggle ─── */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${tab === t.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
              >
                {t.label}
                {counts[t.id] > 0 && (
                  <span
                    className={`text-[10px] leading-none px-1.5 py-0.5 rounded-full font-semibold ${tab === t.id
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                  >
                    {counts[t.id]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Layout toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit shrink-0">
            <button
              type="button"
              onClick={() => setLayout("list")}
              className={`p-2 rounded-md transition-all ${layout === "list"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setLayout("grid")}
              className={`p-2 rounded-md transition-all ${layout === "grid"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* ─── Content ─── */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div variants={fadeUp}>
            <EmptyState
              icon={Clock}
              title={tab === "all" ? "No bookings yet" : `No ${tab} bookings`}
              description={
                tab === "all"
                  ? "Book a caregiver for your loved ones to get started."
                  : `You don't have any ${tab} bookings at the moment.`
              }
              action={
                tab === "all" && (
                  <Button onClick={() => navigate("/caregivers")} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Browse Caregivers
                  </Button>
                )
              }
            />
          </motion.div>
        ) : (
          <>
            {/* Cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${tab}-${layout}-${page}`}
                variants={stagger}
                initial="hidden"
                animate="show"
                className={
                  layout === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                    : "space-y-3"
                }
              >
                {paginated.map((booking) =>
                  layout === "list" ? (
                    <BookingCardList key={booking._id} booking={booking} />
                  ) : (
                    <BookingCardGrid key={booking._id} booking={booking} />
                  )
                )}
              </motion.div>
            </AnimatePresence>

            {/* ─── Pagination ─── */}
            {totalPages > 1 && (
              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2"
              >
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{showingStart}-{showingEnd}</span> of{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{filtered.length}</span> bookings
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === p
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </motion.div>

      {/* ─── Cancel Modal ─── */}
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

      {/* ─── Review Modal ─── */}
      <Modal
        isOpen={reviewModal.open}
        onClose={() => setReviewModal({ open: false, booking: null })}
        title="Leave a Review"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Rating</label>
            <Select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
              options={[
                { value: 5, label: "5 stars" },
                { value: 4, label: "4 stars" },
                { value: 3, label: "3 stars" },
                { value: 2, label: "2 stars" },
                { value: 1, label: "1 star" },
              ]}
              className="mt-1"
            />
          </div>
          <Textarea
            rows={3}
            placeholder="Share your experience..."
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setReviewModal({ open: false, booking: null })}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmitReview} disabled={reviewLoading}>
              {reviewLoading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── Message Modal ─── */}
      <Modal
        isOpen={!!activeMessageBooking}
        onClose={() => setActiveMessageBooking(null)}
        title="Message Caregiver"
        size="lg"
      >
        {activeMessageBooking && currentUserId && (
          <MessagePanel bookingId={activeMessageBooking._id} currentUserId={currentUserId} />
        )}
      </Modal>
    </UserPageLayout>
  );
};

export default MyBookings;