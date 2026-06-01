import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Eye } from "lucide-react";
import { getAllComplaints, updateComplaintStatus } from "../../complaint/api/complaint.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { formatDateTime } from "../../../utils/helpers";
import StatusBadge from "../../../components/ui/StatusBadge";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const ComplaintsList = ({ title, description, defaultStatus = "", typeFilter = "" }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewItem, setViewItem] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    setLoading(true);
    const params = {};
    if (defaultStatus) params.status = defaultStatus;
    if (typeFilter) params.type = typeFilter;
    getAllComplaints(params)
      .then((res) => setComplaints(res?.data?.complaints || []))
      .catch(() => toast.error("Failed to load complaints"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [defaultStatus, typeFilter]);

  const openItem = (c) => {
    setViewItem(c);
    setAdminNotes(c.adminNotes || "");
    setNewStatus(c.status);
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await updateComplaintStatus(viewItem._id, newStatus, adminNotes);
      toast.success("Complaint updated");
      setViewItem(null);
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{description}</p>
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
                  {["User", "Subject", "Type", "Received", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">No complaints found</td>
                  </tr>
                ) : (
                  complaints.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{c.userId?.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{c.subject}</td>
                      <td className="px-4 py-3 text-sm capitalize">{c.type}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{formatDateTime(c.createdAt)}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => openItem(c)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
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

      <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} title="Complaint Details" size="md">
        {viewItem && (
          <div className="p-6 space-y-4">
            <p className="text-sm"><strong>Subject:</strong> {viewItem.subject}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{viewItem.description}</p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <textarea
              rows={3}
              placeholder="Admin notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setViewItem(null)}>Close</Button>
              <Button size="sm" onClick={handleUpdate} disabled={saving}>{saving ? "Saving..." : "Update Status"}</Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default ComplaintsList;
