import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, HeartPulse, Star, MapPin, Clock, Filter, X } from "lucide-react";
import { getAllServices } from "../../service/api/service.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { SERVICE_CATEGORIES } from "../../../constants";
import Button from "../../../components/ui/Button";

const Services = () => {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedModes, setSelectedModes] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  
  // Mobile sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) => s.title?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategories.length > 0) {
      result = result.filter((s) => selectedCategories.includes(s.category));
    }

    // Service Mode
    if (selectedModes.length > 0) {
      result = result.filter((s) => selectedModes.includes(s.serviceMode));
    }

    // Rating
    if (selectedRating) {
      result = result.filter((s) => (s.rating || 0) >= selectedRating);
    }

    setFiltered(result);
  }, [search, selectedCategories, selectedModes, selectedRating, services]);

  const handleCategoryChange = (val) => {
    setSelectedCategories(prev => 
      prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]
    );
  };

  const handleModeChange = (val) => {
    setSelectedModes(prev => 
      prev.includes(val) ? prev.filter(m => m !== val) : [...prev, val]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedModes([]);
    setSelectedRating(null);
  };

  const getCategoryLabel = (val) => {
    return SERVICE_CATEGORIES.find(c => c.value === val)?.label || val;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-site-wide mx-auto">
        
        {/* Page Header */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Find Trusted Care Services
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl text-lg">
            Browse through our comprehensive range of professional, compassionate in-home and online care services designed to support you and your loved ones.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
          <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Filter className="w-5 h-5" /> Filters
          </span>
          <Button variant="outline" className="py-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Sidebar Filters */}
          <div className={`
            ${isSidebarOpen ? 'block' : 'hidden md:block'}
            md:sticky top-24 w-full md:w-64 lg:w-72 self-start
          `}>
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-3">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-3">
                  Category
                </label>
                <div className="space-y-2.5">
                  {SERVICE_CATEGORIES.map((cat) => (
                    <label key={cat.value} onClick={() => handleCategoryChange(cat.value)} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        selectedCategories.includes(cat.value) 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-blue-400'
                      }`}>
                        {selectedCategories.includes(cat.value) && <span className="w-1.5 h-1.5 bg-white rounded-sm" />}
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {cat.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Service Mode Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-3">
                  Service Mode
                </label>
                <div className="space-y-2.5">
                  {[
                    { value: "home-visit", label: "Home Visit" },
                    { value: "online", label: "Online Consultation" },
                    { value: "both", label: "Both" }
                  ].map((mode) => (
                    <label key={mode.value} onClick={() => handleModeChange(mode.value)} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        selectedModes.includes(mode.value) 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-blue-400'
                      }`}>
                        {selectedModes.includes(mode.value) && <span className="w-1.5 h-1.5 bg-white rounded-sm" />}
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {mode.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-3">
                  Rating
                </label>
                <div className="space-y-2.5">
                  {[4.5, 4.0, 3.0].map((rating) => (
                    <label key={rating} onClick={() => setSelectedRating(selectedRating === rating ? null : rating)} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        selectedRating === rating 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-blue-400'
                      }`}>
                        {selectedRating === rating && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {rating} & above
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={resetFilters}
                className="w-full py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Overlay for mobile sidebar */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main Content Grid */}
          <div className="flex-1 w-full">
            {loading ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse h-80" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center bg-white dark:bg-[#111827] rounded-2xl p-16 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
                <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">No matching services</p>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">We couldn't find any services matching your current filters. Try adjusting them or resetting.</p>
                <button onClick={resetFilters} className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div 
                variants={stagger} 
                initial="hidden" 
                animate="show" 
                className="grid grid-cols-1 xl:grid-cols-2 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((service) => (
                    <motion.div
                      layout
                      variants={fadeUp}
                      initial="hidden"
                      animate="show"
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={service._id}
                      className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900/50 transition-all flex flex-col h-full group"
                    >
                      {/* Card Header (Image + Title) */}
                      <div className="flex gap-4 mb-5">
                        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:scale-105 transition-transform duration-300">
                          {service.image ? (
                            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                          ) : (
                            <HeartPulse className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1 truncate">
                            {service.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <span>{getCategoryLabel(service.category)}</span>
                            {service.rating > 0 && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                <span className="flex items-center text-amber-500 font-medium">
                                  <Star className="w-3.5 h-3.5 fill-current mr-1" />
                                  {service.rating.toFixed(1)} 
                                  <span className="text-slate-400 dark:text-slate-500 ml-1 font-normal">({service.totalReviews || 0})</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs font-semibold rounded-full border border-emerald-100 dark:border-emerald-800/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                          Available Now
                        </span>
                        {service.serviceMode && (
                          <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-xs font-medium rounded-full border border-blue-100 dark:border-blue-800/30">
                            {service.serviceMode === 'home-visit' ? 'Home Visit' : service.serviceMode === 'online' ? 'Online' : 'Home & Online'}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 flex-1 leading-relaxed">
                        {service.shortDescription || service.description}
                      </p>


                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3 mt-auto">
                        <Link
                          to={`/services/${service.slug || service._id}`}
                          className="px-4 py-2.5 text-sm font-semibold text-center rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                        >
                          View Details
                        </Link>
                        <Link
                          to="/book"
                          className="px-4 py-2.5 text-sm font-semibold text-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                        >
                          Book Now
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Services;
