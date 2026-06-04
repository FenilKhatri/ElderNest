import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Calendar, Search, Filter } from "lucide-react";
import { getCaregiverBookings, updateBookingStatus } from "../../booking/api/booking.api";
import { getMyProfile } from "../api/caregiver.api";
import { formatDate } from "../../../utils/helpers";
import StatusBadge from "../../../components/ui/StatusBadge";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";
import MessagePanel from "../../booking/components/MessagePanel";
import { MessageSquare, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { BOOKING_STATUS } from "../../../constants/statusConstants";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [processingId, setProcessingId] = useState(null);
  const [activeMessageBooking, setActiveMessageBooking] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [rejectingBooking, setRejectingBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const profileRes = await getMyProfile();
      const caregiverId = profileRes?.data?.caregiver?._id;
      setCurrentUserId(profileRes?.data?.caregiver?.userId?._id || profileRes?.data?.caregiver?.userId);
      
      if (caregiverId) {
        const res = await getCaregiverBookings(caregiverId);
        // sort by date descending
        const sorted = (res.data?.bookings || []).sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
        setBookings(sorted);
      }
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus, extraData = {}) => {
    if (processingId) return;

    try {
      setProcessingId(id);

      // Optimistic update
      setBookings(prev => 
        prev.map(b => b._id === id ? { ...b, status: newStatus } : b)
      );

      await updateBookingStatus(id, { status: newStatus, ...extraData });
      toast.success(`Booking ${newStatus} successfully`);
      fetchBookings();
    } catch (error) {
      toast.error(error.message || "Failed to update booking status");
      fetchBookings(); // Revert on failure
    } finally {
      setProcessingId(null);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (statusFilter === "all") return true;
    return b.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">My Bookings</h2>
          <p className="text-slate-500 dark:text-slate-400">View and manage your confirmed and completed bookings.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-slate-400" />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "all", label: "All Status" },
              { value: BOOKING_STATUS.PENDING, label: "Pending Requests" },
              { value: BOOKING_STATUS.ACCEPTED, label: "Accepted (Upcoming)" },
              { value: BOOKING_STATUS.IN_PROGRESS, label: "In Progress" },
              { value: BOOKING_STATUS.COMPLETED, label: "Completed" },
              { value: BOOKING_STATUS.CANCELLED, label: "Cancelled" },
              { value: BOOKING_STATUS.REJECTED, label: "Rejected" },
            ]}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse h-40" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No bookings found</h3>
          <p className="text-slate-500 dark:text-slate-400">
            {statusFilter === "all" ? "You don't have any active or past bookings yet." : `You have no ${statusFilter} bookings.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {booking.patientName}, {booking.patientAge}y
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 capitalize">
                      {booking.careType} Care | <span className="font-mono">{booking.bookingId}</span>
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-2">Schedule & Location</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(booking.bookingDate)}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{booking.timeSlot?.startTime} - {booking.timeSlot?.endTime}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{booking.address?.street}, {booking.address?.city}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-2">Contact Details</p>
                    <p className="text-sm text-slate-900 dark:text-white">{booking.contactNumber}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{booking.email}</p>
                    {booking.notes && (
                      <div className="mt-2 text-sm p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded">
                        <strong>Notes:</strong> {booking.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center flex-wrap gap-4">
                  <Link to={`/caregiver/bookings/${booking._id}`} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                    <ExternalLink className="w-4 h-4" /> View Full Details
                  </Link>

                  <div className="flex justify-end gap-3 flex-1">
                    {booking.status === BOOKING_STATUS.PENDING && (
                      <>
                        <Button variant="outline" onClick={() => setRejectingBooking(booking._id)} disabled={processingId === booking._id}>
                          {processingId === booking._id ? "Processing..." : "Reject"}
                        </Button>
                        <Button onClick={() => handleStatusUpdate(booking._id, BOOKING_STATUS.ACCEPTED)} disabled={processingId === booking._id}>
                          {processingId === booking._id ? "Processing..." : "Accept Request"}
                        </Button>
                      </>
                    )}
                    
                    {booking.status === BOOKING_STATUS.ACCEPTED && (
                      <>
                        <Button variant="outline" onClick={() => setActiveMessageBooking(booking)} className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" /> Message
                        </Button>
                        <Button onClick={() => handleStatusUpdate(booking._id, BOOKING_STATUS.IN_PROGRESS)} disabled={processingId === booking._id}>
                          {processingId === booking._id ? "Processing..." : "Start Care (In Progress)"}
                        </Button>
                      </>
                    )}
                    
                    {booking.status === BOOKING_STATUS.IN_PROGRESS && (
                      <>
                        <Button variant="outline" onClick={() => setActiveMessageBooking(booking)} className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" /> Message
                        </Button>
                        <Button onClick={() => handleStatusUpdate(booking._id, BOOKING_STATUS.COMPLETED)} className="bg-green-600 hover:bg-green-700 text-white" disabled={processingId === booking._id}>
                          {processingId === booking._id ? "Processing..." : "Mark Completed"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Modal */}
      <Modal
        isOpen={!!activeMessageBooking}
        onClose={() => setActiveMessageBooking(null)}
        title={`Message ${activeMessageBooking?.patientName}`}
        size="lg"
      >
        {activeMessageBooking && currentUserId && (
          <MessagePanel 
            bookingId={activeMessageBooking._id} 
            currentUserId={currentUserId} 
          />
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectingBooking}
        onClose={() => { setRejectingBooking(null); setRejectionReason(""); }}
        title="Reject Booking"
      >
        <div className="p-6">
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">Please provide a reason for rejecting this booking (10-500 characters).</p>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Reason for rejection..."
            rows={4}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => { setRejectingBooking(null); setRejectionReason(""); }}>Cancel</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={rejectionReason.length < 10 || processingId === rejectingBooking}
              onClick={() => {
                handleStatusUpdate(rejectingBooking, BOOKING_STATUS.REJECTED, { rejectionReason });
                setRejectingBooking(null);
                setRejectionReason("");
              }}
            >
              {processingId === rejectingBooking ? "Rejecting..." : "Reject Booking"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Bookings;