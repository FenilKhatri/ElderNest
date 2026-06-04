import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Banknote, Eye, CheckCircle, LayoutGrid, List } from "lucide-react";
import http from "../../../lib/axios";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { formatDateTime, formatDate } from "../../../utils/helpers";
import StatusBadge from "../../../components/ui/StatusBadge";
import Modal from "../../../components/ui/Modal";
import SearchFilterBar from "../../../components/filters/SearchFilterBar";
import GridLayout, { GridSkeleton } from "../../../components/layout/GridLayout";
import EntityCard from "../../../components/cards/EntityCard";
import Button from "../../../components/ui/Button";
import { PAYOUT_STATUS_OPTIONS } from "@/constants";
import { PAYOUT_STATUS } from "../../../constants/statusConstants";
import Textarea from "../../../components/ui/Textarea";
import Input from "../../../components/ui/Input";

const PaymentsPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState("table");
  const [viewItem, setViewItem] = useState(null);
  
  const [processModal, setProcessModal] = useState({ open: false, payoutId: null, status: "" });
  const [referenceId, setReferenceId] = useState("");
  const [notes, setNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const res = await http.get("/payouts");
      setPayouts(res?.data?.payouts || []);
    } catch (err) {
      toast.error("Failed to load payouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const filteredPayouts = useMemo(() => {
    let result = payouts;
    if (activeStatus !== "all") {
      result = result.filter((p) => p.status === activeStatus);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.caregiverId?.userId?.name?.toLowerCase().includes(q) ||
          p.caregiverId?.userId?.email?.toLowerCase().includes(q) ||
          p.referenceId?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [payouts, activeStatus, search]);

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
      </motion.div>

      <motion.div variants={fadeUp}>
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by caregiver name, email, or reference ID..."
          filters={[
            {
              key: "status",
              label: "Payout Status",
              value: activeStatus,
              onChange: setActiveStatus,
              options: [{ value: "all", label: "All statuses" }, ...PAYOUT_STATUS_OPTIONS],
            },
          ]}
          onClear={() => {
            setSearch("");
            setActiveStatus("all");
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
        ) : filteredPayouts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
            {search || activeStatus !== "all" ? "No payouts match your filters" : "No payouts found"}
          </div>
        ) : layout === "grid" ? (
          <GridLayout>
            {filteredPayouts.map((p) => (
              <EntityCard
                key={p._id}
                footer={
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      onClick={() => setViewItem(p)}
                      className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </Button>
                  </div>
                }
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs font-mono text-slate-500">{p.payoutMethod?.replace("_", " ").toUpperCase()}</p>
                  <StatusBadge status={p.status} />
                </div>
                <p className="font-semibold text-slate-900 dark:text-white mb-1">
                  {p.caregiverId?.userId?.name}
                </p>
                <p className="text-xs text-slate-500 mb-2">{p.caregiverId?.userId?.email}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  ₹{p.amount?.toFixed(2)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  {p.periodStart ? formatDate(p.periodStart) : "—"} to {p.periodEnd ? formatDate(p.periodEnd) : "—"}
                </p>
                <p className="text-xs text-slate-400 mt-2">{formatDateTime(p.createdAt)}</p>
              </EntityCard>
            ))}
          </GridLayout>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
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
                  {filteredPayouts.map((p) => (
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
                        <Button type="button" onClick={() => setViewItem(p)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

            {viewItem.status === PAYOUT_STATUS.PENDING && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => openProcessModal(viewItem._id, PAYOUT_STATUS.PROCESSING)}>
                  Mark as Processing
                </Button>
              </div>
            )}
            
            {viewItem.status === PAYOUT_STATUS.PROCESSING && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                <Button variant="danger" className="flex-1" onClick={() => openProcessModal(viewItem._id, PAYOUT_STATUS.FAILED)}>
                  Mark Failed
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => openProcessModal(viewItem._id, PAYOUT_STATUS.COMPLETED)}>
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
          
          {processModal.status === PAYOUT_STATUS.COMPLETED && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Bank / Transfer Reference ID (Required)</label>
              <Input
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
            <Textarea
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
              disabled={actionLoading || (processModal.status === PAYOUT_STATUS.COMPLETED && !referenceId.trim())}
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
