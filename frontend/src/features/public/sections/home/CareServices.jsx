import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { getAllServices } from "../../../service/api/service.api";
import { fadeUp, stagger } from "../../../../animations/motionVariants";

const CareServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllServices({ isActive: true, limit: 5 })
      .then((res) => {
        setServices(res?.data?.services || []);
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-[#F8F7F4] dark:bg-[#0b1120] flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="py-24 bg-[#F8F7F4] dark:bg-[#0b1120] text-center flex flex-col items-center justify-center min-h-[50vh]">
        <ShieldAlert className="w-16 h-16 text-slate-400 mb-4" />
        <h3 className="text-2xl font-bold text-[#1c2b36] dark:text-slate-300">No Services Available</h3>
        <p className="text-slate-500 max-w-md mx-auto mt-2">We are currently updating our healthcare offerings. Please check back later.</p>
      </section>
    );
  }

  const featuredService = services[0];
  const otherServices = services.slice(1, 5);

  return (
    <section className="py-24 px-4 bg-[#F8F7F4] dark:bg-[#0b1120] relative">
      <div className="w-full max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-4 uppercase tracking-wider">
            <span className="w-8 h-px bg-emerald-600 dark:bg-emerald-400"></span>
            Services
          </div>
          <h2 className="text-xl md:text-5xl lg:text-6xl font-bold text-[#1c2b36] dark:text-white leading-[1.1] max-w-3xl tracking-tight">
            Compassion Delivered To Your Doorstep.
          </h2>
        </motion.div>

        {/* Featured Service (Top Row) */}
        {featuredService && (
          <motion.div 
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-12"
          >
            {/* Featured Image */}
            <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden relative shadow-lg">
              {featuredService.image ? (
                <img 
                  src={featuredService.image} 
                  alt={featuredService.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  No Image Available
                </div>
              )}
            </div>

            {/* Featured Content */}
            <div className="flex flex-col">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-4">
                Featured Care
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-4xl font-bold text-[#1c2b36] dark:text-white mb-6">
                {featuredService.title}
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-lg">
                {featuredService.shortDescription || featuredService.description || "Comprehensive professional care designed to support your loved ones at home."}
              </p>
              <Link to={`/services/${featuredService.slug || featuredService._id}`}>
                <div className="flex items-center text-[#1c2b36] dark:text-white font-bold group">
                  Learn More 
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform text-emerald-600 dark:text-emerald-400" />
                </div>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Other Services (2x2 Grid) */}
        {otherServices.length > 0 && (
          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {otherServices.map((service) => (
              <motion.div
                key={service._id}
                variants={fadeUp}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap sm:flex-nowrap gap-6 items-center shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0">
                  {service.image ? (
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800" />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-lg sm:text-xl font-bold text-[#1c2b36] dark:text-white mb-2">
                    {service.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                    {service.shortDescription || service.description || "Professional elder care services."}
                  </p>
                  <Link to={`/services/${service.slug || service._id}`}>
                    <div className="flex items-center text-sm font-bold text-[#1c2b36] dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      Learn More 
                      <ArrowRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
      </div>
    </section>
  );
};

export default CareServices;
