import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MapPin, Star, User, Calendar, CheckCircle2, ChevronRight
} from "lucide-react";
import { getCaregiverById } from "../../caregiver/api/caregiver.api";
import { fadeUp } from "../../../animations/motionVariants";
import { formatCurrency } from "../../../utils/helpers";
import http from "../../../lib/axios";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

const CaregiverDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [caregiver, setCaregiver] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Caregiver
        const res = await getCaregiverById(id);
        setCaregiver(res.data?.caregiver);

        if (res.data?.caregiver) {
          // 2. Fetch Reviews
          const revRes = await http.get(`/reviews/caregiver/${id}`);
          setReviews(revRes.data?.reviews || []);
        }
      } catch (error) {
        console.error("Failed to fetch caregiver details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      navigate("/auth");
      return;
    }
    try {
      setSubmittingReview(true);
      await http.post("/reviews", {
        caregiverId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      toast.success("Review submitted successfully");
      setReviewForm({ rating: 5, comment: "" });
      
      const revRes = await http.get(`/reviews/caregiver/${id}`);
      setReviews(revRes.data?.reviews || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!caregiver) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Caregiver Not Found</h2>
        <Link to="/caregivers" className="text-blue-600 hover:underline">Return to Caregivers</Link>
      </div>
    );
  }

  // Calculate pricing for sticky box
  const shiftPrice = caregiver.pricing?.hourlyRate ? formatCurrency(caregiver.pricing.hourlyRate * 12) : (caregiver.pricing?.dailyRate ? formatCurrency(caregiver.pricing.dailyRate) : '₹1,500');
  const numericPrice = caregiver.pricing?.hourlyRate ? (caregiver.pricing.hourlyRate * 12) : (caregiver.pricing?.dailyRate || 1500);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link to="/caregivers" className="hover:text-blue-600">Caregivers</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-slate-900 dark:text-white font-medium">{caregiver.userId?.name}</span>
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content (Left) */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            {/* Top Profile Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] relative">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-32 h-32 rounded-xl bg-slate-100 dark:bg-slate-700 shrink-0 overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-md">
                  {caregiver.profilePicture ? (
                    <img src={caregiver.profilePicture} alt={caregiver.userId?.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-full h-full p-6 text-slate-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {caregiver.userId?.name}
                    </h1>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-semibold rounded flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Background Verified
                    </span>
                  </div>
                  <h2 className="text-blue-600 dark:text-blue-400 font-semibold mb-5">
                    {caregiver.servicesOffered?.[0]?.title || caregiver.servicesOffered?.[0]?.name || "Caregiver Specialist"}
                  </h2>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 text-sm">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 mb-0.5">Location</p>
                      <p className="font-medium text-slate-900 dark:text-white flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {caregiver.location?.city || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 mb-0.5">Experience</p>
                      <p className="font-medium text-slate-900 dark:text-white">{caregiver.experienceYears} Years</p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 mb-0.5">Availability</p>
                      <p className="font-medium text-slate-900 dark:text-white capitalize">{caregiver.availableTiming || "Flexible"}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <p className="text-slate-500 dark:text-slate-400 mb-1">Languages</p>
                      <div className="flex flex-wrap gap-2">
                        {(caregiver.languages || ["English", "Hindi"]).map(lang => (
                          <span key={lang} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Badge - Absolute on Desktop, Flow on Mobile */}
                <div className="sm:absolute top-8 right-8">
                  <div className="bg-teal-600 text-white px-4 py-2 rounded-lg flex flex-col items-center shadow-sm">
                    <div className="flex items-center text-lg font-bold">
                      <Star className="w-4 h-4 fill-white mr-1" />
                      {caregiver.rating || "New"}
                    </div>
                    <span className="text-[10px] font-medium opacity-90">({caregiver.totalReviews || 0} Reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About {caregiver.userId?.name?.split(" ")[0]}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {caregiver.bio || "Compassionate and dedicated professional with extensive experience..."}
              </p>
            </div>

            {/* Services Offered */}
            {caregiver.servicesOffered && caregiver.servicesOffered.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Services Offered</h3>
                <div className="flex flex-wrap gap-3">
                  {caregiver.servicesOffered.map(service => (
                    <span key={service._id} className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-semibold text-sm rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                      {service.title || service.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience & Certifications (Mocked structured layout) */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Experience & Certifications</h3>
              <div className="space-y-6">
                <div className="relative pl-6 border-l-2 border-emerald-100 dark:border-emerald-800">
                  <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900 border-2 border-white dark:border-slate-800"></span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">Professional Caregiver</h4>
                  <p className="text-sm text-slate-500 mt-1">Various Healthcare Settings • {caregiver.experienceYears} Years Total</p>
                </div>
                <div className="relative pl-6 border-l-2 border-emerald-100 dark:border-emerald-800">
                  <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900 border-2 border-white dark:border-slate-800"></span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">Background Verified</h4>
                  <p className="text-sm text-slate-500 mt-1">ElderNest Verification Team • Valid till 2026</p>
                </div>
              </div>
            </div>

            {/* Family Reviews */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Family Reviews</h3>
              
              {/* Write Review */}
              {user && user._id !== caregiver.userId?._id && (
                <form onSubmit={handleReviewSubmit} className="mb-8 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 text-sm">Write a Review</h4>
                  <div className="flex gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))} className="focus:outline-none">
                        <Star className={`w-5 h-5 ${star <= reviewForm.rating ? "text-yellow-500 fill-yellow-500" : "text-slate-300"}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-blue-500 outline-none resize-none mb-3"
                    rows="2" placeholder="Share your experience..." required
                  ></textarea>
                  <button type="submit" disabled={submittingReview} className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg disabled:opacity-50">
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}

              {reviews.length === 0 ? (
                <p className="text-slate-500 text-center py-6">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="p-6 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.03)]">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{review.userId?.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            {review.isVerified && " • Verified Booking"}
                          </p>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-slate-200"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm mt-3 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                  {reviews.length > 5 && (
                    <button className="w-full py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      View All {reviews.length} Reviews
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Sticky Booking Box (Right) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sticky top-28 shadow-[0_2px_20px_-3px_rgba(0,0,0,0.08)]">
              <div className="flex items-baseline gap-2 mb-6 border-b border-slate-100 dark:border-slate-700 pb-6">
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{shiftPrice}</h3>
                <span className="text-slate-500 font-medium text-sm">/ 12 hr shift</span>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">Check Availability</h4>
                {/* Mock Calendar */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-4 bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="flex items-center justify-center font-bold text-slate-900 dark:text-white text-sm mb-4">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" /> This Month
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-slate-500">
                    <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {/* Just some dummy days to look like a calendar */}
                    {[...Array(30)].map((_, i) => {
                      const day = i + 1;
                      const isSelected = [14, 15, 16].includes(day);
                      return (
                        <div key={day} className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full cursor-pointer ${
                          isSelected ? 'bg-blue-600 text-white font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}>
                          {day}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Estimate Summary */}
                <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-4 text-sm">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-2">
                    <span>Service Rate (12 hrs)</span>
                    <span>{shiftPrice}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-3 pb-3 border-b border-emerald-100 dark:border-emerald-800/30">
                    <span>Selected Days</span>
                    <span>3 days</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>Total Estimated</span>
                    <span>{formatCurrency(numericPrice * 3)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to={`/user/book-caregiver/${id}`}
                  className="w-full flex items-center justify-center py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm"
                >
                  Book Caregiver
                </Link>
                <button
                  className="w-full py-3.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  Request Callback
                </button>
              </div>
              <p className="text-center text-xs text-slate-500 mt-4">
                You won't be charged yet. Payment is collected after confirmation.
              </p>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default CaregiverDetails;