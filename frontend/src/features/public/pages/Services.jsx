import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, HeartPulse, Star } from "lucide-react";
import { getAllServices } from "../../service/api/service.api";
import { SERVICE_CATEGORIES } from "../../../constants";
import ListingPageLayout from "../../../components/layout/ListingPageLayout";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, hasMore: false });
  
  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedModes, setSelectedModes] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  
  // Mobile sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchServices = async (pageToFetch = 1, append = false) => {
    try {
      if (append) setIsLoadingMore(true);
      else setLoading(true);

      const filters = {
        isActive: true,
        page: pageToFetch,
        limit: 9,
      };

      if (search) filters.search = search;
      if (selectedCategories.length > 0) filters.category = selectedCategories.join(',');
      if (selectedModes.length > 0) filters.serviceMode = selectedModes.join(',');
      if (selectedRating) filters.rating = selectedRating;

      const res = await getAllServices(filters);
      const list = res?.data?.services || res?.services || [];
      const pag = res?.data?.pagination || res?.pagination || { page: 1, hasMore: false };

      if (append) {
        setServices(prev => [...prev, ...list]);
      } else {
        setServices(list);
      }
      setPagination(pag);
    } catch (error) {
      console.error("Failed to fetch services", error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchServices(1, false);
  }, [search, selectedCategories, selectedModes, selectedRating]);

  const handleLoadMore = () => {
    if (!isLoadingMore && pagination.hasMore) {
      fetchServices(pagination.page + 1, true);
    }
  };



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

  const sidebarContent = (
    <>
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
    </>
  );

  const emptyStateContent = (
    <div className="text-center bg-white dark:bg-slate-800 rounded-2xl p-16 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center h-full min-h-[300px]">
      <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
      <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">No matching services</p>
      <p className="text-slate-500 dark:text-slate-400 max-w-md">We couldn't find any services matching your current filters. Try adjusting them or resetting.</p>
      <button onClick={resetFilters} className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
        Clear Filters
      </button>
    </div>
  );

  const renderServiceCard = (service) => (
    <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900/50 transition-all flex flex-col h-full group">
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
    </div>
  );

  return (
    <ListingPageLayout 
      title="Find Trusted Care Services"
      subtitle="Browse through our comprehensive range of professional, compassionate in-home and online care services designed to support you and your loved ones."
      isSidebarOpen={isSidebarOpen}
      onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      sidebarContent={sidebarContent}
      loading={loading}
      items={services}
      renderItem={renderServiceCard}
      skeletonCount={9}
      renderSkeleton={() => <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse h-80 w-full" />}
      emptyStateContent={emptyStateContent}
      breakpoint="md"
      gridCols="grid-cols-1 xl:grid-cols-3"
      pagination={pagination}
      onLoadMore={handleLoadMore}
      isLoadingMore={isLoadingMore}
    />
  );
};

export default Services;
