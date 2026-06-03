import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Edit2, Trash2, Heart, AlertTriangle } from "lucide-react";
import http from "../../../lib/axios";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Modal from "../../../components/ui/Modal";
import SearchFilterBar from "../../../components/filters/SearchFilterBar";
import GridLayout, { GridSkeleton } from "../../../components/layout/GridLayout";
import ListLayout, { ListSkeleton } from "../../../components/layout/ListLayout";
import EntityCard from "../../../components/cards/EntityCard";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState("grid");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [deleteModal, setDeleteModal] = useState({ open: false, patientId: null });
  const [actionLoading, setActionLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "male",
    medicalRequirements: "",
    emergencyContact: {
      name: "",
      phone: "",
      relation: "",
    },
  });

  const fetchPatients = () => {
    setLoading(true);
    http
      .get("/admin/patients")
      .then((res) => setPatients(res?.data?.patients || []))
      .catch(() => toast.error("Failed to load patients"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const q = search.toLowerCase();
    return patients.filter((p) => {
      if (!q) return true;
      return (
        p.name?.toLowerCase().includes(q) ||
        p.userId?.name?.toLowerCase().includes(q) ||
        p.userId?.email?.toLowerCase().includes(q)
      );
    });
  }, [search, patients]);

  const handleEdit = (patient) => {
    setEditId(patient._id);
    setForm({
      name: patient.name,
      age: patient.age,
      gender: patient.gender || "male",
      medicalRequirements: patient.medicalRequirements || "",
      emergencyContact: patient.emergencyContact || { name: "", phone: "", relation: "" },
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ open: true, patientId: id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.patientId) return;
    setActionLoading(true);
    try {
      await http.delete(`/admin/patients/${deleteModal.patientId}`);
      toast.success("Patient removed successfully");
      setDeleteModal({ open: false, patientId: null });
      fetchPatients();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete patient");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editId) {
        await http.patch(`/admin/patients/${editId}`, form);
        toast.success("Patient updated successfully");
      }
      setIsModalOpen(false);
      fetchPatients();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setFormLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setForm({
      name: "",
      age: "",
      gender: "male",
      medicalRequirements: "",
      emergencyContact: { name: "", phone: "", relation: "" },
    });
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Patients</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">All patient profiles across users</p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start">
          <button
            onClick={() => setLayout("grid")}
            className={`p-2 rounded-md transition-all ${layout === "grid" ? "bg-blue-600 text-white shadow-md" : "bg-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
            title="Grid View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
          </button>
          <button
            onClick={() => setLayout("table")}
            className={`p-2 rounded-md transition-all ${layout === "table" ? "bg-blue-600 text-white shadow-md" : "bg-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
            title="Table View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
          </button>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <motion.div variants={fadeUp}>
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search patients by name, user name or email..."
          onClear={() => setSearch("")}
        />
      </motion.div>

      {/* Grid/List Layout for Patients */}
      <motion.div variants={fadeUp}>
        {loading ? (
          layout === "grid" ? <GridSkeleton count={6} /> : <ListSkeleton count={4} />
        ) : filteredPatients.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <Heart className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400">
              {search ? "No patients match your search" : "No patient profiles found"}
            </p>
          </div>
        ) : (
          layout === "grid" ? (
            <GridLayout>
              {filteredPatients.map((p) => (
              <EntityCard
                key={p._id}
                footer={
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => handleEdit(p)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Edit Patient"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(p._id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete Patient"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                }
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-semibold shadow-sm shrink-0">
                    {p.name?.charAt(0).toUpperCase() || "P"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.age} years • {p.gender}</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <p className="truncate">
                    <span className="font-medium text-slate-700 dark:text-slate-300">User:</span> {p.userId?.name} <span className="text-xs opacity-75">({p.userId?.email})</span>
                  </p>
                  {p.medicalRequirements && (
                    <p className="line-clamp-2" title={p.medicalRequirements}>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Medical:</span> {p.medicalRequirements}
                    </p>
                  )}
                  {p.emergencyContact?.name && (
                    <p className="truncate">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Emergency:</span> {p.emergencyContact.name} ({p.emergencyContact.phone})
                    </p>
                  )}
                </div>
              </EntityCard>
            ))}
            </GridLayout>
          ) : (
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {["Patient", "Age / Gender", "Parent User", "Emergency Contact", "Medical", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredPatients.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No patients found</td></tr>
                  ) : filteredPatients.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 font-semibold text-sm">
                            {p.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white text-sm">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {p.age} yrs, <span className="capitalize">{p.gender}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{p.userId?.name}</p>
                        <p className="text-xs text-slate-500">{p.userId?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {p.emergencyContact?.name ? (
                          <>
                            <p className="font-medium">{p.emergencyContact.name}</p>
                            <p className="text-xs">{p.emergencyContact.phone}</p>
                          </>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate" title={p.medicalRequirements}>
                        {p.medicalRequirements || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleEdit(p)}
                            className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100"
                            title="Edit Patient"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(p._id)}
                            className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100"
                            title="Delete Patient"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </motion.div>

      {/* Summary */}
      {!loading && filteredPatients.length > 0 && (
        <motion.p
          variants={fadeUp}
          className="text-sm text-slate-500 dark:text-slate-400"
        >
          Showing {filteredPatients.length} of {patients.length} patients
        </motion.p>
      )}

      {/* Edit/Add Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editId ? "Edit Patient" : "Add Patient"}>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Age *"
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              required
            />
          </div>
          
          <Textarea
            label="Medical Requirements"
            value={form.medicalRequirements}
            onChange={(e) => setForm({ ...form, medicalRequirements: e.target.value })}
            rows={2}
          />
          
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
            <h3 className="text-sm font-semibold mb-3">Emergency Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Contact Name"
                value={form.emergencyContact.name}
                onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, name: e.target.value } })}
              />
              <Input
                label="Contact Phone"
                value={form.emergencyContact.phone}
                onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, phone: e.target.value } })}
              />
              <Input
                label="Relation"
                value={form.emergencyContact.relation}
                onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, relation: e.target.value } })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={formLoading}>
              {editId ? "Update Patient" : "Create Patient"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, patientId: null })}
        title="Delete Patient"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-sm font-medium">
              Are you sure you want to delete this patient profile? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModal({ open: false, patientId: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={actionLoading}
              onClick={confirmDelete}
            >
              {actionLoading ? "Deleting..." : "Delete Patient"}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Patients;
