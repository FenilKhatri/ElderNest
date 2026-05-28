import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { getCaregiverBookings, updateBookingStatus } from "../../booking/api/booking.api";
import { getMyProfile } from "../api/caregiver.api";
import { formatDate } from "../../../utils/helpers";
import Button from "../../../components/ui/Button";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const profileRes = await getMyProfile();
      const caregiverId = profileRes?.data?.caregiver?._id;
      
      if (caregiverId) {
        const res = await getCaregiverBookings(caregiverId, "pending");
        // sort by date descending
        const sorted = (res.data?.bookings || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRequests(sorted);
      }
    } catch (error) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, { status: newStatus, reason: newStatus === 'rejected' ? 'Caregiver declined' : '' });
      toast.success(`Request ${newStatus} successfully`);
      fetchRequests();
    } catch (error) {
      toast.error(error.message || "Failed to update request status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Booking Requests</h2>
        <p className="text-slate-500 dark:text-slate-400">Review and accept or decline incoming care requests.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse h-40" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No pending requests</h3>
          <p className="text-slate-500 dark:text-slate-400">
            You don't have any new booking requests at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request._id} className="bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-800 overflow-hidden shadow-sm">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold rounded-full mb-2 uppercase tracking-wide">
                      New Request
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {request.patientName}, {request.patientAge}y
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 capitalize">
                      {request.careType} Care | <span className="font-mono">{request.bookingId}</span>
                    </p>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 text-right">
                    Requested on<br/>{formatDate(request.createdAt)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-2">Schedule & Location</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(request.bookingDate)}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{request.timeSlot?.startTime} - {request.timeSlot?.endTime}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{request.address?.street}, {request.address?.city}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-2">Patient Details</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Disease/Condition:</strong> {request.disease || "None reported"}</p>
                    {request.notes && (
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        <strong>Notes:</strong> {request.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
                    onClick={() => handleStatusUpdate(request._id, "rejected")}
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Decline
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white border-transparent"
                    onClick={() => handleStatusUpdate(request._id, "accepted")}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Accept Request
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;