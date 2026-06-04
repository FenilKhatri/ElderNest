import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, Calendar, Activity, Download } from "lucide-react";
import { getDashboardStats } from "../api/admin.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import CustomDropdown from "../../../components/ui/CustomDropdown";

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue:   "bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400",
    green:  "bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400",
    amber:  "bg-amber-50 text-amber-500 dark:bg-amber-900/20 dark:text-amber-400",
    purple: "bg-purple-50 text-purple-500 dark:bg-purple-900/20 dark:text-purple-400",
  };

  return (
    <motion.div
      variants={fadeUp}
      className="bg-white dark:bg-[#111827] rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">{title}</p>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
          {value !== undefined && value !== null ? value.toLocaleString() : "—"}
        </h3>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("last30");

  useEffect(() => {
    setLoading(true);
    getDashboardStats(timeframe)
      .then((res) => setStats(res?.data?.stats || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [timeframe]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      
      {/* Header section matching mockup */}
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Overview</h1>
          <p className="text-[13px] text-slate-400 dark:text-slate-500 mt-1">Monitor platform performance and key metrics.</p>
        </div>
        <div className="flex items-center gap-3 w-40">
          <CustomDropdown 
            value={timeframe}
            onChange={(val) => setTimeframe(val)}
            options={[
              { value: "last7", label: "Last 7 Days" },
              { value: "last30", label: "Last 30 Days" },
              { value: "thisYear", label: "This Year" },
              { value: "all", label: "All Time" }
            ]}
          />
        </div>
      </motion.div>

      {/* Top Stats matching mockup */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers ?? "—"} 
          icon={Users} 
          color="blue" 
        />
        <StatCard 
          title="Verified Caregivers" 
          value={stats?.totalCaregivers ?? "—"} 
          icon={UserCheck} 
          color="green" 
        />
        <StatCard 
          title="Active Bookings" 
          value={stats?.pendingBookings ?? "—"} 
          icon={Activity} 
          color="amber" 
        />
        <StatCard 
          title="Completed Services" 
          value={stats?.completedBookings ?? "—"} 
          icon={Calendar} 
          color="purple" 
        />
      </div>

      {/* Charts section matching mockup */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Monthly Bookings</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-[12px] text-slate-400">This Year</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.barData || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col">
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-6">Service Popularity</h3>
          
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.pieData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {(stats?.pieData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-3">
            {(stats?.pieData || []).map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-[13px] text-slate-500 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="text-[13px] font-medium text-slate-900 dark:text-slate-300">{item.value} bookings</span>
              </div>
            ))}
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
