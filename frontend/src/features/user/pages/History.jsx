import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Clock, History as HistoryIcon, Download } from "lucide-react";
import { getUserBookings } from "../../booking/api/booking.api";
import { formatDate } from "../../../utils/helpers";
import { generateBookingReceipt } from "../../../utils/pdfGenerator";
import StatusBadge from "../../../components/ui/StatusBadge";
import Button from "../../../components/ui/Button";
import UserPageLayout from "../../../layout/dashboard/UserPageLayout";

const History = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getUserBookings();
      // Filter for past bookings (completed, cancelled, rejected)
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

  return (
    <UserPageLayout title="Service history" description="Completed and cancelled bookings">
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-32 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12">
          <HistoryIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No history yet</h3>
          <p className="text-slate-500 dark:text-slate-400">Your completed and cancelled bookings will appear here.</p>
        </div>
      ) : (
    <div className="space-y-4">

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
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">Schedule</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(booking.bookingDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">Caregiver</p>
                  {booking.caregiverId ? (
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Assigned</p>
                  ) : (
                    <p className="text-sm text-slate-500">None</p>
                  )}
                </div>
              </div>
              
              {booking.status === "completed" && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => generateBookingReceipt(booking)}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download Receipt
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
      )}
    </UserPageLayout>
  );
};

export default History;