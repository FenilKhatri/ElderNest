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
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";
import { COMPLAINT_STATUS_OPTIONS, COMPLAINT_STATUS_TABS, COMPLAINT_TYPE_FILTER } from "@/constants";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [viewItem, setViewItem] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    setLoading(true);
    const params = {};
    if (activeTab !== "all") params.status = activeTab;
    if (activeType !== "all") params.type = activeType;
    
    getAllComplaints(params)
      .then((res) => setComplaints(res?.data?.complaints || []))
      .catch(() => toast.error("Failed to load complaints"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [activeTab, activeType]);

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
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Complaints Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage user and caregiver complaints</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start">
          {COMPLAINT_TYPE_FILTER.map(t => (
            <Button
              key={t.id}
              onClick={() => setActiveType(t.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeType === t.id 
                  ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" 
                  : "bg-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {COMPLAINT_STATUS_TABS.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
            }`}
          >
            {tab.label}
          </Button>
        ))}
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
                  {["Reporter", "Type", "Subject", "Received", "Status", "Actions"].map((h) => (
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
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{c.userId?.name || "Unknown"}</p>
                        <p className="text-xs text-slate-500">{c.userId?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm capitalize">{c.type}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{c.subject}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{formatDateTime(c.createdAt)}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3">
                        <Button type="button" onClick={() => openItem(c)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </Button>
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
            <div>
              <p className="text-xs text-slate-500">Reporter</p>
              <p className="text-sm font-medium">{viewItem.userId?.name} <span className="text-slate-400 capitalize">({viewItem.type})</span></p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Subject</p>
              <p className="text-sm font-medium">{viewItem.subject}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Description</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">{viewItem.description}</p>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Update Status</label>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  options={COMPLAINT_STATUS_OPTIONS}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Admin Notes</label>
                <Textarea
                  rows={3}
                  placeholder="Admin notes (Internal use only)"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setViewItem(null)}>Cancel</Button>
              <Button size="sm" onClick={handleUpdate} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Complaints;
