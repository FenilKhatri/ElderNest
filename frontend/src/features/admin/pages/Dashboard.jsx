import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, Calendar, MessageSquare, Clock, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { getDashboardStats } from "../api/admin.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { formatCurrency } from "../../../utils/helpers";
import { useNavigate } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, color, onClick, sub }) => {
  const colors = {
    blue:   "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green:  "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    amber:  "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    red:    "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    cyan:   "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400",
  };
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value ?? "—"}</p>
          {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res?.data?.stats || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 animate-pulse">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-3" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Platform overview and key metrics</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Users"        value={stats?.totalUsers}        icon={Users}         color="blue"   onClick={() => navigate("/admin/users")} />
        <StatCard title="Total Caregivers"   value={stats?.totalCaregivers}   icon={UserCheck}     color="green"  onClick={() => navigate("/admin/caregivers")} />
        <StatCard title="Pending Approvals"  value={stats?.pendingCaregivers} icon={Clock}         color="amber"  onClick={() => navigate("/admin/caregivers")} sub="Awaiting review" />
        <StatCard title="Pending Profiles"   value={stats?.pendingProfiles}   icon={AlertCircle}   color="red"    onClick={() => navigate("/admin/caregivers")} sub="Profile review" />
        <StatCard title="Total Bookings"     value={stats?.totalBookings}     icon={Calendar}      color="purple" onClick={() => navigate("/admin/bookings")} />
        <StatCard title="Pending Bookings"   value={stats?.pendingBookings}   icon={TrendingUp}    color="cyan"   onClick={() => navigate("/admin/bookings")} />
        <StatCard title="Completed Bookings" value={stats?.completedBookings} icon={CheckCircle}   color="green"  onClick={() => navigate("/admin/bookings")} />
        <StatCard title="Contact Inquiries"  value={stats?.pendingContacts}   icon={MessageSquare} color="amber"  onClick={() => navigate("/admin/complaints")} sub="Pending response" />
      </div>
    </motion.div>
  );
};

export default Dashboard;
