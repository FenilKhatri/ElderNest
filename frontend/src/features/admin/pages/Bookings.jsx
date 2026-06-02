import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Eye, Filter, LayoutGrid, List, Trash2 } from "lucide-react";
import { getAllBookings, updateBookingStatus, deleteBooking } from "../api/admin.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { formatDate } from "../../../utils/helpers";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import StatusBadge from "../../../components/ui/StatusBadge";
import SearchFilterBar from "../../../components/filters/SearchFilterBar";
import GridLayout, { GridSkeleton } from "../../../components/layout/GridLayout";
import EntityCard from "../../../components/cards/EntityCard";
import Select from "../../../components/ui/Select";
import ConfirmModal from "../../../components/ui/ConfirmModal";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [layout, setLayout] = useState("grid");
  
  // Modals
  const [viewModal, setViewModal] = useState({ open: false, booking: null });
  const [statusModal, setStatusModal] = useState({ open: false, booking: null });
  const [statusLoading, setStatusLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, bookingId: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const filteredBookings = useMemo(() => {
    let result = bookings;
    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.patientName?.toLowerCase().includes(q) ||
          b.bookingId?.toLowerCase().includes(q) ||
          b.contactNumber?.includes(q) ||
          b.email?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, statusFilter, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getAllBookings();
      const data = res?.data?.bookings || [];
      setBookings(data);
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

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteBooking(deleteModal.bookingId);
      toast.success("Booking deleted successfully");
      setDeleteModal({ open: false, bookingId: null });
      fetchBookings();
    } catch (error) {
      toast.error(error?.message || "Failed to delete booking");
    } finally {
      setDeleteLoading(false);
    }
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

      <motion.div variants={fadeUp}>
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by patient, booking ID, phone, or email..."
          filters={[
            {
              key: "status",
              label: "Status",
              value: statusFilter,
              onChange: setStatusFilter,
              options: [{ value: "all", label: "All statuses" }, ...statuses],
            },
          ]}
          onClear={() => {
            setSearch("");
            setStatusFilter("all");
          }}
        />
        
        {/* Layout Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit mt-4 ml-auto">
          <button
            onClick={() => setLayout("table")}
            className={`p-2 rounded-md transition-all ${layout === "table" ? "bg-white dark:bg-slate-900 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"}`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayout("grid")}
            className={`p-2 rounded-md transition-all ${layout === "grid" ? "bg-white dark:bg-slate-900 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"}`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        {loading ? (
          layout === "grid" ? <GridSkeleton count={6} /> : (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse h-12 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-full" />
              ))}
            </div>
          )
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
            {search || statusFilter !== "all" ? "No bookings match your filters" : "No bookings found"}
          </div>
        ) : (
          layout === "grid" ? (
            <GridLayout>
              {filteredBookings.map((booking) => (
                <EntityCard
                  key={booking._id}
                  footer={
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setViewModal({ open: true, booking })}
                        className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openStatusModal(booking)}
                        className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600"
                        title="Update status"
                      >
                        <Filter className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteModal({ open: true, bookingId: booking._id })}
                        className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600"
                        title="Delete booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  }
                >
                  <p className="text-xs font-mono text-slate-500 mb-2">{booking.bookingId}</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{booking.patientName}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Age {booking.patientAge} · {booking.careType}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{booking.contactNumber}</p>
                  <p className="text-xs text-slate-500 truncate">{booking.email}</p>
                  <p className="text-xs text-slate-400 mt-2">{formatDate(booking.bookingDate)}</p>
                  <div className="mt-3">
                    <StatusBadge status={booking.status} />
                  </div>
                </EntityCard>
              ))}
            </GridLayout>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID / Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient Details</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3">
                          <p className="text-xs font-mono text-slate-500">{booking.bookingId}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{formatDate(booking.bookingDate)}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{booking.patientName}</p>
                          <p className="text-xs text-slate-500">Age {booking.patientAge} · {booking.careType}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{booking.contactNumber}</p>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setViewModal({ open: true, booking })} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded dark:text-blue-400 dark:hover:bg-blue-900/20" title="View"><Eye size={16} /></button>
                            <button onClick={() => openStatusModal(booking)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded dark:text-amber-400 dark:hover:bg-amber-900/20" title="Update Status"><Filter size={16} /></button>
                            <button onClick={() => setDeleteModal({ open: true, bookingId: booking._id })} className="p-1.5 text-red-600 hover:bg-red-50 rounded dark:text-red-400 dark:hover:bg-red-900/20" title="Delete"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </motion.div>

      {/* Summary */}
      {!loading && filteredBookings.length > 0 && (
        <motion.p
          variants={fadeUp}
          className="text-sm text-slate-500 dark:text-slate-400"
        >
          Showing {filteredBookings.length} of {bookings.length} bookings
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
            <Select
              label=""
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              options={statuses}
              placeholder="Select status"
            />
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

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, bookingId: null })}
        onConfirm={handleDelete}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={deleteLoading}
      />
    </motion.div>
  );
};

export default Bookings;
