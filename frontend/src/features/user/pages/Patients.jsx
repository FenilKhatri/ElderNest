import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  Plus, Pencil, Trash2, User, Search, Filter,
  Activity, Phone, ShieldAlert, FileText, ArrowRight, Eye
} from "lucide-react";
import UserPageLayout from "../../../layout/dashboard/UserPageLayout";
import { getMyPatients, deletePatient } from "../../patient/api/patient.api";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import EmptyState from "../../../components/ui/EmptyState";
import CardSkeleton from "../../../components/feedback/skeleton/CardSkeleton";
import { fadeUp, stagger } from "../../../animations/motionVariants";

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    getMyPatients()
      .then((res) => setPatients(res?.data?.patients || []))
      .catch(() => toast.error("Failed to load patients"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    try {
      await deletePatient(deleteTarget);
      toast.success("Patient profile removed");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message || "Failed to remove patient");
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.relationship?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <UserPageLayout
      title="Patient Profiles"
      description="Manage medical records, care plans, and family members receiving care."
      action={
        <Button onClick={() => navigate("/user/patients/new")} className="flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Add Patient
        </Button>
      }
    >
      {/* ─── Toolbar ─── */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
          />
        </div>
        <div className="w-full sm:w-auto flex items-center gap-3">
          <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2 bg-white dark:bg-slate-800">
            <Filter className="w-4 h-4 text-slate-500" /> Filter
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : patients.length === 0 ? (
        <EmptyState
          icon={User}
          title="No Patient Profiles Found"
          description="Create a patient profile to manage medical details and quickly book care services."
          action={
            <Button onClick={() => navigate("/user/patients/new")} className="mt-2">
              Add First Patient
            </Button>
          }
        />
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No matches found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search query.</p>
        </div>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredPatients.map((p) => (
            <motion.div
              variants={fadeUp}
              key={p._id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full"
            >
              {/* Header */}
              <div className="p-5 flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/30">
                  <span className="text-lg font-bold">{p.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">
                      {p.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="capitalize">{p.gender}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span>{p.age || "N/A"} yrs</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span className="capitalize font-medium text-slate-600 dark:text-slate-300">{p.relationship}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="px-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active Care Profile
                </div>
              </div>

              {/* Details */}
              <div className="p-5 flex-1 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wide">Medical Conditions</p>
                    <p className="text-slate-900 dark:text-white font-medium">
                      {p.medicalConditions?.length > 0 ? `${p.medicalConditions.length} Recorded` : "None Recorded"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wide">Emergency Contact</p>
                    <p className="text-slate-900 dark:text-white font-medium truncate">
                      {p.emergencyContact?.contactName || "Not Set"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/user/patients/${p._id}`)}
                  className="flex-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Eye className="w-4 h-4 mr-2" /> View
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="px-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:text-blue-600"
                    onClick={() => navigate(`/user/patients/edit?edit=${p._id}`)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="px-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-900 dark:hover:bg-red-900/20"
                    onClick={() => setDeleteTarget(p._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Patient Profile"
        message="Are you sure you want to delete this patient profile? This action cannot be undone, but past medical records may be retained for compliance."
        confirmLabel="Remove Profile"
      />
    </UserPageLayout>
  );
};

export default Patients;
