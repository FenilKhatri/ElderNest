import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { CreditCard, Eye, Activity } from "lucide-react";
import http from "../../../lib/axios";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { formatDateTime } from "../../../utils/helpers";
import StatusBadge from "../../../components/ui/StatusBadge";
import Modal from "../../../components/ui/Modal";

const TYPE_OPTIONS = [
  { id: "all", label: "All Types" },
  { id: "payment", label: "Payment" },
  { id: "refund", label: "Refund" },
  { id: "payout", label: "Payout" },
];

const PaymentsTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("all");
  const [viewItem, setViewItem] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeType !== "all") params.type = activeType;
      
      const res = await http.get("/transactions", { params });
      setTransactions(res?.data?.transactions || []);
    } catch (err) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [activeType]);

  const getAmountColor = (type, amount) => {
    if (type === "refund" || type === "payout") return "text-red-600 dark:text-red-400";
    return "text-green-600 dark:text-green-400";
  };

  const getAmountPrefix = (type) => {
    if (type === "refund" || type === "payout") return "-";
    return "+";
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">View all platform payments, refunds, and payouts</p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start overflow-x-auto">
          {TYPE_OPTIONS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveType(t.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                activeType === t.id 
                  ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse h-12 bg-slate-200 dark:bg-slate-700 rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {["Transaction ID", "User / Caregiver", "Type", "Amount", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                      <CreditCard className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{t.transactionId}</td>
                      <td className="px-4 py-3">
                        {t.userId ? (
                          <p className="text-sm font-medium">{t.userId.name} <span className="text-xs text-slate-400">(User)</span></p>
                        ) : null}
                        {t.caregiverId ? (
                          <p className="text-sm font-medium">{t.caregiverId.userId?.name || 'Caregiver'} <span className="text-xs text-slate-400">(CG)</span></p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-sm capitalize">{t.type}</td>
                      <td className={`px-4 py-3 text-sm font-semibold ${getAmountColor(t.type)}`}>
                        {getAmountPrefix(t.type)}₹{t.amount?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                      <td className="px-4 py-3 text-sm text-slate-600">{formatDateTime(t.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => setViewItem(t)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} title="Transaction Details" size="md">
        {viewItem && (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Amount</p>
                <p className={`text-2xl font-bold ${getAmountColor(viewItem.type)}`}>₹{viewItem.amount?.toFixed(2)}</p>
              </div>
              <div>
                <StatusBadge status={viewItem.status} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Transaction ID</p>
                <p className="text-sm font-medium truncate">{viewItem.transactionId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Date & Time</p>
                <p className="text-sm font-medium">{formatDateTime(viewItem.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Type</p>
                <p className="text-sm font-medium capitalize">{viewItem.type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Method</p>
                <p className="text-sm font-medium uppercase">{viewItem.paymentMethod}</p>
              </div>
            </div>

            {viewItem.bookingId && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 mb-1">Related Booking</p>
                <p className="text-sm text-blue-600 hover:underline cursor-pointer">{viewItem.bookingId.bookingId}</p>
              </div>
            )}
            
            {viewItem.metadata && Object.keys(viewItem.metadata).length > 0 && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 mb-2">Metadata</p>
                <pre className="text-xs bg-slate-50 dark:bg-slate-800 p-3 rounded-lg overflow-x-auto text-slate-700 dark:text-slate-300">
                  {JSON.stringify(viewItem.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default PaymentsTransactions;
