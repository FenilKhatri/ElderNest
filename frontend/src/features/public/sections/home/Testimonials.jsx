import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, MessageSquareOff, Star } from "lucide-react";
import { fadeUp, stagger } from "../../../../animations/motionVariants";
import { getPublicReviews } from "../../../public/api/review.api";

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicReviews()
      .then((res) => {
        setReviews(res?.data?.reviews?.slice(0, 6) || []); // Take top 6
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
    <section className="py-24 px-4 bg-[#F8F7F4] dark:bg-[#0b1120] relative border-b border-slate-200 dark:border-slate-800">
      <div className="w-full max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-4 uppercase tracking-wider">
              <span className="w-8 h-px bg-emerald-600 dark:bg-emerald-400"></span>
              Testimonials
              <span className="w-8 h-px bg-emerald-600 dark:bg-emerald-400"></span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1c2b36] dark:text-white leading-[1.15] mb-6 tracking-tight">
              Real Families. Real Care. <br className="hidden sm:block" />
              Real Results.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Hear what families have to say about their experience with our compassionate caregivers.
            </p>
          </motion.div>
        </div>

        <motion.div 
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {reviews.map((review) => {
            const rating = review.rating || 5;
            const name = review.userId?.name || 'Anonymous User';
            const avatarUrl = review.userId?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`;
            
            let serviceTitle = "Elder Care";
            if (review.serviceId?.name) {
              serviceTitle = review.serviceId.name;
            } else if (review.caregiverId?.userId?.name) {
              serviceTitle = `Care from ${review.caregiverId.userId.name}`;
            }

            return (
              <motion.div
                key={review._id}
                variants={fadeUp}
                className="p-6 md:p-8 bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col h-full"
              >
                <Quote className="absolute top-6 right-6 w-16 h-16 text-slate-100 dark:text-slate-800 opacity-50 rotate-12" />
                
                <div className="flex gap-1 mb-6 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'}`} 
                    />
                  ))}
                </div>
                
                <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-8 italic relative z-10 flex-grow">
                  "{review.comment}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto relative z-10 border-t border-slate-100 dark:border-slate-800 pt-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-slate-50 dark:border-slate-800 shadow-sm bg-slate-200">
                    <img 
                      src={avatarUrl} 
                      alt={name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${name}&background=random`;
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1c2b36] dark:text-white text-sm md:text-base leading-snug">
                      {name}
                    </h4>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mt-1">
                      {serviceTitle}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default Testimonials;
