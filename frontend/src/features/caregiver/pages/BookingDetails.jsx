import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getBookingById } from "../../booking/api/booking.api";
import { 
  ArrowLeft, Calendar, Clock, MapPin, User, FileText, 
  Phone, Activity, ShieldAlert, Download, CreditCard, Stethoscope
} from "lucide-react";
import { formatDate } from "../../../utils/helpers";
import StatusBadge from "../../../components/ui/StatusBadge";
import Button from "../../../components/ui/Button";
import GlobalLoader from "../../../components/ui/GlobalLoader";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const res = await getBookingById(id);
        setBooking(res.data?.booking);
      } catch (error) {
        toast.error("Failed to load booking details");
        navigate("/caregiver/bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [id, navigate]);

  if (loading) return <GlobalLoader />;
  if (!booking) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              Booking Details
              <StatusBadge status={booking.status} />
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              ID: <span className="font-mono">{booking.bookingId}</span> • Requested on {formatDate(booking.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {booking.bookingPdfUrl && (
            <a 
              href={`${import.meta.env.VITE_API_URL}${booking.bookingPdfUrl}`} 
              target="_blank" 
              rel="noreferrer"
            >
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" /> Booking Summary
              </Button>
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Patient Details */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <User className="w-5 h-5 text-blue-600" /> Patient Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Name</p>
                <p className="font-medium text-slate-900 dark:text-white">{booking.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Age</p>
                <p className="font-medium text-slate-900 dark:text-white">{booking.patientAge} years</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Activity className="w-4 h-4" /> Medical Condition / Disease
                </p>
                <p className="font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  {booking.disease || "No specific condition reported"}
                </p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Stethoscope className="w-5 h-5 text-teal-600" /> Service Requested
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Service Category</p>
                <p className="font-medium text-slate-900 dark:text-white">{booking.serviceId?.title}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Care Type</p>
                <p className="font-medium text-slate-900 dark:text-white capitalize">{booking.careType} Care</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Duration Basis</p>
                <p className="font-medium text-slate-900 dark:text-white capitalize">{booking.durationType} Basis</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Duration</p>
                <p className="font-medium text-slate-900 dark:text-white">{booking.duration} hours</p>
              </div>
            </div>
            {booking.notes && (
              <div className="mt-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <FileText className="w-4 h-4" /> Special Instructions
                </p>
                <p className="font-medium text-slate-900 dark:text-white bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-900/30 text-amber-900 dark:text-amber-100">
                  {booking.notes}
                </p>
              </div>
            )}
          </div>
          
          {/* Location Details */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <MapPin className="w-5 h-5 text-indigo-600" /> Location & Contact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Contact Number</p>
                <p className="font-medium text-slate-900 dark:text-white">{booking.contactNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Email Address</p>
                <p className="font-medium text-slate-900 dark:text-white">{booking.email}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Full Address</p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {booking.address?.street}<br/>
                  {booking.address?.city}, {booking.address?.state} {booking.address?.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          
          {/* Schedule */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" /> Schedule
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Date</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatDate(booking.bookingDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Time Slot
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {booking.timeSlot?.startTime} - {booking.timeSlot?.endTime}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-green-600" /> Payment Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Total Amount</span>
                <span className="font-bold text-lg text-slate-900 dark:text-white">Rs. {booking.totalAmount?.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Status</span>
                <span className={`font-semibold capitalize ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                  {booking.paymentStatus}
                </span>
              </div>
              {booking.transactionId && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Transaction ID</p>
                  <p className="font-mono text-sm text-slate-900 dark:text-white">{booking.transactionId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 p-6 shadow-sm">
            <h3 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5" /> Emergency Contact
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-red-600/70 dark:text-red-400/70 uppercase font-semibold">Name & Relation</p>
                <p className="font-medium text-red-900 dark:text-red-300">
                  {booking.emergencyContact?.name} ({booking.emergencyContact?.relation})
                </p>
              </div>
              <div className="pt-2">
                <p className="text-xs text-red-600/70 dark:text-red-400/70 uppercase font-semibold">Phone Number</p>
                <a href={`tel:${booking.emergencyContact?.phone}`} className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1 hover:underline">
                  <Phone className="w-4 h-4" /> {booking.emergencyContact?.phone}
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
