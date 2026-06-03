import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Edit, Trash2, Plus, Filter,
  Grid, List, Eye, Clock, Calendar, CheckCircle
} from "lucide-react";
import SearchFilterBar from "../../../components/filters/SearchFilterBar";
import { getAllBlogs, deleteBlog } from "../api/admin.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";

const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await getAllBlogs();
      setBlogs(res.data?.blogs || []);
    } catch (err) {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    let result = [...blogs];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) => b.title?.toLowerCase().includes(q) || b.shortDescription?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      const isPublished = statusFilter === "active";
      result = result.filter((b) => (b.status === "published") === isPublished);
    }

    if (categoryFilter !== "all") {
      result = result.filter((b) => b.category === categoryFilter);
    }

    setFilteredBlogs(result);
  }, [blogs, search, statusFilter, categoryFilter]);

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      setDeleting(true);
      await deleteBlog(deleteModal.id);
      toast.success("Blog deleted successfully");
      setDeleteModal({ open: false, id: null });
      fetchBlogs();
    } catch (err) {
      toast.error("Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 max-w-site-wide mx-auto pb-12">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Blogs & Articles</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage platform content and publications</p>
        </div>
        <Button onClick={() => navigate("/admin/blogs/create")} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create New Post
        </Button>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <SearchFilterBar
          className="flex-1 w-full"
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search posts..."
          filters={[
            {
              key: "status",
              label: "Status",
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: "all", label: "All status" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ],
            },
            {
              key: "category",
              label: "Category",
              value: categoryFilter,
              onChange: setCategoryFilter,
              options: [
                { value: "all", label: "All categories" },
                { value: "General", label: "General" },
                { value: "Eldercare", label: "Eldercare" },
                { value: "Health", label: "Health" },
                { value: "Tips", label: "Tips & Advice" },
                { value: "News", label: "News" },
              ],
            },
          ]}
          onClear={() => {
            setSearch("");
            setStatusFilter("all");
            setCategoryFilter("all");
          }}
        />

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shrink-0">
          <button 
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white shadow-md" : "bg-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-blue-600 text-white shadow-md" : "bg-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div variants={fadeUp}>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-xl h-72 border border-slate-200 dark:border-slate-800 p-6 animate-pulse" />
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No posts found</h3>
            <p className="text-slate-500 dark:text-slate-400">
              {search || statusFilter !== "all" || categoryFilter !== "all" 
                ? "Try adjusting your filters or search term." 
                : "Get started by creating your first blog post."}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredBlogs.map((blog) => (
                <motion.div 
                  key={blog._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {blog.image ? (
                      <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-semibold rounded-md shadow-sm">
                        {blog.category || "General"}
                      </span>
                      {blog.status !== "published" && (
                        <span className="px-2.5 py-1 bg-slate-500/90 text-white backdrop-blur-sm text-xs font-semibold rounded-md shadow-sm">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 flex-1">
                      {blog.excerpt || blog.content?.replace(/<[^>]+>/g, '').substring(0, 100) + "..."}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                        {blog.readTime && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {blog.readTime}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          onClick={() => navigate(`/admin/blogs/edit/${blog._id}`)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          onClick={() => setDeleteModal({ open: true, id: blog._id })}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Post</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredBlogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                            {blog.image && (
                              <img src={blog.image} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white line-clamp-1">{blog.title}</p>
                            <p className="text-xs text-slate-500 mt-1">/{blog.slug || blog._id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {blog.status !== "published" ? (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400 text-xs font-medium rounded-full">Draft</span>
                        ) : (
                          <span className="px-2.5 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">Published</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {blog.category || "General"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            onClick={() => navigate(`/admin/blogs/edit/${blog._id}`)}
                            className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            onClick={() => setDeleteModal({ open: true, id: blog._id })}
                            className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
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
          </div>
        )}
      </motion.div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Delete Blog Post"
        size="sm"
      >
        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Are you sure you want to delete this blog post? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteModal({ open: false, id: null })} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Blogs;
