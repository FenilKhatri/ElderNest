import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Undo2, Eye, CheckCircle, XCircle } from "lucide-react";
import http from "../../../lib/axios";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { formatDateTime } from "../../../utils/helpers";
import StatusBadge from "../../../components/ui/StatusBadge";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { REFUND_STATUS_OPTIONS } from "../../../constants/bookingConstants";

const PaymentsRefunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("all");
  const [viewItem, setViewItem] = useState(null);
  
  const [processModal, setProcessModal] = useState({ open: false, type: "", refundId: null });
  const [adminNotes, setAdminNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeStatus !== "all") params.status = activeStatus;
      
      const res = await http.get("/refunds", { params });
      setRefunds(res?.data?.refunds || []);
    } catch (err) {
      toast.error("Failed to load refund requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, [activeStatus]);

  const handleAction = async () => {
    try {
      setActionLoading(true);
      const newStatus = processModal.type === "approve" ? "approved" 
                      : processModal.type === "reject" ? "rejected" 
                      : "processed";
      
      await http.patch(`/refunds/${processModal.refundId}/status`, {
        status: newStatus,
        adminNotes
      });
      
      toast.success(`Refund marked as ${newStatus}`);
      setProcessModal({ open: false, type: "", refundId: null });
      setAdminNotes("");
      setViewItem(null);
      fetchRefunds();
    } catch (err) {
      toast.error("Failed to update refund status");
    } finally {
      setActionLoading(false);
    }
  };

  const openProcessModal = (refundId, type) => {
    setProcessModal({ open: true, type, refundId });
    setAdminNotes("");
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Refund Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review and process user refund requests</p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start overflow-x-auto">
          {REFUND_STATUS_OPTIONS.map(t => (
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
                  {["User", "Booking ID", "Amount", "Reason", "Status", "Requested", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {refunds.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                      <Undo2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No refund requests found
                    </td>
                  </tr>
                ) : (
                  refunds.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">{r.userId?.name}</p>
                        <p className="text-xs text-slate-500">{r.userId?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                        {r.bookingId?.bookingId}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">
                        ₹{r.amount?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate" title={r.reason}>
                        {r.reason}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-4 py-3 text-sm text-slate-600">{formatDateTime(r.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => setViewItem(r)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
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

      <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} title="Refund Request Details" size="md">
        {viewItem && (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Refund Amount</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{viewItem.amount?.toFixed(2)}</p>
              </div>
              <div><StatusBadge status={viewItem.status} /></div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500">Booking Reference</p>
                <p className="text-sm font-medium">{viewItem.bookingId?.bookingId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Transaction ID (Original Payment)</p>
                <p className="text-sm font-medium">{viewItem.transactionId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Requested By</p>
                <p className="text-sm font-medium">{viewItem.userId?.name} ({viewItem.userId?.email})</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Reason</p>
                <p className="text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-slate-700 dark:text-slate-300">{viewItem.reason}</p>
              </div>
              {viewItem.adminNotes && (
                <div>
                  <p className="text-xs text-slate-500">Admin Notes</p>
                  <p className="text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-blue-800 dark:text-blue-200">{viewItem.adminNotes}</p>
                </div>
              )}
            </div>

            {viewItem.status === "pending" && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                <Button variant="danger" className="flex-1" onClick={() => openProcessModal(viewItem._id, "reject")}>
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => openProcessModal(viewItem._id, "approve")}>
                  <CheckCircle className="w-4 h-4 mr-2" /> Approve
                </Button>
              </div>
            )}
            {viewItem.status === "approved" && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                <Button className="flex-1" onClick={() => openProcessModal(viewItem._id, "process")}>
                  Mark as Processed
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal isOpen={processModal.open} onClose={() => setProcessModal({ open: false, type: "", refundId: null })} title="Process Refund" size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {processModal.type === "approve" ? "You are approving this refund. The funds should be returned to the user."
             : processModal.type === "reject" ? "You are rejecting this refund request."
             : "You are confirming that the refund has been successfully sent to the user via the payment gateway."}
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Admin Notes (Required for rejection)</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800"
              placeholder="Internal notes..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setProcessModal({ open: false, type: "", refundId: null })}>Cancel</Button>
            <Button 
              size="sm" 
              variant={processModal.type === "reject" ? "danger" : "primary"}
              disabled={actionLoading || (processModal.type === "reject" && !adminNotes.trim())}
              onClick={handleAction}
            >
              {actionLoading ? "Saving..." : "Confirm"}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default PaymentsRefunds;
