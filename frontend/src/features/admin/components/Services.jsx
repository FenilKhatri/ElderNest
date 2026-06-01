import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import { getAllServices } from "../../service/api/service.api";
import TitleText from "../../../components/ui/TitleText";
import TitleAndDescription from "../../../components/ui/TitleAndDescription";
import { HeartPulse } from "lucide-react";

const Services = ({ Title, Description, SubDescription }) => {
  const [serviceItems, setServiceItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllServices({ isActive: true })
      .then((res) => setServiceItems(res?.data?.services || []))
      .catch(() => setServiceItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-site-wide mx-auto px-5 py-10 md:py-16">
      <div className="w-full max-w-4xl mx-auto flex flex-col space-y-6 text-center">
        <TitleText children={Title} className="text-left md:text-center" />
        <TitleAndDescription
          Description={Description}
          SubDescription={SubDescription}
          className="text-left md:text-center mx-auto"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : serviceItems.length === 0 ? (
        <p className="text-center text-slate-500 pt-10">No active services in the database.</p>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-10"
        >
          {serviceItems.map((service) => (
            <motion.div
              key={service._id}
              variants={fadeUp}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <HeartPulse className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{service.title}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default Services;
