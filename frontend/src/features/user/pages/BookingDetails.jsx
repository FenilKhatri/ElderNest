import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Star,
} from "lucide-react";
import { getBookingById } from "../../booking/api/booking.api";
import { formatDate, formatTime, formatCurrency, getInitials, getApiErrorMessage } from "../../../utils/helpers";
import { resolveAssetUrl } from "../../../utils/blogImage";
import StatusBadge from "../../../components/ui/StatusBadge";
import Button from "../../../components/ui/Button";
import GlobalLoader from "../../../components/ui/GlobalLoader";
import UserPageLayout from "../../../layout/dashboard/UserPageLayout";
import Modal from "../../../components/ui/Modal";
import MessagePanel from "../../booking/components/MessagePanel";
import { useAuth } from "../../../context/AuthContext";
import { BOOKING_STATUS } from "../../../constants/statusConstants";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMessageBooking, setActiveMessageBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await getBookingById(id);
        setBooking(res.data?.booking);
      } catch (error) {
        toast.error(getApiErrorMessage(error));
        navigate("/user/bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id, navigate]);

  if (loading) return <GlobalLoader />;
  if (!booking) return null;

  const caregiver = booking.caregiverId;
  const cgUser = caregiver?.userId || {};
  const caregiverName = cgUser.name || caregiver?.fullName || "Assigned Caregiver";
  const caregiverImg = cgUser.profileImage || caregiver?.profileImage;
  const caregiverRole = "Registered Caregiver";

  const timelineEvents = [
    { label: "Booking Requested", date: booking.createdAt, completed: true },
    {
      label: "Caregiver Assigned",
      date: booking.createdAt,
      completed: ["accepted", "in-progress", "completed"].includes(booking.status)
    },
    {
      label: "Service Started",
      date: booking.status === "in-progress" || booking.status === "completed" ? (booking.updatedAt || new Date()) : null,
      completed: ["in-progress", "completed"].includes(booking.status)
    },
    {
      label: "Service Completed",
      date: booking.completedAt,
      completed: booking.status === "completed"
    }
  ];

  return (
    <UserPageLayout
      backTo="/user/bookings"
      backLabel="Back to Bookings"
      title={
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {booking.serviceId?.title || booking.careType}
          </span>
          <StatusBadge status={booking.status} />
        </div>
      }
      description={
        <span className="text-sm font-normal text-slate-500">
          Booking ID: #{booking.bookingId}
        </span>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 w-full">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Assigned Caregiver Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              Assigned Caregiver
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {caregiverImg ? (
                  <img
                    src={resolveAssetUrl(caregiverImg)}
                    alt={caregiverName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl border-2 border-slate-100 dark:border-slate-700">
                    {getInitials(caregiverName)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{caregiverName}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {caregiverRole} • {caregiver?.experience || 0} Years Exp.
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {caregiver?.rating || "New"} ({caregiver?.totalReviews || 0} Reviews)
                  </div>
                </div>
              </div>
              {[BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.IN_PROGRESS].includes(booking.status) && (
                <Button variant="outline" size="sm" onClick={() => setActiveMessageBooking(booking)}>
                  Message
                </Button>
              )}
            </div>
          </div>

          {/* Service & Patient Details */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              Service & Patient Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-1">Service Type</p>
                <p className="font-medium text-slate-900 dark:text-white">{booking.serviceId?.title || booking.careType}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-1">Patient Name</p>
                <p className="font-medium text-slate-900 dark:text-white">{booking.patientName}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-1">Age / Gender</p>
                <p className="font-medium text-slate-900 dark:text-white">{booking.patientAge} Years</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-1">Medical Condition</p>
                <p className="font-medium text-slate-900 dark:text-white">{booking.disease}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-slate-500 dark:text-slate-400 mb-1">Service Address</p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {booking.address?.street}, {booking.address?.city}, {booking.address?.state} {booking.address?.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Special Instructions / Notes */}
          {booking.notes && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                Special Instructions
              </h2>
              <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl text-emerald-800 dark:text-emerald-200 text-sm leading-relaxed">
                {booking.notes}
              </div>
            </div>
          )}

          {/* Review Banner */}
          {booking.status === "completed" && (
            <div className="bg-blue-600 dark:bg-blue-600 text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold mb-1">How was your experience?</h3>
                <p className="text-blue-100 text-sm">Your feedback helps us maintain the highest quality of care for your loved ones.</p>
              </div>
              <Button className="bg-white text-blue-600 hover:bg-slate-50 whitespace-nowrap shrink-0 border-none">
                Leave a Review
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Schedule */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Schedule</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Date</span>
                <span className="font-medium text-slate-900 dark:text-white">{formatDate(booking.bookingDate)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Time</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {formatTime(booking.timeSlot?.startTime)} - {formatTime(booking.timeSlot?.endTime)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Duration</span>
                <span className="font-medium text-slate-900 dark:text-white">{booking.duration || booking.quantity} {booking.billingType === 'hourly' ? 'Hours' : 'Days'}</span>
              </div>
            </div>
          </div>

          {/* Booking Status Timeline */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Booking Status</h3>
            <div className="space-y-6 relative">
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="relative flex items-center justify-between group">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-4 z-10 ${event.completed ? 'bg-blue-600 border-white dark:border-slate-900' : 'bg-slate-200 dark:bg-slate-700 border-white dark:border-slate-900'}`}>
                    <div className={`w-2 h-2 rounded-full ${event.completed ? 'bg-white' : 'bg-transparent'}`} />
                  </div>
                  <div className="flex-1 ml-4 flex flex-col">
                    <p className={`text-sm font-medium ${event.completed ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{event.label}</p>
                    {event.date && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{formatDate(event.date)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Payment Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">{booking.serviceId?.title || 'Service'} ({booking.quantity}{booking.billingType === 'hourly' ? 'h' : 'd'})</span>
                <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(booking.totalAmount)}</span>
              </div>
              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">Total Paid</span>
                <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{formatCurrency(booking.totalAmount)}</span>
              </div>
              {booking.transactionId && (
                <p className="text-xs text-slate-500 text-right mt-2">
                  Paid via {booking.paymentStatus} • ID: {booking.transactionId}
                </p>
              )}
            </div>
          </div>

        </div>
      </div>

      <Modal
        isOpen={!!activeMessageBooking}
        onClose={() => setActiveMessageBooking(null)}
        title="Message Caregiver"
        size="lg"
      >
        {activeMessageBooking && user?._id && (
          <MessagePanel bookingId={activeMessageBooking._id} currentUserId={user._id} />
        )}
      </Modal>

    </UserPageLayout>
  );
};

export default BookingDetails;
