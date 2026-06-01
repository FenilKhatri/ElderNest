import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Heart, Briefcase, Calendar, IndianRupee } from "lucide-react";
import { getAnalytics } from "../api/admin.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import StatSkeleton from "../../../components/feedback/skeleton/StatSkeleton";
import { formatCurrency } from "../../../utils/helpers";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
    </div>
  </div>
);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then((res) => setData(res?.data?.analytics))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5].map((i) => <StatSkeleton key={i} />)}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16 text-slate-500">Unable to load analytics. Please try again later.</div>
    );
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Platform metrics and monthly trends</p>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Users" value={data.totalUsers} icon={Users} color="blue" />
        <StatCard title="Total Patients" value={data.totalPatients} icon={Heart} color="rose" />
        <StatCard title="Caregivers" value={data.totalCaregivers} icon={Briefcase} color="emerald" />
        <StatCard title="Services" value={data.totalServices} icon={Briefcase} color="violet" />
        <StatCard title="Bookings" value={data.totalBookings} icon={Calendar} color="amber" />
        <StatCard title="Revenue" value={formatCurrency(data.revenue)} icon={IndianRupee} color="green" />
      </motion.div>

      {data.monthlyTrends?.length > 0 && (
        <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Monthly Trends</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 pr-4">Month</th>
                  <th className="pb-3 pr-4">Bookings</th>
                  <th className="pb-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.monthlyTrends.map((row) => (
                  <tr key={row.month} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">{row.month}</td>
                    <td className="py-3 pr-4">{row.bookings}</td>
                    <td className="py-3">{formatCurrency(row.revenue || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Analytics;
