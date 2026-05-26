import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { getAllServices, createService, updateService, deleteService } from "../../service/api/service.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { formatCurrency } from "../../../utils/helpers";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";

const CATEGORIES = [
  { value: "personal-care",    label: "Personal Care" },
  { value: "medical-care",     label: "Medical Care" },
  { value: "companionship",    label: "Companionship" },
  { value: "household-help",   label: "Household Help" },
  { value: "specialized-care", label: "Specialized Care" },
  { value: "emergency-care",   label: "Emergency Care" },
];

const emptyForm = { name: "", description: "", category: "", basePrice: "", duration: "", features: "" };

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: "create", data: null });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchServices = () => {
    setLoading(true);
    getAllServices()
      .then((res) => setServices(res?.data?.services || []))
      .catch(() => toast.error("Failed to load services"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchServices(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setModal({ open: true, mode: "create", data: null });
  };

  const openEdit = (svc) => {
    setForm({
      name: svc.name,
      description: svc.description,
      category: svc.category,
      basePrice: svc.basePrice,
      duration: svc.duration,
      features: svc.features?.join(", ") || "",
    });
    setModal({ open: true, mode: "edit", data: svc });
  };

  const handleSave = async () => {
    if (!form.name || !form.description || !form.category || !form.basePrice || !form.duration) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        ...form,
        basePrice: Number(form.basePrice),
        duration: Number(form.duration),
        features: form.features ? form.features.split(",").map(f => f.trim()).filter(Boolean) : [],
      };
      if (modal.mode === "create") {
        await createService(payload);
        toast.success("Service created!");
      } else {
        await updateService(modal.data._id, payload);
        toast.success("Service updated!");
      }
      setModal({ open: false, mode: "create", data: null });
      fetchServices();
    } catch (err) {
      toast.error(err.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (svc) => {
    try {
      await updateService(svc._id, { isActive: !svc.isActive });
      toast.success(`Service ${svc.isActive ? "deactivated" : "activated"}`);
      fetchServices();
    } catch (err) {
      toast.error("Failed to update service");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteService(deleteId);
      toast.success("Service deleted");
      setDeleteId(null);
      fetchServices();
    } catch (err) {
      toast.error(err.message || "Failed to delete service");
    }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Service Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Create and manage care services available on the platform</p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Service
        </Button>
      </motion.div>

      <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="animate-pulse h-12 bg-slate-200 dark:bg-slate-700 rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {["Service", "Category", "Base Price", "Duration", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {services.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">No services yet. Create your first service.</td></tr>
                ) : services.map((svc) => (
                  <tr key={svc._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{svc.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xs truncate">{svc.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                        {CATEGORIES.find(c => c.value === svc.category)?.label || svc.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white font-medium">{formatCurrency(svc.basePrice)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{svc.duration}h</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(svc)} className="flex items-center gap-1.5 text-sm">
                        {svc.isActive ? (
                          <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-600 dark:text-green-400 text-xs font-medium">Active</span></>
                        ) : (
                          <><ToggleLeft className="w-5 h-5 text-slate-400" /><span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Inactive</span></>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEdit(svc)}
                          className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(svc._id)}
                          className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, mode: "create", data: null })}
        title={modal.mode === "create" ? "Add New Service" : "Edit Service"}
        size="md"
      >
        <div className="p-6 space-y-4">
          {[
            { key: "name", label: "Service Name", type: "text", placeholder: "e.g. Personal Care" },
            { key: "description", label: "Description", type: "textarea", placeholder: "Describe the service..." },
            { key: "basePrice", label: "Base Price (₹ per hour)", type: "number", placeholder: "e.g. 300" },
            { key: "duration", label: "Duration (hours)", type: "number", placeholder: "e.g. 4" },
            { key: "features", label: "Features (comma-separated)", type: "text", placeholder: "e.g. Bathing, Dressing, Mobility" },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {label} {key !== "features" && <span className="text-red-500">*</span>}
              </label>
              {type === "textarea" ? (
                <textarea
                  rows={3}
                  value={form[key]}
                  onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              ) : (
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          ))}
          <Select
            label="Category"
            name="category"
            value={form.category}
            onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
            options={CATEGORIES}
            required
          />
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setModal({ open: false, mode: "create", data: null })}>
              Cancel
            </Button>
            <Button size="sm" disabled={saving} onClick={handleSave}>
              {saving ? "Saving..." : modal.mode === "create" ? "Create Service" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Service"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Are you sure you want to delete this service? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Services;
