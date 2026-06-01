import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, HeartPulse, Star, Users, Shield, Clock } from "lucide-react";
import { getAllServices } from "../../service/api/service.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";

const CATEGORIES = ["All", "personal-care", "medical-care", "companionship", "household-help", "specialized-care", "emergency-care"];

const Services = () => {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await getAllServices({ isActive: true });
        const list = res?.data?.services || res?.services || [];
        setServices(list);
        setFiltered(list);
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    let result = services;

    if (activeCategory !== "All") {
      result = result.filter(s => s.category === activeCategory);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.title?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q));
    }

    setFiltered(result);
  }, [search, activeCategory, services]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-site-wide mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Care Services
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 w-full max-w-4xl mx-auto">
            Browse our comprehensive range of professional in-home care services designed to support you and your loved ones.
          </p>
        </div>

        {/* Search & Filters */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="max-w-5xl mx-auto mb-12">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center mb-6">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-none bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-0 transition-all text-sm"
              />
            </div>
            
            <div className="w-full md:w-1/2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <div className="flex gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      activeCategory === cat
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {cat === "All" ? "All Categories" : cat.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 animate-pulse h-96">
                <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-700 mb-6" />
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4" />
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center bg-white dark:bg-slate-800 rounded-3xl p-16 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-200 mb-2">No services found</p>
            <p className="text-slate-500 max-w-md">Try adjusting your search or category filters to find the right care service.</p>
          </div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filtered.map((service) => (
                <motion.div
                  layout
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  key={service._id}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] transition-all flex flex-col h-full group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                      {service.image ? (
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <HeartPulse className="w-8 h-8" />
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-slate-500 dark:text-slate-400 mb-6 line-clamp-3 text-sm flex-1 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="flex flex-col gap-3 mb-8">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <Shield className="w-4 h-4 text-emerald-500 mr-3" />
                      Verified Professionals
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <Clock className="w-4 h-4 text-emerald-500 mr-3" />
                      Flexible Timings
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Link
                      to={`/services/${service.slug || service._id}`}
                      className="w-full flex justify-center items-center py-3.5 bg-slate-50 hover:bg-blue-600 text-slate-900 hover:text-white dark:bg-slate-700/50 dark:text-white dark:hover:bg-blue-600 font-bold rounded-xl transition-colors shadow-sm"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Services;