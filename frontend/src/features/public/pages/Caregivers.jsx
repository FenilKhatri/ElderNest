import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Star, User, Filter, CheckCircle2 } from "lucide-react";
import { getAllCaregivers } from "../../caregiver/api/caregiver.api";
import { getAllServices } from "../../service/api/service.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";

const Caregivers = () => {
  const [caregivers, setCaregivers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse initial query params
  const searchParams = new URLSearchParams(location.search);
  const initialService = searchParams.get('service') || "";
  const initialSearch = searchParams.get('search') || "";
  
  const [searchCity, setSearchCity] = useState(searchParams.get('city') || "");
  const [selectedExperience, setSelectedExperience] = useState(searchParams.get('experience') ? searchParams.get('experience').split(',') : []);
  const [selectedLanguages, setSelectedLanguages] = useState([]); // Kept client-side or we can add to backend if needed
  const [selectedRatings, setSelectedRatings] = useState(searchParams.get('rating') ? [searchParams.get('rating') + '+'] : []);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // Apply filters function to update URL and trigger fetch
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    if (searchTerm) params.set('search', searchTerm);
    if (initialService) params.set('service', initialService);
    
    // We only support one experience range in backend or we could loop, let's just use the first selected or join
    if (selectedExperience.length > 0) params.set('experience', selectedExperience[0]); 
    
    if (selectedRatings.length > 0) {
      // get minimum rating from selected
      const minRat = Math.min(...selectedRatings.map(r => parseFloat(r)));
      params.set('rating', minRat);
    }
    
    navigate(`/caregivers?${params.toString()}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch services
        const sRes = await getAllServices({ isActive: true });
        setServices(sRes.data?.services || []);

        // Fetch caregivers with backend filters
        const params = Object.fromEntries(new URLSearchParams(location.search));
        params.status = "approved"; // Always only approved
        const res = await getAllCaregivers(params);
        setCaregivers(res.data?.caregivers || []);
        
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.search]);

  useEffect(() => {
    let result = caregivers;

    // Filter by Language (Client Side, since backend doesn't explicitly filter language yet or we didn't add it)
    if (selectedLanguages.length > 0) {
      result = result.filter(c => 
        c.languages?.some(lang => selectedLanguages.includes(lang.toLowerCase()))
      );
    }

    setFiltered(result);
  }, [selectedLanguages, caregivers]);

  const handleCheckboxChange = (setter, value) => {
    setter(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const resetFilters = () => {
    setSearchCity("");
    setSelectedExperience([]);
    setSelectedLanguages([]);
    setSelectedRatings([]);
    setSearchTerm("");
    navigate("/caregivers");
  };

  const allLanguages = useMemo(() => {
    const langs = new Set();
    caregivers.forEach(c => c.languages?.forEach(l => langs.add(l)));
    return Array.from(langs).slice(0, 8); // top 8 languages
  }, [caregivers]);

  // Fallback languages if none in DB
  const displayLanguages = allLanguages.length > 0 ? allLanguages : ['English', 'Hindi', 'Marathi', 'Gujarati'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Find Trusted Caregivers
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-3xl">
            Browse through our network of verified, experienced nurses and attendants ready to provide compassionate care for your loved ones.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters (Left) */}
          <div className="w-full lg:w-1/4 shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sticky top-28 shadow-sm">
              
              {/* Search by Name */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Search Name</h3>
                <input
                  type="text"
                  placeholder="e.g. Priya"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              {/* City Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">City</h3>
                <input
                  type="text"
                  placeholder="e.g. Mumbai"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              {/* Experience Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Experience</h3>
                <div className="space-y-2.5">
                  {[
                    { id: '5+', label: '5+ Years' },
                    { id: '3-5', label: '3 - 5 Years' },
                    { id: '1-3', label: '1 - 3 Years' }
                  ].map(option => (
                    <label key={option.id} className="flex items-center cursor-pointer group" onClick={() => handleCheckboxChange(setSelectedExperience, option.id)}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${
                        selectedExperience.includes(option.id) 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-slate-300 dark:border-slate-600 group-hover:border-blue-400'
                      }`}>
                        {selectedExperience.includes(option.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Language Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Language</h3>
                <div className="space-y-2.5">
                  {displayLanguages.map(lang => (
                    <label key={lang} className="flex items-center cursor-pointer group" onClick={() => handleCheckboxChange(setSelectedLanguages, lang.toLowerCase())}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${
                        selectedLanguages.includes(lang.toLowerCase()) 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-slate-300 dark:border-slate-600 group-hover:border-blue-400'
                      }`}>
                        {selectedLanguages.includes(lang.toLowerCase()) && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors capitalize">
                        {lang}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Rating</h3>
                <div className="space-y-2.5">
                  {[
                    { id: '4.5+', label: '4.5 & above' },
                    { id: '4.0+', label: '4.0 & above' }
                  ].map(option => (
                    <label key={option.id} className="flex items-center cursor-pointer group" onClick={() => handleCheckboxChange(setSelectedRatings, option.id)}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${
                        selectedRatings.includes(option.id) 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-slate-300 dark:border-slate-600 group-hover:border-blue-400'
                      }`}>
                        {selectedRatings.includes(option.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={applyFilters}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Apply Filters
                </button>
                <button 
                  onClick={resetFilters}
                  className="w-full py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Caregiver Grid (Right) */}
          <div className="w-full lg:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 animate-pulse h-[340px]">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
                      <div className="space-y-2 flex-1 pt-1">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                      </div>
                    </div>
                    <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full mb-6" />
                    <div className="space-y-3 mb-8">
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                    </div>
                    <div className="flex gap-3">
                      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex-1" />
                      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center bg-white dark:bg-slate-800 rounded-2xl p-16 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No caregivers found</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
                <button 
                  onClick={resetFilters}
                  className="mt-6 px-6 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filtered.map((caregiver) => (
                    <motion.div
                      layout
                      variants={fadeUp}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      key={caregiver._id}
                      className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col h-full group"
                    >
                      {/* Top: Image & Name */}
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-sm">
                          {caregiver.profilePicture ? (
                            <img src={caregiver.profilePicture} alt={caregiver.userId?.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                            {caregiver.userId?.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {caregiver.servicesOffered?.[0]?.title || caregiver.servicesOffered?.[0]?.name || "Caregiver"}
                          </p>
                          <div className="flex items-center mt-1.5">
                            <span className="text-[13px] font-semibold text-amber-500 flex items-center">
                              {caregiver.rating || "New"} 
                              {caregiver.totalReviews > 0 && <span className="text-amber-600 ml-1">({caregiver.totalReviews} reviews)</span>}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="mb-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          caregiver.availableTiming === 'flexible' || !caregiver.availableTiming
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            caregiver.availableTiming === 'flexible' || !caregiver.availableTiming
                              ? "bg-emerald-500" 
                              : "bg-slate-400"
                          }`}></span>
                          {caregiver.availableTiming === 'flexible' || !caregiver.availableTiming ? 'Available Now' : 'Available on Schedule'}
                        </span>
                      </div>

                      {/* Info (Experience, Language) */}
                      <div className="space-y-3 mb-6 flex-1">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {caregiver.experienceYears} Years Experience
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                          {caregiver.languages?.join(", ") || "English, Hindi"}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto grid grid-cols-2 gap-3 pt-2">
                        <Link
                          to={`/caregivers/${caregiver._id}`}
                          className="flex items-center justify-center px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-sm font-semibold transition-colors"
                        >
                          View Profile
                        </Link>
                        <Link
                          to={`/user/book-caregiver/${caregiver._id}`}
                          className="flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-600/20"
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

export default Caregivers;