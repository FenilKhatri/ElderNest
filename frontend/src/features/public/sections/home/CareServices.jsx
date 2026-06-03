import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";
import { fadeUp } from "../../../../animations/motionVariants";
import TitleAndDescription from "../../../../components/ui/TitleAndDescription";
import CareServiceCard from "../../../../components/cards/CareServiceCard";
import { getAllServices } from "../../../service/api/service.api";

const CareServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllServices({ isActive: true, limit: 8 })
      .then((res) => setServices(res?.data?.services || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center flex-col space-y-5 md:space-y-15 py-14 overflow-x-hidden">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="w-full max-w-4xl mx-auto flex flex-col space-y-6"
      >
        <TitleAndDescription
          Description="Our Home Healthcare Services"
          SubDescription="ElderNest offers professional in-home care services. Browse our active offerings and book verified caregivers for your family."
          className="text-left md:text-center mx-auto"
        />
      </motion.div>

      {loading ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <p className="text-slate-500 text-center">No services available yet.</p>
      ) : (
        <div className="w-full min-w-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service) => {
            const raw = service.shortDescription || service.description || "";
            const description =
              raw.length > 160 ? `${raw.slice(0, 160).trim()}…` : raw;
            return (
              <Link
                key={service._id}
                to={`/services/${service.slug || service._id}`}
                className="block min-w-0 h-full"
              >
                <CareServiceCard
                  Icon={HeartPulse}
                  Title={service.title}
                  Description={description}
                />
              </Link>
            );
          })}
        </div>
      )}

      {!loading && services.length > 0 && (
        <Link to="/services" className="text-blue-600 font-semibold hover:underline text-sm">
          View all services →
        </Link>
      )}
    </div>
  );
};

export default CareServices;
