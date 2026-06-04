import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { CreditCard, Eye, LayoutGrid, List } from "lucide-react";
import http from "../../../lib/axios";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { formatDateTime } from "../../../utils/helpers";
import StatusBadge from "../../../components/ui/StatusBadge";
import Modal from "../../../components/ui/Modal";
import SearchFilterBar from "../../../components/filters/SearchFilterBar";
import GridLayout, { GridSkeleton } from "../../../components/layout/GridLayout";
import EntityCard from "../../../components/cards/EntityCard";
import Button from "../../../components/ui/Button";
import { TRANSACTION_TYPE_OPTIONS as TYPE_OPTIONS } from "@/constants";

const PaymentsTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("all");
  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState("table");
  const [viewItem, setViewItem] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await http.get("/transactions");
      setTransactions(res?.data?.transactions || []);
    } catch (err) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    let result = transactions;
    if (activeType !== "all") {
      result = result.filter((t) => t.type === activeType);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.transactionId?.toLowerCase().includes(q) ||
          t.userId?.name?.toLowerCase().includes(q) ||
          t.caregiverId?.userId?.name?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [transactions, activeType, search]);

  const getAmountColor = (type) => {
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
      </motion.div>

      <motion.div variants={fadeUp}>
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by transaction ID, user, or caregiver..."
          filters={[
            {
              key: "type",
              label: "Transaction Type",
              value: activeType,
              onChange: setActiveType,
              options: [{ value: "all", label: "All types" }, ...TYPE_OPTIONS],
            },
          ]}
          onClear={() => {
            setSearch("");
            setActiveType("all");
          }}
        />

        {/* Layout Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit mt-4 ml-auto">
          <button
            onClick={() => setLayout("table")}
            className={`p-2 rounded-md transition-all ${layout === "table" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 dark:text-slate-400"}`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayout("grid")}
            className={`p-2 rounded-md transition-all ${layout === "grid" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 dark:text-slate-400"}`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        {loading ? (
          layout === "grid" ? <GridSkeleton count={6} /> : (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse h-12 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-full" />
              ))}
            </div>
          )
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
            {search || activeType !== "all" ? "No transactions match your filters" : "No transactions found"}
          </div>
        ) : layout === "grid" ? (
          <GridLayout>
            {filteredTransactions.map((t) => (
              <EntityCard
                key={t._id}
                footer={
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      onClick={() => setViewItem(t)}
                      className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </Button>
                  </div>
                }
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs font-mono text-slate-500">{t.transactionId}</p>
                  <StatusBadge status={t.status} />
                </div>
                <p className="font-semibold text-slate-900 dark:text-white mb-1">
                  {t.userId ? t.userId.name : (t.caregiverId?.userId?.name || 'Caregiver')}
                  <span className="text-xs text-slate-400 ml-1">
                    ({t.userId ? 'User' : 'CG'})
                  </span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">{t.type}</p>
                <p className={`text-lg font-bold mt-2 ${getAmountColor(t.type)}`}>
                  {getAmountPrefix(t.type)}₹{t.amount?.toFixed(2)}
                </p>
                <p className="text-xs text-slate-400 mt-2">{formatDateTime(t.createdAt)}</p>
              </EntityCard>
            ))}
          </GridLayout>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
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
                  {filteredTransactions.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{t.transactionId}</td>
                      <td className="px-4 py-3">
                        {t.userId ? (
                          <p className="text-sm font-medium dark:text-white">{t.userId.name} <span className="text-xs text-slate-400">(User)</span></p>
                        ) : null}
                        {t.caregiverId ? (
                          <p className="text-sm font-medium dark:text-white">{t.caregiverId.userId?.name || 'Caregiver'} <span className="text-xs text-slate-400">(CG)</span></p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-sm capitalize dark:text-slate-300">{t.type}</td>
                      <td className={`px-4 py-3 text-sm font-semibold ${getAmountColor(t.type)}`}>
                        {getAmountPrefix(t.type)}₹{t.amount?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatDateTime(t.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => setViewItem(t)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                <p className="text-sm font-medium uppercase">{viewItem.paymentMethod || "N/A"}</p>
              </div>
            </div>

            {viewItem.bookingId && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 mb-1">Related Booking</p>
                <p className="text-sm font-mono text-slate-700 dark:text-slate-300">
                  {viewItem.bookingId.bookingId || viewItem.bookingId}
                </p>
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
