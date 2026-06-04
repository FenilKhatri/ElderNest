import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, MessageSquareOff } from "lucide-react";
import { fadeUp, stagger } from "../../../../animations/motionVariants";
import { getPublicReviews } from "../../../public/api/review.api";

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicReviews()
      .then((res) => {
        setReviews(res?.data?.reviews?.slice(0, 3) || []); // Take top 3
      })
      .catch((error) => {
        console.error("Failed to fetch public reviews", error);
        setReviews([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-white dark:bg-[#0b1120] flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-24 bg-white dark:bg-[#0b1120] text-center flex flex-col items-center justify-center min-h-[40vh]">
        <MessageSquareOff className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Patient Stories</h3>
        <p className="text-slate-500 max-w-md mx-auto mt-2">We are currently gathering feedback from our community. Check back soon for patient stories.</p>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 bg-white dark:bg-[#0b1120] relative border-b border-slate-200 dark:border-slate-800">
      <div className="w-full max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Large Image */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="w-full h-full min-h-[400px] lg:min-h-[600px] rounded-3xl overflow-hidden relative shadow-md"
          >
            {/* We use a realistic placeholder layout here since the reference uses a large image, and we must ensure it looks professional */}
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
               <img 
                 src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2000&auto=format&fit=crop" 
                 alt="Happy Family with Caregiver" 
                 className="w-full h-full object-cover grayscale-[30%]"
                 loading="lazy"
               />
               <div className="absolute inset-0 bg-black/10" />
            </div>
            
            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-2">
                Real Families.<br />
                Real Care.<br />
                Real Results.
              </h2>
            </div>
          </motion.div>

          {/* Right Column: Stacked Testimonials */}
          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col h-full justify-center gap-0"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-8 uppercase tracking-wider">
              <span className="w-8 h-px bg-emerald-600 dark:bg-emerald-400"></span>
              Testimonials
            </div>

            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                variants={fadeUp}
                className={`py-8 ${index !== 0 ? 'border-t-2 border-slate-200 dark:border-slate-800' : ''}`}
              >
                <Quote className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-4" />
                <p className="text-lg md:text-xl text-[#1c2b36] dark:text-slate-300 font-medium leading-relaxed italic mb-6">
                  "{review.comment}"
                </p>
                <div className="flex flex-col items-end w-full">
                  <span className="font-bold text-[#1c2b36] dark:text-white uppercase tracking-wider text-sm">
                    {review.user?.firstName} {review.user?.lastName}
                  </span>
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">
                    {review.service?.title || "Home Care"}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
