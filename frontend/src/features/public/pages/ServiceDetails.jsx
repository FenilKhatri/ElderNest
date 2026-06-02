import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  HeartPulse,
  Star,
  User,
} from "lucide-react";
import { SERVICE_MODES, WEEK_DAYS } from "../../../constants/serviceConstants";
import { getServiceById } from "../../service/api/service.api";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import http from "../../../lib/axios";
import { formatCurrency } from "../../../utils/helpers";

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

  const cover = service.coverImage || service.image || (service.images && service.images[0]);
  const modeLabel = SERVICE_MODES.find((m) => m.value === service.serviceMode)?.label;
  const availableDays = WEEK_DAYS.filter(({ key }) => service.availability?.[key]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 font-sans">
      
      {/* 1. Hero Section */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-site-wide mx-auto">
        <Link to="/services" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
        </Link>
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
              {service.title}
            </h1>
            {service.shortDescription && (
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{service.shortDescription}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-6">
              {modeLabel && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  {modeLabel}
                </span>
              )}
              {service.rating > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-500" /> {service.rating} ({service.totalReviews} reviews)
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={`/caregivers?service=${service._id}`} className="inline-flex items-center justify-center px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm shadow-blue-600/20 text-center">
                Find Caregivers
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-blue-100 hover:border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 font-bold rounded-xl transition-colors text-center">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-slate-100 dark:bg-slate-800">
              {cover ? (
                <img src={cover} alt={service.title} className="w-full h-full object-cover" />
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

      {/* Description */}
      <section className="py-16 max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About This Service</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{service.description}</p>
      </section>

      {/* Features */}
      {service.features?.length > 0 && (
        <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">What is Included</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((item) => (
                <div key={item} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-slate-700 dark:text-slate-300 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {service.benefits?.length > 0 && (
        <section className="py-16 max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Benefits</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Availability */}
      {availableDays.length > 0 && (
        <section className="py-12 max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Service Availability</h2>
          <div className="flex flex-wrap gap-2">
            {availableDays.map(({ label }) => (
              <span key={label} className="px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                {label}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {service.images?.length > 0 && (
        <section className="py-12 max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {service.images.map((url) => (
              <img key={url} src={url} alt="" className="rounded-xl h-60 w-full object-cover" />
            ))}
          </div>
        </section>
      )}

      {/* 4. Verified Caregivers */}
      {caregivers.length > 0 && (
        <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verified & Qualified Caregivers</h2>
              <p className="text-slate-500 dark:text-slate-400">Our professionals are rigorously vetted, trained, and ready to help.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              {caregivers.slice(0, 3).map(cg => (
                <Link to={`/caregivers/${cg._id}?service=${service._id}`} key={cg._id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 w-full sm:w-80 flex items-center border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group">
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

      {/* 6. Family Reviews */}
      {reviews.length > 0 && (
        <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* CTA Banner */}
      <section className="py-12 max-w-site mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-blue-600 rounded-3xl p-10 md:p-14 text-center shadow-xl shadow-blue-600/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
            Ready to provide the best care for your loved one?
          </h2>
          <p className="text-blue-100 mb-8 w-full max-w-4xl mx-auto relative z-10 text-lg">
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