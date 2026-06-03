import { useState, useEffect, useRef, useMemo } from "react";
import SearchFilterBar from "../../../components/filters/SearchFilterBar";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { 
  CheckCircle, XCircle, Eye, UserCheck, AlertCircle, 
  ChevronDown, Activity, Clock, Trash2, LayoutGrid, List,
  Loader2
} from "lucide-react";
import {
  getPendingCaregivers,
  approveCaregiverRegistration,
  rejectCaregiverRegistration,
  getAllUsers,
  getPendingProfiles,
  approveCaregiverProfile,
  rejectCaregiverProfile,
  deleteUser
} from "../api/admin.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { formatDate } from "../../../utils/helpers";
import StatusBadge from "../../../components/ui/StatusBadge";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/ui/Textarea";

// Action Dropdown Component
const ActionDropdown = ({ caregiver, onApprove, onReject, open, onToggle, onClose, isLoading }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="flex items-center space-x-2">
      <div className="relative" ref={dropdownRef}>
        <button type="button"
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          disabled={isLoading}
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <span className="text-xs mr-1 font-medium">Status</span>
          )}
          <ChevronDown className="w-4 h-4" />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute right-0 mt-1 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-10 py-1"
            >
              <button type="button"
                onClick={(e) => { e.stopPropagation(); onClose(); onApprove(caregiver); }}
                className="w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Approve
              </button>
              <button type="button"
                onClick={(e) => { e.stopPropagation(); onClose(); onReject(caregiver); }}
                className="w-full text-left px-4 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-2" /> Reject
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Caregivers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState("all");
  const [caregivers, setCaregivers] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [layout, setLayout] = useState("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modals
  const [rejectModal, setRejectModal] = useState({ open: false, id: null, type: null });
  const [rejectReason, setRejectReason] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

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

  // Auto-switch tab when returning from verification review
  useEffect(() => {
    if (location.state?.tab) {
      setTab(location.state.tab);
      // Clear the state to prevent re-triggering on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleApprove = async (c) => {
    if (c.status !== "pending" || c.isApproved) {
      toast.info(c.status === "rejected" ? "This caregiver was rejected." : "This caregiver is already approved.");
      return;
    }
    try {
      setActionLoading(c._id);
      await Promise.all([
        approveCaregiverRegistration(c._id),
        new Promise(resolve => setTimeout(resolve, 400)) // Min visual delay
      ]);
      toast.success("Caregiver approved!");
      
      // Optimistic Update
      setCaregivers(prev => prev.map(user => user._id === c._id ? { ...user, status: "approved", isApproved: true } : user));
      setPendingRegistrations(prev => prev.filter(user => user._id !== c._id));
    } catch (err) {
      toast.error(err.message || "Failed to approve");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = (c) => {
    if (c.status !== "pending" || c.isApproved) {
      toast.info("Only pending registrations can be rejected.");
      return;
    }
    setRejectModal({ open: true, id: c._id, type: "registration" });
  };

  const handleDeleteClick = (c) => {
    setDeleteModal({ open: true, id: c._id });
  };

  const confirmDeleteCaregiver = async () => {
    if (!deleteModal.id) return;
    try {
      setActionLoading(deleteModal.id);
      await Promise.all([
        deleteUser(deleteModal.id),
        new Promise(resolve => setTimeout(resolve, 400))
      ]);
      toast.success("Caregiver deleted successfully");
      
      // Optimistic Update
      const id = deleteModal.id;
      setCaregivers(prev => prev.filter(u => u._id !== id));
      setPendingRegistrations(prev => prev.filter(u => u._id !== id));
      setPendingProfiles(prev => prev.filter(u => u.userId?._id !== id && u.userId !== id));
      
      setDeleteModal({ open: false, id: null });
    } catch (error) {
      toast.error(error?.message || "Failed to delete caregiver");
    } finally {
      setActionLoading(null);
    }
  };

  const executeReject = async () => {
    try {
      setActionLoading(rejectModal.id);
      if (rejectModal.type === "registration") {
        await Promise.all([
          rejectCaregiverRegistration(rejectModal.id, rejectReason),
          new Promise(resolve => setTimeout(resolve, 400))
        ]);
        toast.success("Caregiver registration rejected");
        
        // Optimistic Update
        setCaregivers(prev => prev.map(u => u._id === rejectModal.id ? { ...u, status: "rejected", isApproved: false } : u));
        setPendingRegistrations(prev => prev.filter(u => u._id !== rejectModal.id));
      } else {
        await Promise.all([
          rejectCaregiverProfile(rejectModal.id, rejectReason),
          new Promise(resolve => setTimeout(resolve, 400))
        ]);
        toast.success("Profile changes requested");
        
        // Optimistic Update
        setPendingProfiles(prev => prev.filter(p => p._id !== rejectModal.id));
      }
      setRejectModal({ open: false, id: null, type: null });
      setRejectReason("");
    } catch (err) {
      toast.error(err.message || "Failed to reject");
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveProfile = async (caregiverId) => {
    try {
      setActionLoading(caregiverId);
      await Promise.all([
        approveCaregiverProfile(caregiverId),
        new Promise(resolve => setTimeout(resolve, 400))
      ]);
      toast.success("Profile approved! Caregiver is now live.");
      
      // Optimistic Update
      setPendingProfiles(prev => prev.filter(p => p._id !== caregiverId));
    } catch (err) {
      toast.error(err.message || "Failed to approve profile");
    } finally {
      setActionLoading(null);
    }
  };

  const matchSearch = (c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    );
  };

  const matchStatus = (c) => statusFilter === "all" || c.status === statusFilter;

  const filteredAll = useMemo(
    () => caregivers.filter((c) => matchSearch(c) && matchStatus(c)),
    [caregivers, search, statusFilter]
  );
  const filteredPending = useMemo(
    () => pendingRegistrations.filter((c) => matchSearch(c)),
    [pendingRegistrations, search]
  );
  const filteredProfiles = useMemo(() => {
    return pendingProfiles.filter((c) => {
      const u = c.userId;
      const name = typeof u === "object" ? u?.name : c.name;
      const email = typeof u === "object" ? u?.email : c.email;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return name?.toLowerCase().includes(q) || email?.toLowerCase().includes(q);
    });
  }, [pendingProfiles, search]);

  const tabs = [
    { id: "all",      label: "All Caregivers",       count: filteredAll.length },
    { id: "pending",  label: "Pending Registration", count: filteredPending.length },
    { id: "profiles", label: "Pending Profiles",     count: filteredProfiles.length },
  ];

  const handleView = (c) => {
    navigate(`/admin/caregivers/${c._id}`);
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Caregiver Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Approve, reject, and manage caregiver accounts</p>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search caregivers by name, email, or phone..."
          filters={[
            {
              key: "status",
              label: "Status",
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: "all", label: "All statuses" },
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
              ],
            },
          ]}
          onClear={() => {
            setSearch("");
            setStatusFilter("all");
          }}
        />
      </motion.div>

      {/* Tabs and Layout Toggle */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
          {tabs.map((t) => (
            <button type="button"
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                tab === t.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  tab === t.id ? "bg-white text-blue-600" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Layout Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
          <button type="button"
            onClick={() => setLayout("table")}
            className={`p-2 rounded-md transition-all ${layout === "table" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700"}`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button type="button"
            onClick={() => setLayout("grid")}
            className={`p-2 rounded-md transition-all ${layout === "grid" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700"}`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
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
          <div className="overflow-x-auto min-h-[400px]">
            {/* All Caregivers Tab */}
            {tab === "all" && (
              layout === "table" ? (
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {["Caregiver", "Email", "Phone", "Status", "Joined", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredAll.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No caregivers found</td></tr>
                  ) : filteredAll.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 cursor-pointer" onClick={() => handleView(c)}>
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                            {c.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white text-sm hover:underline">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{c.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{c.phone || "—"}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatDate(c.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button type="button"
                            onClick={() => navigate(`/admin/caregivers/${c._id}`)}
                            className="p-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {c.status === "pending" && (
                            <ActionDropdown 
                              caregiver={c}
                              open={openDropdownId === c._id}
                              onToggle={() => setOpenDropdownId(openDropdownId === c._id ? null : c._id)}
                              onClose={() => setOpenDropdownId(null)}
                              onApprove={handleApprove}
                              onReject={handleReject}
                              isLoading={actionLoading === c._id}
                            />
                          )}
                          <button type="button"
                            onClick={() => handleDeleteClick(c)}
                            disabled={actionLoading === c._id}
                            className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {actionLoading === c._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                  {filteredAll.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-slate-500 dark:text-slate-400">No caregivers found</div>
                  ) : filteredAll.map((c) => (
                    <div key={c._id} className="bg-white dark:bg-slate-800 rounded-lg p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-4 relative">
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        {c.status === "pending" && (
                          <ActionDropdown 
                            caregiver={c}
                            open={openDropdownId === c._id}
                            onToggle={() => setOpenDropdownId(openDropdownId === c._id ? null : c._id)}
                            onClose={() => setOpenDropdownId(null)}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            isLoading={actionLoading === c._id}
                          />
                        )}
                        <button type="button"
                          onClick={() => handleDeleteClick(c)}
                          disabled={actionLoading === c._id}
                          className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {actionLoading === c._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate(`/admin/caregivers/${c._id}`)}>
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                          {c.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white hover:underline">{c.name}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{c.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <div>
                          <span className="block text-xs text-slate-400">Phone</span>
                          {c.phone || "—"}
                        </div>
                        <div>
                          <span className="block text-xs text-slate-400">Joined</span>
                          {formatDate(c.createdAt)}
                        </div>
                      </div>
                      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                        <StatusBadge status={c.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Pending Registrations Tab */}
            {tab === "pending" && (
              layout === "table" ? (
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {["Caregiver", "Email", "Phone", "Registered", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredPending.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No pending registrations</td></tr>
                  ) : filteredPending.map((c) => (
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
                          <button type="button"
                            onClick={() => handleApprove(c)}
                            disabled={actionLoading === c._id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {actionLoading === c._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />} Approve
                          </button>
                          <button type="button"
                            onClick={() => setRejectModal({ open: true, id: c._id, type: "registration" })}
                            disabled={actionLoading === c._id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                  {filteredPending.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-slate-500 dark:text-slate-400">No pending registrations</div>
                  ) : filteredPending.map((c) => (
                    <div key={c._id} className="bg-white dark:bg-slate-800 rounded-lg p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-lg">
                          {c.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">{c.name}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{c.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <div>
                          <span className="block text-xs text-slate-400">Phone</span>
                          {c.phone || "—"}
                        </div>
                        <div>
                          <span className="block text-xs text-slate-400">Registered</span>
                          {formatDate(c.createdAt)}
                        </div>
                      </div>
                      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center space-x-3">
                        <button type="button"
                          onClick={() => handleApprove(c)}
                          disabled={actionLoading === c._id}
                          className="flex-1 inline-flex justify-center items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          {actionLoading === c._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />} Approve
                        </button>
                        <button type="button"
                          onClick={() => setRejectModal({ open: true, id: c._id, type: "registration" })}
                          disabled={actionLoading === c._id}
                          className="flex-1 inline-flex justify-center items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Pending Profiles Tab */}
            {tab === "profiles" && (
              layout === "table" ? (
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {["Caregiver", "Email", "Location", "Services", "Submitted", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredProfiles.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No pending profiles</td></tr>
                  ) : filteredProfiles.map((c) => (
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
                        <div className="flex flex-wrap items-center gap-2">
                          <button type="button"
                            onClick={() => navigate(`/admin/caregivers/${c._id}/verification`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                          <button type="button"
                            onClick={() => handleApproveProfile(c._id)}
                            disabled={actionLoading === c._id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === c._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />} Approve
                          </button>
                          <button type="button"
                            onClick={() => setRejectModal({ open: true, id: c._id, type: "profile" })}
                            disabled={actionLoading === c._id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
                          >
                            <AlertCircle className="w-3.5 h-3.5" /> Request Changes
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                  {filteredProfiles.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-slate-500 dark:text-slate-400">No pending profiles</div>
                  ) : filteredProfiles.map((c) => (
                    <div key={c._id} className="bg-white dark:bg-slate-800 rounded-lg p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-4">
                      <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate(`/admin/caregivers/${c.userId?._id}`)}>
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-lg">
                          {c.userId?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white hover:underline">{c.userId?.name}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{c.userId?.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <div>
                          <span className="block text-xs text-slate-400">Location</span>
                          {c.location?.city ? `${c.location.city}, ${c.location.state}` : "—"}
                        </div>
                        <div>
                          <span className="block text-xs text-slate-400">Services</span>
                          {c.servicesOffered?.length || 0} services
                        </div>
                        <div className="col-span-2">
                          <span className="block text-xs text-slate-400">Submitted</span>
                          {formatDate(c.updatedAt)}
                        </div>
                      </div>
                      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-2">
                        <button type="button"
                          onClick={() => navigate(`/admin/caregivers/${c._id}/verification`)}
                          className="flex-1 min-w-[100px] inline-flex justify-center items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button type="button"
                          onClick={() => handleApproveProfile(c._id)}
                          disabled={actionLoading === c._id}
                          className="flex-1 min-w-[100px] inline-flex justify-center items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500 text-white text-xs font-medium disabled:opacity-50 transition-colors hover:bg-green-600"
                        >
                          {actionLoading === c._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />} Approve
                        </button>
                        <button type="button"
                          onClick={() => setRejectModal({ open: true, id: c._id, type: "profile" })}
                          disabled={actionLoading === c._id}
                          className="flex-1 min-w-[100px] inline-flex justify-center items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 text-white text-xs font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
                        >
                          <AlertCircle className="w-3.5 h-3.5" /> Changes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
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
          <Textarea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter reason..."
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-end space-x-3">
            <button type="button" className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm transition-colors" onClick={() => { setRejectModal({ open: false, id: null, type: null }); setRejectReason(""); }}>
              Cancel
            </button>
            <button type="button"
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition-colors disabled:opacity-50"
              disabled={!rejectReason.trim() || actionLoading === rejectModal.id}
              onClick={executeReject}
            >
              {actionLoading === rejectModal.id ? (
                <div className="flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</div>
              ) : (
                rejectModal.type === "profile" ? "Send Feedback" : "Reject"
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Delete Caregiver"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p className="text-sm font-medium">
              Are you sure you want to delete this caregiver? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm transition-colors" onClick={() => setDeleteModal({ open: false, id: null })}>
              Cancel
            </button>
            <button type="button" className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition-colors disabled:opacity-50" disabled={actionLoading === deleteModal.id} onClick={confirmDeleteCaregiver}>
              {actionLoading === deleteModal.id ? (
                <div className="flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</div>
              ) : "Delete"}
            </button>
          </div>
        </div>
      </Modal>

    </motion.div>
  );
};

export default Caregivers;
