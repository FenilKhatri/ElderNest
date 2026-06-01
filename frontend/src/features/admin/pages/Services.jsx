import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import SearchFilterBar from "../../../components/filters/SearchFilterBar";
import { getAllServices, deleteService } from "../api/admin.api";
import { SERVICE_CATEGORIES } from "../constants/serviceConstants";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [draftFilter, setDraftFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState({ open: false, service: null });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    let result = services;
    
    if (categoryFilter !== "all") {
      result = result.filter(s => s.category === categoryFilter);
    }

    if (draftFilter === "draft") {
      result = result.filter((s) => s.isDraft);
    } else if (draftFilter === "published") {
      result = result.filter((s) => !s.isDraft);
    }
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => 
        s.title?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
      );
    }
    
    setFiltered(result);
  }, [search, categoryFilter, draftFilter, services]);

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

  const getCategoryLabel = (value) => {
    return SERVICE_CATEGORIES.find((c) => c.value === value)?.label || value;
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
        <Button onClick={() => navigate("/admin/services/new")}>
          <Plus size={18} />
          Add Service
        </Button>
      </motion.div>

      <motion.div variants={fadeUp}>
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search services..."
          filters={[
            {
              key: "category",
              label: "Category",
              value: categoryFilter,
              onChange: setCategoryFilter,
              options: [
                { value: "all", label: "All categories" },
                ...SERVICE_CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
              ],
            },
            {
              key: "draft",
              label: "Status",
              value: draftFilter,
              onChange: setDraftFilter,
              options: [
                { value: "all", label: "All" },
                { value: "published", label: "Published" },
                { value: "draft", label: "Drafts" },
              ],
            },
          ]}
          onClear={() => {
            setSearch("");
            setCategoryFilter("all");
            setDraftFilter("all");
          }}
        />
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
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {service.image ? (
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-slate-400">No Img</span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {service.title}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {service.isDraft && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                        Draft
                      </span>
                    )}
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                      {getCategoryLabel(service.category)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                  {service.description}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/services/${service._id}`)}
                    className="flex-1 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/services/${service._id}/edit`)}
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
