import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Search, Eye } from "lucide-react";
import { getAllBookings } from "../../booking/api/booking.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { formatDate, formatTime, formatCurrency } from "../../../utils/helpers";
import StatusBadge from "../../../components/ui/StatusBadge";
import Modal from "../../../components/ui/Modal";
import { BOOKING_STATUS } from "../../../utils/constants";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: BOOKING_STATUS.PENDING,     label: "Pending" },
  { value: BOOKING_STATUS.ACCEPTED,    label: "Accepted" },
  { value: BOOKING_STATUS.IN_PROGRESS, label: "In Progress" },
  { value: BOOKING_STATUS.COMPLETED,   label: "Completed" },
  { value: BOOKING_STATUS.CANCELLED,   label: "Cancelled" },
  { value: BOOKING_STATUS.REJECTED,    label: "Rejected" },
];

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewBooking, setViewBooking] = useState(null);

  useEffect(() => {
    getAllBookings()
      .then((res) => {
        const data = res?.data?.bookings || [];
        setBookings(data);
        setFiltered(data);
      })
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = bookings;
    if (statusFilter) result = result.filter(b => b.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.patientName?.toLowerCase().includes(q) ||
        b.bookingId?.toLowerCase().includes(q) ||
        b.userId?.name?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, statusFilter, bookings]);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Booking Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage all bookings across the platform</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-52"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {STATUS_FILTERS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="animate-pulse h-12 bg-slate-200 dark:bg-slate-700 rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {["Booking ID", "Patient", "User", "Caregiver", "Date", "Amount", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">No bookings found</td></tr>
                ) : filtered.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-slate-600 dark:text-slate-400">{b.bookingId}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{b.patientName}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{b.userId?.name || "—"}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{b.caregiverId?.userId?.name || "—"}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatDate(b.bookingDate)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{formatCurrency(b.totalAmount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setViewBooking(b)}
                        className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {!loading && (
        <motion.p variants={fadeUp} className="text-sm text-slate-500 dark:text-slate-400">
          Showing {filtered.length} of {bookings.length} bookings
        </motion.p>
      )}

      {/* Booking Detail Modal */}
      <Modal
        isOpen={!!viewBooking}
        onClose={() => setViewBooking(null)}
        title={`Booking — ${viewBooking?.bookingId}`}
        size="md"
      >
        {viewBooking && (
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Patient Name",  value: viewBooking.patientName },
                { label: "Patient Age",   value: `${viewBooking.patientAge} years` },
                { label: "Condition",     value: viewBooking.disease },
                { label: "Care Type",     value: viewBooking.careType },
                { label: "Booking Date",  value: formatDate(viewBooking.bookingDate) },
                { label: "Time Slot",     value: `${formatTime(viewBooking.timeSlot?.startTime)} – ${formatTime(viewBooking.timeSlot?.endTime)}` },
                { label: "Duration",      value: `${viewBooking.duration}h` },
                { label: "Total Amount",  value: formatCurrency(viewBooking.totalAmount) },
                { label: "Status",        value: <StatusBadge status={viewBooking.status} /> },
                { label: "Contact",       value: viewBooking.contactNumber },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Address</p>
              <p className="text-sm text-slate-900 dark:text-white">
                {viewBooking.address?.street}, {viewBooking.address?.city}, {viewBooking.address?.state} — {viewBooking.address?.pincode}
              </p>
            </div>
            {viewBooking.notes && (
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Notes</p>
                <p className="text-sm text-slate-900 dark:text-white">{viewBooking.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Bookings;
