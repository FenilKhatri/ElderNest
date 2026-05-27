import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Search, Eye, Filter } from "lucide-react";
import { getAllBookings, updateBookingStatus } from "../api/admin.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { formatDate } from "../../../utils/helpers";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import StatusBadge from "../../../components/ui/StatusBadge";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modals
  const [viewModal, setViewModal] = useState({ open: false, booking: null });
  const [statusModal, setStatusModal] = useState({ open: false, booking: null });
  const [statusLoading, setStatusLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState("");

  const statuses = [
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let result = bookings;
    
    if (statusFilter !== "all") {
      result = result.filter(b => b.status === statusFilter);
    }
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b => 
        b.patientName?.toLowerCase().includes(q) ||
        b.bookingId?.toLowerCase().includes(q) ||
        b.contactNumber?.includes(q) ||
        b.email?.toLowerCase().includes(q)
      );
    }
    
    setFiltered(result);
  }, [search, statusFilter, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getAllBookings();
      const data = res?.data?.bookings || [];
      setBookings(data);
      setFiltered(data);
    } catch (error) {
      toast.error(error?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }

    if ((newStatus === "rejected" || newStatus === "cancelled") && !reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    try {
      setStatusLoading(true);
      await updateBookingStatus(statusModal.booking._id, newStatus, reason);
      toast.success("Booking status updated successfully");
      setStatusModal({ open: false, booking: null });
      setNewStatus("");
      setReason("");
      fetchBookings();
    } catch (error) {
      toast.error(error?.message || "Failed to update booking status");
    } finally {
      setStatusLoading(false);
    }
  };

  const openStatusModal = (booking) => {
    setNewStatus(booking.status);
    setStatusModal({ open: true, booking });
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Booking Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            View and manage all bookings
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by patient name, booking ID, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="all">All Status</option>
          {statuses.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </motion.div>

      {/* Bookings Table */}
      <motion.div
        variants={fadeUp}
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
      >
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                    >
                      {search || statusFilter !== "all"
                        ? "No bookings match your filters"
                        : "No bookings found"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                        {booking.bookingId}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {booking.patientName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Age: {booking.patientAge} | {booking.careType}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-slate-900 dark:text-white">
                            {booking.contactNumber}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {booking.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(booking.bookingDate)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewModal({ open: true, booking })}
                            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openStatusModal(booking)}
                            className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                            title="Update Status"
                          >
                            <Filter className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Summary */}
      {!loading && filtered.length > 0 && (
        <motion.p
          variants={fadeUp}
          className="text-sm text-slate-500 dark:text-slate-400"
        >
          Showing {filtered.length} of {bookings.length} bookings
        </motion.p>
      )}

      {/* View Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, booking: null })}
        title="Booking Details"
        size="lg"
      >
        {viewModal.booking && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {viewModal.booking.bookingId}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Booked on {formatDate(viewModal.booking.createdAt)}
                </p>
              </div>
              <StatusBadge status={viewModal.booking.status} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Patient Information
                </h4>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-slate-500 dark:text-slate-400">Name</dt>
                    <dd className="text-slate-900 dark:text-white font-medium">
                      {viewModal.booking.patientName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 dark:text-slate-400">Age</dt>
                    <dd className="text-slate-900 dark:text-white font-medium">
                      {viewModal.booking.patientAge} years
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 dark:text-slate-400">Condition</dt>
                    <dd className="text-slate-900 dark:text-white font-medium">
                      {viewModal.booking.disease}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 dark:text-slate-400">Care Type</dt>
                    <dd className="text-slate-900 dark:text-white font-medium capitalize">
                      {viewModal.booking.careType}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Contact Information
                </h4>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-slate-500 dark:text-slate-400">Phone</dt>
                    <dd className="text-slate-900 dark:text-white font-medium">
                      {viewModal.booking.contactNumber}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 dark:text-slate-400">Email</dt>
                    <dd className="text-slate-900 dark:text-white font-medium">
                      {viewModal.booking.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 dark:text-slate-400">Address</dt>
                    <dd className="text-slate-900 dark:text-white font-medium">
                      {viewModal.booking.address?.street}, {viewModal.booking.address?.city}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Booking Schedule
              </h4>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-900 dark:text-white">
                  <span className="font-medium">Date:</span> {formatDate(viewModal.booking.bookingDate)}
                </p>
                <p className="text-sm text-slate-900 dark:text-white mt-2">
                  <span className="font-medium">Time:</span> {viewModal.booking.timeSlot?.startTime} - {viewModal.booking.timeSlot?.endTime}
                </p>
              </div>
            </div>

            {viewModal.booking.notes && (
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Additional Notes
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  {viewModal.booking.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={statusModal.open}
        onClose={() => {
          setStatusModal({ open: false, booking: null });
          setNewStatus("");
          setReason("");
        }}
        title="Update Booking Status"
        size="md"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              New Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          {(newStatus === "rejected" || newStatus === "cancelled") && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Reason *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter reason for rejection/cancellation"
                required
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setStatusModal({ open: false, booking: null });
                setNewStatus("");
                setReason("");
              }}
              disabled={statusLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={statusLoading}
            >
              {statusLoading ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Bookings;
