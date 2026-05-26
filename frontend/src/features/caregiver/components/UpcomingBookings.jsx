import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, User, Phone } from "lucide-react";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import { formatDate, formatTime } from "../../../utils/helpers";
import StatusBadge from "../../../components/ui/StatusBadge";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";

const UpcomingBookings = ({ bookings = [], loading = false, onViewAll }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Upcoming Bookings
        </h3>
        {bookings.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
          </Button>
        )}
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No upcoming bookings"
          description="Your upcoming bookings will appear here once you start receiving requests."
        />
      ) : (
        <div className="space-y-4">
          {bookings.slice(0, 3).map((booking) => (
            <motion.div
              key={booking._id}
              variants={fadeUp}
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {booking.patientName}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {booking.disease}
                    </p>
                  </div>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(booking.bookingDate)}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>
                    {formatTime(booking.timeSlot.startTime)} - {formatTime(booking.timeSlot.endTime)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>{booking.address.city}</span>
                </div>
              </div>

              {booking.status === "pending" && (
                <div className="flex space-x-2 mt-4">
                  <Button size="sm" className="flex-1">
                    Accept
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Decline
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default UpcomingBookings;