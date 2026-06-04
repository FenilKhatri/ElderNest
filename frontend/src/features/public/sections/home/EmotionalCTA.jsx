import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../../../components/ui/Button";

const EmotionalCTA = () => {
  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-start overflow-hidden">
      
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2000&auto=format&fit=crop" 
          alt="Compassionate Care" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transperant via-white/50 to-white/20 dark:from-slate-950/75 dark:via-slate-900/45 dark:to-transparent"/>
      </div>

      <div className="w-full max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-white mb-6 uppercase tracking-wider opacity-80">
            <span className="w-8 h-px bg-white"></span>
            Join ElderNest
          </div>
          
          <h2 className="text-xl sm:text-3xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            Because Every Parent Deserves Dignified Care.
          </h2>
          
          <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-400 mb-10 leading-relaxed font-medium">
            Let us help you provide the comfort, safety, and professional care your family deserves. Our care coordinators are ready to match you with the perfect caregiver.
          </p>
          
          <Link to="/caregivers">
            <Button variant="primary" size="lg" className="group text-[#1c2b36]">
              Book A Consultation
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
      
    </section>
  );
};

export default EmotionalCTA;
