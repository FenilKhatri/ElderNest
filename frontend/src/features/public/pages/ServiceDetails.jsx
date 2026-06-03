import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  HeartPulse,
  Star,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Quote,
  BadgeCheck
} from "lucide-react";
import { SERVICE_MODES, WEEK_DAYS } from "@/constants";
import { getServiceById } from "../../service/api/service.api";
import http from "../../../lib/axios";
import Button from "../../../components/ui/Button";

const ServiceDetails = () => {
  const { idOrSlug } = useParams();
  const [service, setService] = useState(null);
  const [caregivers, setCaregivers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carousel State
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    if (service?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % service.images.length);
    }
  };

  const prevImage = () => {
    if (service?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + service.images.length) % service.images.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isCarouselOpen) return;
      if (e.key === "Escape") setIsCarouselOpen(false);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCarouselOpen, service]);

  useEffect(() => {
    if (isCarouselOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isCarouselOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getServiceById(idOrSlug);
        const serviceData = res.data?.service;
        setService(serviceData);

        if (serviceData) {
          const cgRes = await http.get(`/caregivers?services=${serviceData._id}&status=approved`);
          setCaregivers(cgRes.data?.caregivers || []);

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
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pt-24 pb-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pt-24 pb-12 px-4 text-center flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4">Service Not Found</h2>
        <Link to="/services" className="text-[#2563EB] hover:underline">Return to Services</Link>
      </div>
    );
  }

  const cover = service.coverImage || service.image || (service.images && service.images[0]);
  const modeLabel = SERVICE_MODES?.find((m) => m.value === service.serviceMode)?.label;
  const availableDays = WEEK_DAYS?.filter(({ key }) => service.availability?.[key]);
  
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  
  const staggerVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#020617] font-sans text-[#0F172A] dark:text-[#F8FAFC] overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Link to="/services" className="inline-flex items-center text-sm font-semibold text-[#64748B] hover:text-[#2563EB] mb-8 transition-colors" aria-label="Back to Services">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
        </Link>
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerVariant}
            className="w-full lg:w-1/2"
          >
            <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-3 mb-6">
              {modeLabel && (
                <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#2563EB]/20 text-[#2563EB] dark:text-[#0EA5E9]">
                  {modeLabel}
                </span>
              )}
              {service.rating > 0 && (
                <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-[#10B981]/10 text-[#10B981] flex items-center gap-1.5 border border-[#10B981]/20">
                  <Star className="w-4 h-4 fill-[#10B981]" /> {service.rating.toFixed(1)} Rating
                </span>
              )}
            </motion.div>
            
            <motion.h1 variants={fadeUpVariant} className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              {service.title}
            </motion.h1>
            
            {service.shortDescription && (
              <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-[#64748B] dark:text-[#94A3B8] mb-8 leading-relaxed">
                {service.shortDescription}
              </motion.p>
            )}
            
            <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link to={`/caregivers?service=${service._id}`}>
                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.03 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-2xl transition-all shadow-lg shadow-[#2563EB]/25 cursor-pointer"
                >
                  Find Caregivers
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.03 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-[#0F172A] border-2 border-[#E2E8F0] dark:border-[#1E293B] hover:border-[#2563EB] dark:hover:border-[#0EA5E9] text-[#0F172A] dark:text-[#F8FAFC] font-semibold rounded-2xl transition-all cursor-pointer"
                >
                  Contact Us
                </motion.button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="flex items-center gap-8 border-t border-[#F1F5F9] dark:border-[#1E293B] pt-8">
              <div>
                <div className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-1">
                  <Star className="w-5 h-5 fill-[#10B981] text-[#10B981]" /> {service.rating?.toFixed(1) || "New"}
                </div>
                <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">Rating</div>
              </div>
              <div className="w-px h-10 bg-[#F1F5F9] dark:bg-[#1E293B]"></div>
              <div>
                <div className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">{service.totalReviews || 0}</div>
                <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">Total Reviews</div>
              </div>
              <div className="w-px h-10 bg-[#F1F5F9] dark:bg-[#1E293B]"></div>
              <div>
                <div className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">{caregivers.length}</div>
                <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">Professionals</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            {/* Floating gradient glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#2563EB]/20 to-[#0EA5E9]/20 blur-3xl rounded-full transform scale-110 -z-10 animate-pulse"></div>
            
            <div className="aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl shadow-[#2563EB]/10 relative group bg-[#F8FAFC] dark:bg-[#0F172A]">
              {cover ? (
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  src={cover} 
                  alt={service.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#94A3B8]">
                  <HeartPulse className="w-24 h-24 mb-4 opacity-50" />
                  <span className="font-medium text-xl">Service Image</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Description */}
      <section className="py-20 bg-[#F8FAFC] dark:bg-[#020617] border-y border-[#F1F5F9] dark:border-[#1E293B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#0F172A] dark:text-[#F8FAFC]">About This Service</h2>
          <p className="text-lg text-[#64748B] dark:text-[#94A3B8] leading-relaxed whitespace-pre-wrap">{service.description}</p>
        </div>
      </section>

      {/* 2. What's Included */}
      {service.features?.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What's Included</h2>
            <p className="text-lg text-[#64748B] dark:text-[#94A3B8]">Everything you need for comprehensive care.</p>
          </div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerVariant}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {service.features.map((item, i) => (
              <motion.div 
                key={i} 
                variants={fadeUpVariant}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white dark:bg-[#0F172A] p-8 rounded-3xl border border-[#F1F5F9] dark:border-[#1E293B] shadow-sm hover:shadow-xl hover:shadow-[#2563EB]/5 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-[#2563EB]/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6 text-[#2563EB] dark:text-[#0EA5E9]" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-[#0F172A] dark:text-[#F8FAFC]">{item}</h3>
                <p className="text-[#64748B] dark:text-[#94A3B8] text-sm">Included as part of our premium healthcare service standard.</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* 3. Who Needs This Service */}
      {service.benefits?.length > 0 && (
        <section className="py-24 bg-[#F8FAFC] dark:bg-[#020617] border-y border-[#F1F5F9] dark:border-[#1E293B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-1/2">
                <div className="aspect-square max-h-[600px] rounded-[32px] overflow-hidden shadow-2xl shadow-[#2563EB]/10 bg-[#E2E8F0] dark:bg-[#0F172A]">
                  <img 
                    src={service.images?.[1] || cover} 
                    alt="Who needs this service" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#0F172A] dark:text-[#F8FAFC]">Who Needs This Service?</h2>
                <p className="text-lg text-[#64748B] dark:text-[#94A3B8] mb-10">
                  Our service is tailored to provide maximum benefit and peace of mind.
                </p>
                <motion.ul 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={staggerVariant}
                  className="space-y-6"
                >
                  {service.benefits.map((b, i) => (
                    <motion.li 
                      key={i} 
                      variants={fadeUpVariant}
                      className="flex items-start gap-4"
                    >
                      <div className="mt-1 bg-[#10B981]/10 p-1.5 rounded-full shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC] mb-1">{b}</h4>
                        <p className="text-[#64748B] dark:text-[#94A3B8]">Gain significant improvements and professional support exactly when required.</p>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Visual Journey Gallery */}
      {service.images?.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Visual Journey</h2>
              <p className="text-lg text-[#64748B] dark:text-[#94A3B8]">
                Take a closer look at our {service.title}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCurrentImageIndex(0);
                setIsCarouselOpen(true);
              }}
              className="hidden md:inline-flex px-6 py-3 bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] hover:border-[#2563EB] text-[#0F172A] dark:text-[#F8FAFC] font-semibold rounded-xl transition-all shadow-sm"
            >
              View All Photos
            </motion.button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 h-[500px] lg:h-[600px] rounded-[32px] overflow-hidden">
            {/* Hero Image - Left */}
            <div
              className="w-full lg:w-1/2 h-1/2 lg:h-full relative cursor-pointer overflow-hidden bg-[#E2E8F0] dark:bg-[#0F172A]"
              onClick={() => {
                setCurrentImageIndex(0);
                setIsCarouselOpen(true);
              }}
            >
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                src={service.images[0]}
                alt="Service hero"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300"></div>
            </div>

            {/* 2x2 Grid - Right */}
            {service.images.length > 1 && (
              <div className="w-full lg:w-1/2 h-1/2 lg:h-full grid grid-cols-2 grid-rows-2 gap-4">
                {service.images.slice(1, 5).map((img, index) => (
                  <div
                    key={index}
                    className="relative cursor-pointer overflow-hidden bg-[#E2E8F0] dark:bg-[#0F172A]"
                    onClick={() => {
                      setCurrentImageIndex(index + 1);
                      setIsCarouselOpen(true);
                    }}
                  >
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                      src={img}
                      alt={`Service detail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300"></div>
                    
                    {index === 3 && service.images.length > 5 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center hover:bg-black/60 transition-colors">
                        <span className="text-white text-xl font-bold tracking-wider">
                          +{service.images.length - 5} MORE
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <button
              onClick={() => {
                setCurrentImageIndex(0);
                setIsCarouselOpen(true);
              }}
              className="inline-flex w-full justify-center px-6 py-4 bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] font-semibold rounded-2xl"
            >
              View All Photos
            </button>
          </div>
        </section>
      )}

      {/* 5. Verified & Qualified Caregivers */}
      {caregivers.length > 0 && (
        <section className="py-24 bg-[#F8FAFC] dark:bg-[#020617] border-y border-[#F1F5F9] dark:border-[#1E293B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0F172A] dark:text-[#F8FAFC]">Verified & Qualified Caregivers</h2>
              <p className="text-lg text-[#64748B] dark:text-[#94A3B8]">Our professionals are carefully screened, trained and experienced.</p>
            </div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerVariant}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {caregivers.slice(0, 3).map((cg) => (
                <Link to={`/caregivers/${cg._id}?service=${service._id}`} key={cg._id}>
                  <motion.div 
                    variants={fadeUpVariant}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className="bg-white dark:bg-[#0F172A] rounded-[24px] p-6 border border-[#F1F5F9] dark:border-[#1E293B] shadow-sm hover:shadow-xl hover:shadow-[#2563EB]/10 transition-all flex items-center gap-5"
                  >
                    <div className="w-20 h-20 rounded-full bg-[#F8FAFC] dark:bg-[#1E293B] overflow-hidden shrink-0 border-4 border-white dark:border-[#0F172A] shadow-md relative flex items-center justify-center">
                      {cg.userId?.profileImage ? (
                        <img src={cg.userId.profileImage} alt={cg.userId.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-[#94A3B8]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC] truncate">{cg.userId?.name}</h4>
                        <BadgeCheck className="w-5 h-5 text-[#2563EB] shrink-0" />
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[#64748B] dark:text-[#94A3B8] font-medium">
                        <span className="flex items-center gap-1 bg-[#F8FAFC] dark:bg-[#1E293B] px-2 py-1 rounded-md">
                          <Star className="w-4 h-4 text-[#10B981] fill-[#10B981]" />
                          {cg.rating || "New"}
                        </span>
                        <span>{cg.experienceYears} Yrs Exp</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* 6. Family Reviews */}
      {reviews.length > 0 && (
        <section className="py-24 bg-[#F8FAFC] dark:bg-[#020617] border-y border-[#F1F5F9] dark:border-[#1E293B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0F172A] dark:text-[#F8FAFC]">Family Reviews</h2>
              <p className="text-lg text-[#64748B] dark:text-[#94A3B8]">See what other families are saying about our {service.title.toLowerCase()} service.</p>
            </div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerVariant}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {reviews.slice(0, 3).map((review) => (
                <motion.div 
                  key={review._id} 
                  variants={fadeUpVariant}
                  className="bg-white dark:bg-[#0F172A] rounded-[24px] p-8 border border-[#F1F5F9] dark:border-[#1E293B] shadow-sm relative flex flex-col"
                >
                  <Quote className="w-10 h-10 text-[#2563EB]/10 absolute top-6 right-6" />
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < review.rating ? "text-[#10B981] fill-[#10B981]" : "text-[#E2E8F0] dark:text-[#1E293B]"}`} />
                    ))}
                  </div>
                  <p className="text-[#0F172A] dark:text-[#F8FAFC] text-lg font-medium mb-8 leading-relaxed flex-1">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-[#F8FAFC] dark:bg-[#1E293B] overflow-hidden flex items-center justify-center">
                      {review.userId?.profileImage ? (
                        <img src={review.userId.profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center font-bold text-[#64748B] bg-[#E2E8F0] dark:bg-[#1E293B]">{review.userId?.name?.charAt(0) || "U"}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{review.userId?.name}</h4>
                      <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Verified Family</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* 8. Call To Action Banner */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#2563EB] rounded-[32px] p-12 md:p-20 text-center shadow-2xl shadow-[#2563EB]/20 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10 tracking-tight">
            Ready to provide the best care for your loved one?
          </h2>
          <p className="text-blue-100 mb-10 w-full max-w-3xl mx-auto relative z-10 text-xl font-medium">
            Find experienced and verified caregivers ready to help.
          </p>
          <Link to={`/caregivers?service=${service._id}`}>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="inline-block px-12 py-5 bg-white text-[#2563EB] font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all relative z-10"
            >
              Book a Caregiver
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* 3D Coverflow Carousel Modal */}
      <AnimatePresence>
        {isCarouselOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/95 backdrop-blur-xl"
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-[110]">
              <div className="text-white/80 font-medium tracking-wider text-sm bg-black/20 px-4 py-2 rounded-full backdrop-blur-md">
                {currentImageIndex + 1} / {service.images.length}
              </div>
              <button
                onClick={() => setIsCarouselOpen(false)}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md"
                aria-label="Close gallery"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 md:left-8 z-[110] w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 md:right-8 z-[110] w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Carousel Container */}
            <div 
              className="relative w-full h-full flex items-center justify-center overflow-hidden outline-none" 
              style={{ perspective: "1200px" }}
              onClick={() => setIsCarouselOpen(false)}
            >
              {service.images.map((img, index) => {
                const offset = index - currentImageIndex;
                const isSelected = offset === 0;
                
                if (Math.abs(offset) > 2) return null;

                const sign = Math.sign(offset);
                const absOffset = Math.abs(offset);

                const x = offset * 300; 
                const z = -absOffset * 200; 
                const rotateY = sign * -30; 

                return (
                  <motion.div
                    key={index}
                    initial={false}
                    animate={{
                      x: x,
                      z: z,
                      rotateY: rotateY,
                      scale: isSelected ? 1 : 0.8,
                      opacity: isSelected ? 1 : (1 - absOffset * 0.3),
                      zIndex: 10 - absOffset
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                    className={`absolute w-[85vw] md:w-[65vw] max-w-5xl aspect-[16/10] rounded-[24px] shadow-2xl overflow-hidden cursor-pointer ${
                      !isSelected ? "pointer-events-auto" : ""
                    }`}
                    style={{ transformStyle: "preserve-3d" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSelected) setCurrentImageIndex(index);
                    }}
                  >
                    <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                    {!isSelected && (
                      <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors"></div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ServiceDetails;
