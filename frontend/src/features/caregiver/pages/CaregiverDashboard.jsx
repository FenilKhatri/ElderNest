import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  Bell,
  Star
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useNotifications } from "../../../context/NotificationContext";
import { getMyProfile } from "../api/caregiver.api";
import { getCaregiverBookings, updateBookingStatus } from "../../booking/api/booking.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { toast } from "react-toastify";
import Modal from "../../../components/ui/Modal";
import Textarea from "../../../components/ui/Textarea";
import DashboardCard from "../components/DashboardCard";
import UpcomingBookings from "../components/UpcomingBookings";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../../utils/helpers";
import Button from "../../../components/ui/Button";
import { BOOKING_STATUS } from "../../../constants/statusConstants";

const CaregiverDashboard = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    monthlyEarnings: 0,
    rating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [rejectingBooking, setRejectingBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const profileRes = await getMyProfile();
      const caregiver = profileRes?.data?.caregiver;
      if (caregiver?._id) {
        const bookingsResponse = await getCaregiverBookings(caregiver._id);
        const bookingsData = bookingsResponse?.data?.bookings || [];
        setBookings(bookingsData);
        calculateStats(bookingsData);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus, extraData = {}) => {
    if (processingId) return;
    try {
      setProcessingId(id);
      await updateBookingStatus(id, { status: newStatus, ...extraData });
      toast.success(`Booking ${newStatus} successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error(error.message || "Failed to update booking status");
      fetchDashboardData();
    } finally {
      setProcessingId(null);
    }
  };

  const calculateStats = (bookingsData) => {
    const totalBookings = bookingsData.length;
    const pendingBookings = bookingsData.filter(b => b.status === BOOKING_STATUS.PENDING).length;
    const completedBookings = bookingsData.filter(b => b.status === BOOKING_STATUS.COMPLETED).length;
    
    // Calculate monthly earnings (current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyEarnings = bookingsData
      .filter(b => {
        const bookingDate = new Date(b.bookingDate);
        return bookingDate.getMonth() === currentMonth && 
               bookingDate.getFullYear() === currentYear &&
               b.status === BOOKING_STATUS.COMPLETED;
      })
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    setStats({
      totalBookings,
      pendingBookings,
      completedBookings,
      monthlyEarnings,
      rating: user?.rating || 0,
    });
  };

  const upcomingBookings = bookings
    .filter(b => b.status === BOOKING_STATUS.PENDING || b.status === BOOKING_STATUS.ACCEPTED)
    .sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="flex flex-col md:flex-row md:items-center justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Here's what's happening with your caregiving services today.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <motion.button
            variants={fadeUp}
            onClick={() => navigate("/caregiver/notifications")}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span>{unreadCount} new notifications</span>
          </motion.button>
        )}
      </motion.div>

      {/* Profile Completion Alert */}
      {!user?.profileCompleted && user?.isApproved && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-900 dark:text-amber-100">
                Complete Your Profile
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                Complete your profile to start receiving booking requests from families.
              </p>
              <Button
                onClick={() => navigate("/caregiver/complete-profile")}
                className="mt-2 text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline"
              >
                Complete Profile →
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <DashboardCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={Calendar}
          color="blue"
          onClick={() => navigate("/caregiver/bookings")}
        />
        <DashboardCard
          title="Pending Requests"
          value={stats.pendingBookings}
          icon={Clock}
          color="amber"
          onClick={() => navigate("/caregiver/bookings?status=pending")}
        />
        <DashboardCard
          title="Completed"
          value={stats.completedBookings}
          icon={CheckCircle}
          color="green"
          onClick={() => navigate("/caregiver/bookings?status=completed")}
        />
        <DashboardCard
          title="Monthly Earnings"
          value={formatCurrency(stats.monthlyEarnings)}
          icon={TrendingUp}
          color="purple"
          onClick={() => navigate("/caregiver/analytics")}
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Bookings */}
        <div className="lg:col-span-2">
          <UpcomingBookings
            bookings={upcomingBookings}
            loading={loading}
            onViewAll={() => navigate("/caregiver/bookings")}
            onAccept={(id) => handleStatusUpdate(id, BOOKING_STATUS.ACCEPTED)}
            onReject={(id) => setRejectingBooking(id)}
            processingId={processingId}
          />
        </div>

        {/* Quick Actions & Profile Status */}
        <div className="space-y-6">
          {/* Profile Status */}
          <motion.div
            variants={fadeUp}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Profile Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Account Status
                </span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Approved
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Profile Completion
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {user?.profileCompleted ? "100%" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Rating
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {stats.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={fadeUp}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/caregiver/availability")}
                className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="font-medium text-slate-900 dark:text-white">
                  Manage Availability
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Update your schedule
                </div>
              </Button>
              <Button
                onClick={() => navigate("/caregiver/profile")}
                className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="font-medium text-slate-900 dark:text-white">
                  View Public Profile
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  See how families see you
                </div>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

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

export default CaregiverDashboard;