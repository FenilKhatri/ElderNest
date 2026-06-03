import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, ShieldCheck, HeartPulse, Star } from "lucide-react";
import { slideUp, stagger } from "../../../../animations/motionVariants";
import StatsImg from "../../../../assets/images/home/carestats.avif";
import { getAllServices } from "../../../service/api/service.api";
import http from "../../../../lib/axios";

const CareStats = () => {
  const [stats, setStats] = useState([
    { icon: Users, number: "—", label: "Families Served", desc: "Trusted by families worldwide" },
    { icon: ShieldCheck, number: "—", label: "Verified Experts", desc: "Strictly vetted caregivers" },
    { icon: HeartPulse, number: "—", label: "Care Hours", desc: "Dedicated compassionate care" },
    { icon: Star, number: "—", label: "Satisfaction", desc: "Average user rating" },
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
            ? (caregivers.reduce((sum, c) => sum + (c.rating || 0), 0) / caregivers.length).toFixed(1)
            : "—";

        setStats([
          { icon: Users, number: String(serviceTotal), label: "Families Served", desc: "Trusted by families nationwide" },
          { icon: ShieldCheck, number: String(caregivers.length), label: "Verified Experts", desc: "Strictly vetted caregivers" },
          { icon: HeartPulse, number: "0", label: "Care Hours", desc: "Dedicated compassionate care" },
          { icon: Star, number: avgRating !== "—" ? `${avgRating}/5` : "0/5", label: "Satisfaction", desc: "Average user rating" },
        ]);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative py-20 bg-white dark:bg-[#020817] overflow-hidden">
      {/* Background abstract shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-50 dark:bg-blue-900/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-rose-50 dark:bg-rose-900/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block py-1 px-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4 border border-blue-100 dark:border-blue-800"
          >
            Our Impact
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight"
          >
            Delivering Excellence in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Home Healthcare</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            We take pride in the positive impact we've made in the lives of seniors and their families, ensuring comfort, safety, and joy every single day.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] group">
              <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img 
                src={StatsImg} 
                alt="Caregiver helping senior" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 right-6 md:right-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-xl z-20 border border-white/20 dark:border-slate-700/50 flex items-center gap-4 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Highly Rated</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">By thousands of families</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Grid of Stats */}
          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div 
                variants={slideUp}
                key={index}
                className="group relative bg-white dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <stat.icon className={`w-7 h-7 ${
                      index === 0 ? "text-blue-500" : 
                      index === 1 ? "text-emerald-500" : 
                      index === 2 ? "text-rose-500" : "text-amber-500"
                    }`} />
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                    {stat.number}
                  </h3>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {stat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CareStats;
