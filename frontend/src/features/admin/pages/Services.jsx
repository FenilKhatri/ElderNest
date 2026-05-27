import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { 
  getAllServices, 
  createService, 
  updateService, 
  deleteService 
} from "../api/admin.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

const Services = () => {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Modals
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, service: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, service: null });
  const [viewModal, setViewModal] = useState({ open: false, service: null });
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: ""
  });
  const [formLoading, setFormLoading] = useState(false);

  const categories = [
    { value: "personal-care", label: "Personal Care" },
    { value: "medical-care", label: "Medical Care" },
    { value: "companionship", label: "Companionship" },
    { value: "household-help", label: "Household Help" },
    { value: "specialized-care", label: "Specialized Care" },
    { value: "emergency-care", label: "Emergency Care" },
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    let result = services;
    
    if (categoryFilter !== "all") {
      result = result.filter(s => s.category === categoryFilter);
    }
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => 
        s.title?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
      );
    }
    
    setFiltered(result);
  }, [search, categoryFilter, services]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await getAllServices();
      const data = res?.data?.services || [];
      setServices(data);
      setFiltered(data);
    } catch (error) {
      toast.error(error?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setFormLoading(true);
      await createService(formData);
      toast.success("Service created successfully");
      setCreateModal(false);
      setFormData({ title: "", category: "", description: "" });
      fetchServices();
    } catch (error) {
      toast.error(error?.message || "Failed to create service");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setFormLoading(true);
      await updateService(editModal.service._id, formData);
      toast.success("Service updated successfully");
      setEditModal({ open: false, service: null });
      setFormData({ title: "", category: "", description: "" });
      fetchServices();
    } catch (error) {
      toast.error(error?.message || "Failed to update service");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setFormLoading(true);
      await deleteService(deleteModal.service._id);
      toast.success("Service deleted successfully");
      setDeleteModal({ open: false, service: null });
      fetchServices();
    } catch (error) {
      toast.error(error?.message || "Failed to delete service");
    } finally {
      setFormLoading(false);
    }
  };

  const openEditModal = (service) => {
    setFormData({
      title: service.title,
      category: service.category,
      description: service.description
    });
    setEditModal({ open: true, service });
  };

  const getCategoryLabel = (value) => {
    return categories.find(c => c.value === value)?.label || value;
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Service Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage platform services and categories
          </p>
        </div>
        <Button onClick={() => setCreateModal(true)}>
          <Plus size={18} />
          Add Service
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </motion.div>

      {/* Services Grid */}
      <motion.div variants={fadeUp}>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 animate-pulse"
              >
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4" />
                <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              {search || categoryFilter !== "all" 
                ? "No services match your filters" 
                : "No services found. Create your first service!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service) => (
              <div
                key={service._id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {service.title}
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    {getCategoryLabel(service.category)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                  {service.description}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewModal({ open: true, service })}
                    className="flex-1 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => openEditModal(service)}
                    className="flex-1 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteModal({ open: true, service })}
                    className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Summary */}
      {!loading && filtered.length > 0 && (
        <motion.p
          variants={fadeUp}
          className="text-sm text-slate-500 dark:text-slate-400"
        >
          Showing {filtered.length} of {services.length} services
        </motion.p>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={createModal}
        onClose={() => {
          setCreateModal(false);
          setFormData({ title: "", category: "", description: "" });
        }}
        title="Create New Service"
        size="md"
      >
        <form onSubmit={handleCreate} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Service Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter service title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter service description"
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCreateModal(false);
                setFormData({ title: "", category: "", description: "" });
              }}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? "Creating..." : "Create Service"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => {
          setEditModal({ open: false, service: null });
          setFormData({ title: "", category: "", description: "" });
        }}
        title="Edit Service"
        size="md"
      >
        <form onSubmit={handleEdit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Service Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditModal({ open: false, service: null });
                setFormData({ title: "", category: "", description: "" });
              }}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? "Updating..." : "Update Service"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, service: null })}
        title="Service Details"
        size="md"
      >
        {viewModal.service && (
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {viewModal.service.title}
              </h3>
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                {getCategoryLabel(viewModal.service.category)}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                {viewModal.service.description}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, service: null })}
        title="Delete Service"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                Delete {deleteModal.service?.title}?
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false, service: null })}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={formLoading}
            >
              {formLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Services;
