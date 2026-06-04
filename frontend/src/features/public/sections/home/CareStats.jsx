import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, HeartPulse, Star } from "lucide-react";

import { getDashboardStats } from "../../../admin/api/admin.api";
import { fadeUp, stagger } from "../../../../animations/motionVariants";

const CareStats = () => {
  const [stats, setStats] = useState({
    totalCaregivers: 0,
    servicesProvided: 0,
    avgSatisfaction: 0
  });

  useEffect(() => {
    getDashboardStats("last30")
      .then((res) => {
        setStats({
          totalCaregivers: res?.data?.stats?.totalCaregivers || 0,
          servicesProvided: res?.data?.stats?.totalBookings || 0,
          avgSatisfaction: res?.data?.stats?.avgSatisfaction || 0
        });
      })
      .catch((err) => {
        console.error("Failed to load caregiver stats", err);
        setStats({
          totalCaregivers: 0,
          servicesProvided: 0,
          avgSatisfaction: 0
        });
      });
  }, []);

  return (
    <section className="py-24 px-4 bg-[#F8F7F4] dark:bg-[#0b1120] relative border-t border-slate-200 dark:border-slate-800">
      <div className="w-full max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Text */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-6 uppercase tracking-wider">
              <span className="w-8 h-px bg-emerald-600 dark:bg-emerald-400"></span>
              Real-Time Impact
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-[#1c2b36] dark:text-white leading-[1.1] mb-6 tracking-tight">
              Transforming Lives Through Compassionate Care
            </h2>
            
            <p className="text-md md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
              Our platform continuously monitors service quality to ensure the highest standards of elder care. Here is the real impact we are making across our community today.
            </p>
          </motion.div>

          {/* Right: Clean Stats Grid */}
          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10"
          >
            {/* Card 1 */}
            <motion.div 
              variants={fadeUp}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-start"
            >
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <div className="text-5xl font-black text-[#1c2b36] dark:text-white mb-2 tracking-tighter">
                {stats.totalCaregivers}
              </div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Active Verified Caregivers</p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              variants={fadeUp}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-start"
            >
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                <HeartPulse className="w-7 h-7" />
              </div>
              <div className="text-5xl font-black text-[#1c2b36] dark:text-white mb-2 tracking-tighter">
                {stats.servicesProvided}
              </div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Services Provided</p>
            </motion.div>

            {/* Card 3 (Full Width) */}
            <motion.div 
              variants={fadeUp}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div>
                <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                  <Star className="w-7 h-7" />
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-black text-[#1c2b36] dark:text-white tracking-tighter">
                    {stats.avgSatisfaction ? stats.avgSatisfaction.toFixed(1) : "0.0"}
                  </span>
                  <span className="text-2xl font-bold text-slate-400 mb-1">/5</span>
                </div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Average Satisfaction Score</p>
              </div>

              {/* Minimal bar chart representation */}
              <div className="flex items-end gap-2 h-16 opacity-80">
                {[40, 65, 45, 80, 55, 90].map((height, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="w-4 bg-amber-200 dark:bg-amber-700/50 rounded-sm"
                  />
                ))}
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CareStats;
