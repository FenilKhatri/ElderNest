import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Mail } from "lucide-react";
import { getNewsletterSubscribers } from "../api/admin.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { formatDate } from "../../../utils/helpers";

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewsletterSubscribers()
      .then((res) => setSubscribers(res?.data?.subscribers || []))
      .catch(() => toast.error("Failed to load newsletter subscribers"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Mail className="w-7 h-7 text-blue-600" />
          Newsletter Subscribers
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {subscribers.length} active subscriber{subscribers.length !== 1 ? "s" : ""}
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            No subscribers yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Subscribed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {subscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                      {sub.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 capitalize">
                      {sub.status || "subscribed"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {formatDate(sub.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Newsletter;
