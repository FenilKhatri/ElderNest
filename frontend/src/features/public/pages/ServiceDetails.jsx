import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, CheckCircle2, HeartPulse, UserCheck, Star, 
  MapPin, Plus, Minus, User, Shield, PhoneCall 
} from "lucide-react";
import { getServiceById } from "../../service/api/service.api";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import http from "../../../lib/axios";
import { formatCurrency } from "../../../utils/helpers";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 py-4">
      <button 
        className="flex w-full items-center justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-slate-900 dark:text-white">{question}</span>
        {isOpen ? <Minus className="w-5 h-5 text-slate-500" /> : <Plus className="w-5 h-5 text-slate-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ServiceDetails = () => {
  const { idOrSlug } = useParams();
  const [service, setService] = useState(null);
  const [caregivers, setCaregivers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Service
        const res = await getServiceById(idOrSlug);
        const serviceData = res.data?.service;
        setService(serviceData);

        if (serviceData) {
          // 2. Fetch Caregivers for this service
          const cgRes = await http.get(`/caregivers?services=${serviceData._id}&status=approved`);
          setCaregivers(cgRes.data?.caregivers || []);

          // 3. Fetch Service Reviews
          const revRes = await http.get(`/reviews/service/${serviceData._id}`);
          setReviews(revRes.data?.reviews || []);
        }
      } catch (error) {
        console.error("Failed to fetch service details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Service Not Found</h2>
        <Link to="/services" className="text-blue-600 hover:underline">Return to Services</Link>
      </div>
    );
  }

  const faqs = [
    { q: "How quickly can a caregiver start?", a: "Depending on availability and your specific requirements, a caregiver can start within 24 to 48 hours of booking." },
    { q: "Can I choose my caregiver?", a: "Yes, you can browse through our verified caregivers and select one that best matches your needs, or we can recommend the best fit." },
    { q: "Are the caregivers verified?", a: "Absolutely. All our caregivers undergo a strict background check, credential verification, and interview process before being listed on ElderNest." },
    { q: "What if the caregiver takes a leave?", a: "In case of planned or unplanned leave, we will provide a temporary replacement caregiver so that your care is not interrupted." }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 font-sans">
      
      {/* 1. Hero Section */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Link to="/services" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
        </Link>
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
              {service.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              {service.description || "Professional care services tailored to meet the unique needs of your loved ones."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={`/caregivers?service=${service._id}`} className="inline-flex items-center justify-center px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm shadow-blue-600/20 text-center">
                Find Caregivers
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-blue-100 hover:border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 font-bold rounded-xl transition-colors text-center">
                <PhoneCall className="w-4 h-4 mr-2" /> Call Expert
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-slate-100 dark:bg-slate-800">
              {service.image ? (
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <HeartPulse className="w-20 h-20 mb-4 opacity-50" />
                  <span className="font-medium text-lg">Service Image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. What is Included */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">What is Included?</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-12">Comprehensive care tailored to your specific needs.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Personal Hygiene", desc: "Assistance with bathing, grooming, and dressing." },
              { title: "Mobility Assistance", desc: "Help with walking, transferring, and light exercise." },
              { title: "Medication Reminders", desc: "Timely reminders for prescribed medications." },
              { title: "Companionship", desc: "Meaningful interaction and emotional support." }
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] text-center border border-slate-100 dark:border-slate-700">
                <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center rounded-full mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Who Needs This Service */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
             <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
               <div className="absolute inset-0 bg-blue-600/5 mix-blend-multiply dark:mix-blend-screen"></div>
               {/* Placeholder for abstract grid/image as in design */}
               <div className="absolute inset-0 pattern-grid-lg text-slate-200/50 dark:text-slate-700/50"></div>
             </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Who Needs This Service?</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Our {service.title.toLowerCase()} service is designed to provide dedicated support for individuals who require professional assistance in their daily routines.
            </p>
            <ul className="space-y-5">
              {[
                { title: "Recovering Patients", desc: "Individuals recovering from surgery, illness, or injury." },
                { title: "Seniors & Elders", desc: "Seniors who need help with daily activities and companionship." },
                { title: "Chronic Illness", desc: "Patients managing long-term health conditions at home." },
                { title: "Bedridden Patients", desc: "Individuals requiring complete physical assistance." }
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Verified Caregivers */}
      {caregivers.length > 0 && (
        <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verified & Qualified Caregivers</h2>
              <p className="text-slate-500 dark:text-slate-400">Our professionals are rigorously vetted, trained, and ready to help.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              {caregivers.slice(0, 3).map(cg => (
                <Link to={`/caregivers/${cg._id}`} key={cg._id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 w-full sm:w-80 flex items-center border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden mr-4 border-2 border-white dark:border-slate-800 shadow-sm shrink-0">
                    {cg.userId?.profileImage ? (
                      <img src={cg.userId.profileImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-full h-full p-2 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{cg.userId?.name}</h4>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                      {cg.rating || "New"} • {cg.experienceYears} Yrs Exp
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Duration & Pricing Packages */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Duration & Pricing Packages</h2>
          <p className="text-slate-500 dark:text-slate-400">Transparent pricing for the exact level of care you need.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">12-Hour Day Care</h3>
            <p className="text-sm text-slate-500 mb-6 min-h-[40px]">Perfect for daytime assistance and monitoring.</p>
            <div className="flex items-end gap-1 mb-8">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">₹800</span>
              <span className="text-slate-500 font-medium mb-1">/ shift</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Daytime assistance</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Medication management</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Flexible start times</li>
            </ul>
            <Link to={`/caregivers?service=${service._id}`} className="block w-full py-3 text-center border-2 border-blue-100 hover:border-blue-200 dark:border-slate-700 dark:hover:border-slate-600 text-blue-600 dark:text-white font-bold rounded-xl transition-colors">
              Find Caregiver
            </Link>
          </div>
          
          {/* Card 2 (Recommended) */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-blue-600 shadow-xl relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
              Recommended
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">24-Hour Live-in Care</h3>
            <p className="text-sm text-slate-500 mb-6 min-h-[40px]">Comprehensive round-the-clock support.</p>
            <div className="flex items-end gap-1 mb-8">
              <span className="text-4xl font-extrabold text-blue-600">₹1,500</span>
              <span className="text-slate-500 font-medium mb-1">/ day</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-500 mr-2 shrink-0" /> 24/7 dedicated care</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-500 mr-2 shrink-0" /> Complete daily routine help</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-500 mr-2 shrink-0" /> Full monitoring</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-500 mr-2 shrink-0" /> Sleeping arrangements needed</li>
            </ul>
            <Link to={`/caregivers?service=${service._id}`} className="block w-full py-3 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm">
              Find Caregiver
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Per Hour Care</h3>
            <p className="text-sm text-slate-500 mb-6 min-h-[40px]">Short visits for specific tasks or check-ins.</p>
            <div className="flex items-end gap-1 mb-8">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">₹400</span>
              <span className="text-slate-500 font-medium mb-1">/ hour</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Min 3 hours booking</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Post-hospitalization check</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Therapy assistance</li>
            </ul>
            <Link to={`/caregivers?service=${service._id}`} className="block w-full py-3 text-center border-2 border-blue-100 hover:border-blue-200 dark:border-slate-700 dark:hover:border-slate-600 text-blue-600 dark:text-white font-bold rounded-xl transition-colors">
              Find Caregiver
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Family Reviews */}
      {reviews.length > 0 && (
        <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Family Reviews</h2>
              <p className="text-slate-500 dark:text-slate-400">See what other families are saying about our {service.title.toLowerCase()} service.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map(review => (
                <div key={review._id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col h-full">
                  <p className="text-slate-700 dark:text-slate-300 mb-6 italic leading-relaxed flex-1">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center mt-auto">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mr-3">
                      {review.userId?.profileImage ? (
                        <img src={review.userId.profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-sm">{review.userId?.name?.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{review.userId?.name}</h4>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-slate-200"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. FAQ */}
      <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Frequently Asked Questions</h2>
          <p className="text-slate-500 dark:text-slate-400">Answers to common queries.</p>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>

      {/* 8. CTA Banner */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-blue-600 rounded-3xl p-10 md:p-14 text-center shadow-xl shadow-blue-600/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
            Ready to provide the best care for your loved one?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto relative z-10 text-lg">
            Find experienced and verified professionals ready to help immediately.
          </p>
          <Link to={`/caregivers?service=${service._id}`} className="inline-block px-10 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-sm hover:shadow-md hover:bg-slate-50 transition-all relative z-10">
            Book a Caregiver
          </Link>
        </div>
      </section>

    </div>
  );
};

export default ServiceDetails;