import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, Trash2, Clock, Eye, UserCheck, AlertCircle } from "lucide-react";
import {
  getPendingCaregivers,
  approveCaregiverRegistration,
  rejectCaregiverRegistration,
  getAllUsers,
  getPendingProfiles,
  approveCaregiverProfile,
  rejectCaregiverProfile,
} from "../api/admin.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { formatDate } from "../../../utils/helpers";
import StatusBadge from "../../../components/ui/StatusBadge";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

const Caregivers = () => {
  const [tab, setTab] = useState("all");
  const [caregivers, setCaregivers] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState({ open: false, id: null, type: null });
  const [rejectReason, setRejectReason] = useState("");

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [allRes, pendingRegRes, pendingProfRes] = await Promise.all([
        getAllUsers("caregiver"),
        getPendingCaregivers(),
        getPendingProfiles(),
      ]);
      setCaregivers(allRes?.data?.users || []);
      setPendingRegistrations(pendingRegRes?.data?.caregivers || []);
      setPendingProfiles(pendingProfRes?.data?.caregivers || []);
    } catch (err) {
      toast.error("Failed to load caregivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleApproveReg = async (userId) => {
    try {
      setActionLoading(userId);
      await approveCaregiverRegistration(userId);
      toast.success("Caregiver approved!");
      fetchAll();
    } catch (err) {
      toast.error(err.message || "Failed to approve");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectReg = async () => {
    try {
      setActionLoading(rejectModal.id);
      await rejectCaregiverRegistration(rejectModal.id, rejectReason);
      toast.success("Caregiver registration rejected");
      setRejectModal({ open: false, id: null, type: null });
      setRejectReason("");
      fetchAll();
    } catch (err) {
      toast.error(err.message || "Failed to reject");
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveProfile = async (caregiverId) => {
    try {
      setActionLoading(caregiverId);
      await approveCaregiverProfile(caregiverId);
      toast.success("Profile approved! Caregiver is now live.");
      fetchAll();
    } catch (err) {
      toast.error(err.message || "Failed to approve profile");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectProfile = async () => {
    try {
      setActionLoading(rejectModal.id);
      await rejectCaregiverProfile(rejectModal.id, rejectReason);
      toast.success("Profile changes requested");
      setRejectModal({ open: false, id: null, type: null });
      setRejectReason("");
      fetchAll();
    } catch (err) {
      toast.error(err.message || "Failed to reject profile");
    } finally {
      setActionLoading(null);
    }
  };

  const tabs = [
    { id: "all",      label: "All Caregivers",       count: caregivers.length },
    { id: "pending",  label: "Pending Registration", count: pendingRegistrations.length },
    { id: "profiles", label: "Pending Profiles",     count: pendingProfiles.length },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Caregiver Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Approve, reject, and manage caregiver accounts</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              tab === t.id
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                tab === t.id ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* All Caregivers Tab */}
            {tab === "all" && (
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {["Caregiver", "Email", "Phone", "Status", "Joined", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {caregivers.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No caregivers found</td></tr>
                  ) : caregivers.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                            {c.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white text-sm">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{c.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{c.phone || "—"}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatDate(c.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {!c.isApproved && c.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApproveReg(c._id)}
                                disabled={actionLoading === c._id}
                                className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors disabled:opacity-50"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setRejectModal({ open: true, id: c._id, type: "registration" })}
                                className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pending Registrations Tab */}
            {tab === "pending" && (
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {["Caregiver", "Email", "Phone", "Registered", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {pendingRegistrations.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No pending registrations</td></tr>
                  ) : pendingRegistrations.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-semibold text-sm">
                            {c.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white text-sm">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{c.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{c.phone || "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatDate(c.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleApproveReg(c._id)}
                            disabled={actionLoading === c._id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectModal({ open: true, id: c._id, type: "registration" })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pending Profiles Tab */}
            {tab === "profiles" && (
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {["Caregiver", "Email", "Location", "Services", "Submitted", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {pendingProfiles.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No pending profiles</td></tr>
                  ) : pendingProfiles.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-semibold text-sm">
                            {c.userId?.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white text-sm">{c.userId?.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{c.userId?.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {c.location?.city ? `${c.location.city}, ${c.location.state}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {c.servicesOffered?.length || 0} services
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatDate(c.updatedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleApproveProfile(c._id)}
                            disabled={actionLoading === c._id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors disabled:opacity-50"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectModal({ open: true, id: c._id, type: "profile" })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            Request Changes
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </motion.div>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModal.open}
        onClose={() => { setRejectModal({ open: false, id: null, type: null }); setRejectReason(""); }}
        title={rejectModal.type === "profile" ? "Request Profile Changes" : "Reject Registration"}
        size="sm"
      >
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {rejectModal.type === "profile"
              ? "Provide feedback on what changes are needed:"
              : "Provide a reason for rejecting this registration:"}
          </p>
          <textarea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter reason..."
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-end space-x-3">
            <Button variant="outline" size="sm" onClick={() => { setRejectModal({ open: false, id: null, type: null }); setRejectReason(""); }}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={!rejectReason.trim() || actionLoading}
              onClick={rejectModal.type === "profile" ? handleRejectProfile : handleRejectReg}
            >
              {rejectModal.type === "profile" ? "Send Feedback" : "Reject"}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Caregivers;
