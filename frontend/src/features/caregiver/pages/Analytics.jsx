import { useState, useEffect } from "react";
import { BarChart3, Star, IndianRupee, CheckCircle, Calendar } from "lucide-react";
import { getCaregiverDashboardStats } from "../api/caregiver.api";
import { formatCurrency } from "../../../utils/helpers";
import GlobalLoader from "../../../components/ui/GlobalLoader";
import DashboardCard from "../components/DashboardCard";

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCaregiverDashboardStats()
      .then((res) => setStats(res?.data?.stats || res?.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <GlobalLoader />;

  const s = stats || {};

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-blue-600" />
          Analytics
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Performance overview and monthly trends.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        <DashboardCard title="Total bookings" value={s.totalBookings ?? 0} icon={Calendar} color="blue" />
        <DashboardCard title="Completed" value={s.completedBookings ?? 0} icon={CheckCircle} color="green" />
        <DashboardCard title="Monthly earnings" value={formatCurrency(s.monthlyEarnings ?? 0)} icon={IndianRupee} color="purple" />
        <DashboardCard title="Rating" value={(s.rating ?? 0).toFixed(1)} icon={Star} color="amber" />
        <DashboardCard title="Reviews" value={s.totalReviews ?? 0} icon={Star} color="slate" />
        <DashboardCard title="Active bookings" value={s.activeBookings ?? 0} icon={Calendar} color="indigo" />
      </div>

      <div className="mt-8 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-2">Monthly trends</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Pending: {s.pendingBookings ?? 0} · Upcoming: {s.upcomingBookings ?? 0} · This month earnings:{" "}
          {formatCurrency(s.monthlyEarnings ?? 0)}
        </p>
      </div>
    </div>
  );
};

export default Analytics;
