import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Search, Filter, Star, MapPin, X, Loader2, CheckCircle, ShieldCheck, User } from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Checkbox from "../../../components/ui/Checkbox";
import { getAllCaregivers } from "../../caregiver/api/caregiver.api";
import { getAllServices } from "../../service/api/service.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { useAuth } from "../../../context/AuthContext";
import { handleBookCaregiver } from "../../../utils/booking";

const Caregivers = () => {
  const { user } = useAuth();
  const [caregivers, setCaregivers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
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
  const [selectedCareType, setSelectedCareType] = useState(searchParams.get('careType') ? searchParams.get('careType').split(',') : []);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // Auto-apply filters with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchCity) params.set('city', searchCity);
      if (searchTerm) params.set('search', searchTerm);
      if (initialService) params.set('service', initialService);
      
      if (selectedExperience.length > 0) params.set('experience', selectedExperience[0]); 
      
      if (selectedRatings.length > 0) {
        const minRat = Math.min(...selectedRatings.map(r => parseFloat(r)));
        params.set('rating', minRat);
      }
      
      if (selectedCareType.length > 0) {
        params.set('careType', selectedCareType.join(','));
      }
      
      navigate(`/caregivers?${params.toString()}`, { replace: true });
    }, 500);

    return () => clearTimeout(handler);
  }, [searchCity, searchTerm, selectedExperience, selectedRatings, selectedCareType, initialService, navigate]);

  // applyFilters function is removed as it's now handled by the useEffect above

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
    setSelectedCareType([]);
    setSearchTerm("");
    navigate("/caregivers", { replace: true });
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
      <div className="max-w-site-wide mx-auto">
        
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
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filters
            </span>
            <Button variant="outline" className="py-2" onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}>
              {isMobileFilterOpen ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Sidebar Filters (Left) */}
          <div className={`w-full lg:w-1/4 shrink-0 ${isMobileFilterOpen ? "block" : "hidden lg:block"}`}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sticky top-28 shadow-sm">
              
              {/* Search by Name */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Search Name</h3>
                <Input
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
                <Input
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
                <div className="flex flex-col space-y-2.5">
                  {[
                    { id: '5+', label: '5+ Years' },
                    { id: '3-5', label: '3 - 5 Years' },
                    { id: '1-3', label: '1 - 3 Years' }
                  ].map(option => (
                    <Checkbox
                      key={option.id}
                      label={option.label}
                      checked={selectedExperience.includes(option.id)}
                      onChange={() => handleCheckboxChange(setSelectedExperience, option.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Care Type Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Care Type</h3>
                <div className="flex flex-col space-y-2.5">
                  {[
                    { id: 'hourly', label: 'Hourly' },
                    { id: 'part_time', label: 'Part Time' },
                    { id: 'full_time', label: 'Full Time' },
                    { id: 'live_in', label: 'Live-In' },
                    { id: 'emergency', label: 'Emergency' }
                  ].map(option => (
                    <Checkbox
                      key={option.id}
                      label={option.label}
                      checked={selectedCareType.includes(option.id)}
                      onChange={() => handleCheckboxChange(setSelectedCareType, option.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Language Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Language</h3>
                <div className="flex flex-col space-y-2.5">
                  {displayLanguages.map(lang => (
                    <Checkbox
                      key={lang}
                      label={<span className="capitalize">{lang}</span>}
                      checked={selectedLanguages.includes(lang.toLowerCase())}
                      onChange={() => handleCheckboxChange(setSelectedLanguages, lang.toLowerCase())}
                    />
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Rating</h3>
                <div className="flex flex-col space-y-2.5">
                  {[
                    { id: '4.5+', label: '4.5 & above' },
                    { id: '4.0+', label: '4.0 & above' }
                  ].map(option => (
                    <Checkbox
                      key={option.id}
                      label={option.label}
                      checked={selectedRatings.includes(option.id)}
                      onChange={() => handleCheckboxChange(setSelectedRatings, option.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button variant="outline" 
                  onClick={resetFilters}
                  className="w-full border-slate-200 dark:border-slate-700 dark:hover:bg-slate-700/50 dark:text-slate-300"
                >
                  Reset Filters
                </Button>
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
                <Button 
                  onClick={resetFilters}
                  className="mt-6 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                >
                  Clear Filters
                </Button>
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
                          {caregiver.profileImage ? (
                            <img src={caregiver.profileImage} alt={caregiver.userId?.name} className="w-full h-full object-cover" />
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
                        <Button
                          type="button"
                          onClick={() => handleBookCaregiver({ user, caregiverId: caregiver._id, navigate })}
                          className="flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-600/20"
                        >
                          Book Now
                        </Button>
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