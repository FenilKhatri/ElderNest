import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Calendar, Search, Filter } from "lucide-react";
import { getCaregiverBookings, updateBookingStatus } from "../../booking/api/booking.api";
import { getMyProfile } from "../api/caregiver.api";
import { formatDate } from "../../../utils/helpers";
import StatusBadge from "../../../components/ui/StatusBadge";
import Button from "../../../components/ui/Button";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const profileRes = await getMyProfile();
      const caregiverId = profileRes?.data?.caregiver?._id;
      
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

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, { status: newStatus });
      toast.success(`Booking ${newStatus} successfully`);
      fetchBookings();
    } catch (error) {
      toast.error(error.message || "Failed to update booking status");
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Status</option>
            <option value="accepted">Accepted (Upcoming)</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
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
          {filteredBookings.filter(b => b.status !== "pending" && b.status !== "rejected").map((booking) => (
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

                {booking.status === "accepted" && (
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                    <Button onClick={() => handleStatusUpdate(booking._id, "in-progress")}>
                      Start Care (In Progress)
                    </Button>
                  </div>
                )}
                
                {booking.status === "in-progress" && (
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                    <Button onClick={() => handleStatusUpdate(booking._id, "completed")} className="bg-green-600 hover:bg-green-700 text-white">
                      Mark Completed
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;