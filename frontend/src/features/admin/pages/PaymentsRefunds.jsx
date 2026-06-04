import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Undo2, Eye, CheckCircle, XCircle, LayoutGrid, List } from "lucide-react";
import http from "../../../lib/axios";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { formatDateTime } from "../../../utils/helpers";
import StatusBadge from "../../../components/ui/StatusBadge";
import Modal from "../../../components/ui/Modal";
import SearchFilterBar from "../../../components/filters/SearchFilterBar";
import GridLayout, { GridSkeleton } from "../../../components/layout/GridLayout";
import EntityCard from "../../../components/cards/EntityCard";
import Button from "../../../components/ui/Button";
import LoadMore from "../../../components/common/LoadMore";
import { REFUND_STATUS_OPTIONS } from "@/constants";
import { REFUND_STATUS } from "../../../constants/statusConstants";
import Textarea from "../../../components/ui/Textarea";

const PaymentsRefunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState("table");
  const [viewItem, setViewItem] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, hasMore: false });

  const [processModal, setProcessModal] = useState({ open: false, type: "", refundId: null });
  const [adminNotes, setAdminNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRefunds = async (pageToFetch = 1, append = false) => {
    try {
      if (append) setIsLoadingMore(true);
      else setLoading(true);

      const params = { page: pageToFetch, limit: 12 };
      if (activeStatus !== "all") params.status = activeStatus;
      if (search) params.search = search;

      const res = await http.get("/refunds", { params });
      const data = res?.data?.refunds || [];
      const pag = res?.data?.pagination || { page: 1, hasMore: false };

      if (append) {
        setRefunds(prev => [...prev, ...data]);
      } else {
        setRefunds(data);
      }
      setPagination(pag);
    } catch (err) {
      toast.error("Failed to load refund requests");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchRefunds(1, false);
  }, [activeStatus, search]);

  const handleLoadMore = () => {
    if (!isLoadingMore && pagination.hasMore) {
      fetchRefunds(pagination.page + 1, true);
    }
  };

  const filteredRefunds = useMemo(() => {
    let result = refunds;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.userId?.name?.toLowerCase().includes(q) ||
          r.userId?.email?.toLowerCase().includes(q) ||
          r.bookingId?.bookingId?.toLowerCase().includes(q) ||
          r.transactionId?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [refunds, search]);

  const handleAction = async () => {
    try {
      setActionLoading(true);
      const newStatus = processModal.type === "approve" ? REFUND_STATUS.APPROVED
        : processModal.type === "reject" ? REFUND_STATUS.REJECTED
          : REFUND_STATUS.PROCESSED;

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
      </motion.div>

      <motion.div variants={fadeUp}>
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by user, email, booking ID, or transaction..."
          filters={[
            {
              key: "status",
              label: "Refund Status",
              value: activeStatus,
              onChange: setActiveStatus,
              options: [{ value: "all", label: "All statuses" }, ...REFUND_STATUS_OPTIONS],
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
        ) : filteredRefunds.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
            {search || activeStatus !== "all" ? "No refunds match your filters" : "No refund requests found"}
          </div>
        ) : layout === "grid" ? (
          <GridLayout>
            {filteredRefunds.map((r) => (
              <EntityCard
                key={r._id}
                footer={
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      onClick={() => setViewItem(r)}
                      className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </Button>
                  </div>
                }
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs font-mono text-slate-500">{r.bookingId?.bookingId}</p>
                  <StatusBadge status={r.status} />
                </div>
                <p className="font-semibold text-slate-900 dark:text-white mb-1">
                  {r.userId?.name}
                </p>
                <p className="text-xs text-slate-500 mb-2">{r.userId?.email}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  ₹{r.amount?.toFixed(2)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 truncate" title={r.reason}>
                  {r.reason}
                </p>
                <p className="text-xs text-slate-400 mt-2">{formatDateTime(r.createdAt)}</p>
              </EntityCard>
            ))}
          </GridLayout>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
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
                  {filteredRefunds.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium dark:text-white">{r.userId?.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{r.userId?.email}</p>
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
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatDateTime(r.createdAt)}</td>
                      <td className="px-4 py-3">
                        <Button type="button" onClick={() => setViewItem(r)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
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

        {/* Load More Button */}
        {!loading && pagination.hasMore && (
          <div className="mt-8 flex justify-center w-full">
            <LoadMore 
              hasMore={pagination.hasMore}
              onLoadMore={handleLoadMore}
              isLoading={isLoadingMore}
            />
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
                <p className="text-sm font-medium dark:text-slate-100">{viewItem.bookingId?.bookingId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Transaction ID (Original Payment)</p>
                <p className="text-sm font-medium dark:text-slate-100">{viewItem.transactionId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Requested By</p>
                <p className="text-sm font-medium dark:text-slate-100">{viewItem.userId?.name} ({viewItem.userId?.email})</p>
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

            {viewItem.status === REFUND_STATUS.PENDING && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                <Button variant="danger" className="flex-1" onClick={() => openProcessModal(viewItem._id, "reject")}>
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => openProcessModal(viewItem._id, "approve")}>
                  <CheckCircle className="w-4 h-4 mr-2" /> Approve
                </Button>
              </div>
            )}
            {viewItem.status === REFUND_STATUS.APPROVED && (
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
            <Textarea
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
