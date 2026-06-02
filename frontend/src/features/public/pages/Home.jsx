import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Heart, Shield, Clock, Users, Activity, Star } from "lucide-react";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import { getAllServices } from "../../service/api/service.api";
import { getAllCaregivers } from "../../caregiver/api/caregiver.api";

const Home = () => {
  const [services, setServices] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingCaregivers, setLoadingCaregivers] = useState(true);

  useEffect(() => {
    // Fetch limited number of services for the home page
    getAllServices({ limit: 6, isActive: true })
      .then((res) => {
        const list = res?.data?.services || res?.services || [];
        setServices(list.slice(0, 6)); // Ensure we only show up to 6
      })
      .catch(console.error)
      .finally(() => setLoadingServices(false));

    // Fetch verified caregivers
    getAllCaregivers({ limit: 4, isVerified: true })
      .then((res) => {
        const list = res?.data?.caregivers || res?.caregivers || [];
        setCaregivers(list.slice(0, 4)); // Ensure we only show up to 4
      })
      .catch(console.error)
      .finally(() => setLoadingCaregivers(false));
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-[#0b1120] min-h-screen font-sans overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial="hidden" animate="show" variants={stagger}
            className="flex-1 text-center lg:text-left"
          >
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
              Compassionate Home <br className="hidden lg:block"/>
              Healthcare for Your <br className="hidden lg:block"/>
              Loved Ones
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0">
              Trusted professionals delivering quality medical and personal care directly to your home. Experience peace of mind with our dedicated caregivers.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/services" className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors w-full sm:w-auto text-center">
                Book Care
              </Link>
              <Link to="/about" className="px-8 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors w-full sm:w-auto text-center">
                Learn More
              </Link>
            </motion.div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-auto lg:h-[500px]">
              <img 
                src="/herobg.avif" 
                alt="Caregiver with elderly patient" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Mission & Vision */}
      <section className="py-16 bg-white dark:bg-[#111827] border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 text-center md:text-left">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                To elevate the standard of home healthcare by providing personalized, compassionate, and professional medical services. We strive to empower families and ensure dignity for every individual we serve.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {['Trust', 'Compassion', 'Excellence'].map(v => (
                  <span key={v} className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" /> {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Vision</h2>
              <p className="text-slate-600 dark:text-slate-400 italic text-lg leading-relaxed">
                "A world where every senior and patient receives the highest quality of healthcare in the comfort and familiarity of their own home."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Families Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Why Families Choose Us</h2>
          <p className="text-slate-600 dark:text-slate-400">We combine medical expertise with genuine empathy to deliver care that feels like family.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Verified Professionals", icon: Shield, desc: "Every caregiver undergoes strict background checks and clinical verification." },
            { title: "Medical Expertise", icon: Activity, desc: "Registered nurses and trained attendants for specialized medical needs." },
            { title: "Compassionate Care", icon: Heart, desc: "We match caregivers not just on skill, but on empathy and personality fit." },
            { title: "24/7 Support", icon: Clock, desc: "Round-the-clock availability for emergencies and continuous care requirements." },
            { title: "Transparent Pricing", icon: CheckCircle2, desc: "Clear, upfront costs with no hidden fees or surprise charges." },
            { title: "Family Portal", icon: Users, desc: "Real-time updates and direct communication with your care team." },
          ].map((feature, i) => (
            <div key={i} className="bg-white dark:bg-[#111827] p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-6">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Care Services */}
      <section className="py-20 bg-white dark:bg-[#111827] border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Comprehensive Care Services</h2>
            <p className="text-slate-600 dark:text-slate-400">Tailored support plans designed around your specific health and lifestyle needs.</p>
          </div>
          
          {loadingServices ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full mb-6"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {services.map((srv) => (
                <div key={srv._id} className="text-center">
                  <div className="w-20 h-20 mx-auto bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 overflow-hidden border border-blue-100 dark:border-blue-900/50">
                    {srv.image ? (
                      <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-blue-200 dark:bg-blue-700/50 rounded-full" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-1">{srv.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{srv.shortDescription || srv.description}</p>
                  <Link to={`/services/${srv.slug || srv._id}`} className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline flex items-center justify-center gap-1">
                    View details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 py-10">No services found.</div>
          )}
        </div>
      </section>

      {/* 5. Professionals */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Meet Our Trusted Professionals</h2>
          <p className="text-slate-600 dark:text-slate-400">Experienced, compassionate, and rigorously vetted caregivers.</p>
        </div>
        
        {loadingCaregivers ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse flex flex-col items-center">
                  <div className="w-40 h-40 bg-slate-200 dark:bg-slate-800 rounded-full mb-4"></div>
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                </div>
              ))}
          </div>
        ) : caregivers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {caregivers.map((pro) => (
              <div key={pro._id} className="text-center">
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-4 border-4 border-white dark:border-[#111827] shadow-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {pro.profilePicture ? (
                    <img src={pro.profilePicture} alt={`${pro.user?.firstName} ${pro.user?.lastName}`} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-12 h-12 text-slate-400" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {pro.user ? `${pro.user.firstName} ${pro.user.lastName}` : "Caregiver"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {pro.qualifications?.[0]?.degree || "Certified Caregiver"}
                </p>
              </div>
            ))}
          </div>
        ) : (
           <div className="text-center text-slate-500 py-10">No professionals found.</div>
        )}
      </section>

      {/* 6. Process */}
      <section className="py-20 bg-slate-100 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">How Our Platform Works</h2>
            <p className="text-slate-600 dark:text-slate-400">Simple, transparent, and designed for your convenience.</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-200 dark:bg-blue-900/50 -translate-y-1/2 z-0"></div>
            {[
              { step: 1, title: "Search", desc: "Find the right service." },
              { step: 2, title: "Consult", desc: "Free assessment call." },
              { step: 3, title: "Match", desc: "Meet your caregiver." },
              { step: 4, title: "Care Begins", desc: "Experience peace of mind." },
            ].map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center mb-8 md:mb-0 bg-slate-100 dark:bg-slate-900 px-4">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{s.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Stats */}
      <section className="bg-blue-600 dark:bg-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { val: "10k+", label: "Families Served" },
              { val: "2k+", label: "Verified Pros" },
              { val: "50+", label: "Cities Covered" },
              { val: "98%", label: "Satisfaction Rate" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-extrabold mb-2">{stat.val}</div>
                <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials (Static content as we don't have a real endpoint for this) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">What Families Say</h2>
          <p className="text-slate-600 dark:text-slate-400">Real stories from people who trusted us with their loved ones.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { text: "The nursing care provided to my father post-surgery was exceptional. The nurse was not only highly skilled but incredibly kind.", author: "Neha Patel", role: "Daughter" },
            { text: "Finding a reliable dementia caregiver was so stressful until we found this platform. Sunita has been a blessing to our family.", author: "Anjali Rao", role: "Wife" },
            { text: "Very professional service. The physiotherapist helped my mother walk again within weeks. Highly recommend their services.", author: "Vikram Singh", role: "Son" }
          ].map((t, i) => (
            <div key={i} className="bg-white dark:bg-[#111827] p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative">
              <div className="text-amber-400 flex mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-slate-700 dark:text-slate-300 italic mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-500">{t.author.charAt(0)}</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.author}</h4>
                  <span className="text-xs text-slate-500">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. CTA */}
      <section className="py-20 bg-slate-50 dark:bg-[#0b1120]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Give Your Loved Ones the Care They Deserve</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">Book a free consultation today to discuss your specific requirements.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/services" className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors w-full sm:w-auto">
              Get Started
            </Link>
            <Link to="/contact" className="px-8 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors w-full sm:w-auto">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
