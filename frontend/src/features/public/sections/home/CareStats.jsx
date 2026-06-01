import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, ShieldCheck, Star, Headset } from "lucide-react";
import { slideLeft, stagger } from "../../../../animations/motionVariants";
import StatsImg from "../../../../assets/images/home/carestats.avif";
import { getAllServices } from "../../../service/api/service.api";
import http from "../../../../lib/axios";

const CareStats = () => {
  const [stats, setStats] = useState([
    { icon: User, number: "—", description: "Active Services", theme: "text-blue-500" },
    { icon: ShieldCheck, number: "—", description: "Verified Caregivers", theme: "text-emerald-500" },
    { icon: Star, number: "—", description: "Platform Rating", theme: "text-yellow-500" },
    { icon: Headset, number: "24/7", description: "Support Available", theme: "text-purple-500" },
  ]);

  useEffect(() => {
    Promise.all([
      getAllServices({ isActive: true, limit: 1 }),
      http.get("/caregivers"),
    ])
      .then(([servicesRes, caregiversRes]) => {
        const serviceTotal = servicesRes?.data?.pagination?.total ?? servicesRes?.data?.services?.length ?? 0;
        const caregivers = caregiversRes?.data?.caregivers || [];
        const avgRating =
          caregivers.length > 0
            ? (
                caregivers.reduce((sum, c) => sum + (c.rating || 0), 0) / caregivers.length
              ).toFixed(1)
            : "—";

        setStats([
          { icon: User, number: String(serviceTotal), description: "Active Services", theme: "text-blue-500" },
          { icon: ShieldCheck, number: String(caregivers.length), description: "Verified Caregivers", theme: "text-emerald-500" },
          { icon: Star, number: avgRating !== "—" ? `${avgRating}/5` : "—", description: "Average Rating", theme: "text-yellow-500" },
          { icon: Headset, number: "24/7", description: "Support Available", theme: "text-purple-500" },
        ]);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col space-y-5 md:space-y-10 mb-3 md:my-10">
      <div className="relative max-w-site-wide w-full mx-auto">
        <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-4xl border border-cyan-100/80 bg-linear-to-br from-white via-cyan-50 to-blue-50 shadow-[0_20px_60px_rgba(34,211,238,0.12)] dark:border-white/10 dark:from-[#03122f] dark:via-[#041937] dark:to-[#020c24] dark:shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-105 w-105 rounded-full bg-cyan-200/40 blur-[120px] dark:bg-cyan-700/20" />
          </div>
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <motion.img
              src={StatsImg}
              alt="Care at home"
              className="w-full max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>
        </div>
      </div>

      <div className="px-5 py-5 w-full bg-slate-100 dark:bg-slate-900 shadow-xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="relative overflow-hidden w-full max-w-site-wide mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 place-items-center gap-5"
        >
          {stats.map((count) => (
            <motion.div
              variants={slideLeft}
              key={count.description}
              className="flex flex-col items-center gap-2 rounded-2xl px-4 py-3 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <count.icon size={28} className={count.theme} />
                <p className="dark:text-slate-100 text-slate-700 text-xl md:text-3xl font-bold">{count.number}</p>
              </div>
              <p className="text-slate-500 font-semibold">{count.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CareStats;
