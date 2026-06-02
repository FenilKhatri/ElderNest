import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Banknote, Eye, CheckCircle } from "lucide-react";
import http from "../../../lib/axios";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { formatDateTime, formatDate } from "../../../utils/helpers";
import StatusBadge from "../../../components/ui/StatusBadge";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

const STATUS_OPTIONS = [
  { id: "all", label: "All Statuses" },
  { id: "pending", label: "Pending" },
  { id: "processing", label: "Processing" },
  { id: "completed", label: "Completed" },
  { id: "failed", label: "Failed" },
];

const PaymentsPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("all");
  const [viewItem, setViewItem] = useState(null);
  
  const [processModal, setProcessModal] = useState({ open: false, payoutId: null, status: "" });
  const [referenceId, setReferenceId] = useState("");
  const [notes, setNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeStatus !== "all") params.status = activeStatus;
      
      const res = await http.get("/payouts", { params });
      setPayouts(res?.data?.payouts || []);
    } catch (err) {
      toast.error("Failed to load payouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [activeStatus]);

  const handleUpdate = async () => {
    try {
      setActionLoading(true);
      await http.patch(`/payouts/${processModal.payoutId}/status`, {
        status: processModal.status,
        referenceId,
        notes
      });
      
      toast.success("Payout status updated");
      setProcessModal({ open: false, payoutId: null, status: "" });
      setReferenceId("");
      setNotes("");
      setViewItem(null);
      fetchPayouts();
    } catch (err) {
      toast.error("Failed to update payout status");
    } finally {
      setActionLoading(false);
    }
  };

  const openProcessModal = (payoutId, status) => {
    setProcessModal({ open: true, payoutId, status });
    setReferenceId("");
    setNotes("");
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Caregiver Payouts</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage earning transfers to caregivers</p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start overflow-x-auto">
          {STATUS_OPTIONS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveStatus(t.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                activeStatus === t.id 
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-12 bg-slate-200 dark:bg-slate-700 rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {["Caregiver", "Amount", "Period", "Method", "Status", "Requested", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                      <Banknote className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No payouts found
                    </td>
                  </tr>
                ) : (
                  payouts.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">{p.caregiverId?.userId?.name}</p>
                        <p className="text-xs text-slate-500">{p.caregiverId?.userId?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">
                        ₹{p.amount?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {p.periodStart ? formatDate(p.periodStart) : "—"} to {p.periodEnd ? formatDate(p.periodEnd) : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 uppercase">
                        {p.payoutMethod?.replace("_", " ")}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3 text-sm text-slate-600">{formatDateTime(p.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => setViewItem(p)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
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

      <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} title="Payout Details" size="md">
        {viewItem && (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Payout Amount</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{viewItem.amount?.toFixed(2)}</p>
              </div>
              <div><StatusBadge status={viewItem.status} /></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-xs text-slate-500">Caregiver</p>
                <p className="text-sm font-medium">{viewItem.caregiverId?.userId?.name} ({viewItem.caregiverId?.userId?.email})</p>
                <p className="text-xs text-slate-500 mt-1">Phone: {viewItem.caregiverId?.userId?.phone || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-xs text-slate-500">Period</p>
                <p className="text-sm font-medium">
                  {viewItem.periodStart ? formatDate(viewItem.periodStart) : "N/A"} - {viewItem.periodEnd ? formatDate(viewItem.periodEnd) : "N/A"}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-slate-500">Method</p>
                <p className="text-sm font-medium uppercase">{viewItem.payoutMethod?.replace("_", " ")}</p>
              </div>

              {viewItem.referenceId && (
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Bank / Payment Reference ID</p>
                  <p className="text-sm font-medium">{viewItem.referenceId}</p>
                </div>
              )}
            </div>

            {viewItem.notes && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 mb-1">Notes</p>
                <p className="text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-slate-700 dark:text-slate-300">{viewItem.notes}</p>
              </div>
            )}

            {viewItem.status === "pending" && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => openProcessModal(viewItem._id, "processing")}>
                  Mark as Processing
                </Button>
              </div>
            )}
            
            {viewItem.status === "processing" && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                <Button variant="danger" className="flex-1" onClick={() => openProcessModal(viewItem._id, "failed")}>
                  Mark Failed
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => openProcessModal(viewItem._id, "completed")}>
                  <CheckCircle className="w-4 h-4 mr-2" /> Mark Completed
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal isOpen={processModal.open} onClose={() => setProcessModal({ open: false, payoutId: null, status: "" })} title={`Update Payout to ${processModal.status}`} size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
            You are changing the payout status to <strong>{processModal.status}</strong>.
          </p>
          
          {processModal.status === "completed" && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Bank / Transfer Reference ID (Required)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800"
                placeholder="e.g. UTR Number, Txn ID..."
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Admin Notes (Optional)</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800"
              placeholder="Internal notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setProcessModal({ open: false, payoutId: null, status: "" })}>Cancel</Button>
            <Button 
              size="sm" 
              disabled={actionLoading || (processModal.status === "completed" && !referenceId.trim())}
              onClick={handleUpdate}
            >
              {actionLoading ? "Saving..." : "Confirm Update"}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default PaymentsPayouts;
