import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Eye, User as UserIcon, Trash2, AlertTriangle } from "lucide-react";
import { getAllUsers, deleteUser } from "../api/admin.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import { formatDate } from "../../../utils/helpers";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import SearchFilterBar from "../../../components/filters/SearchFilterBar";
import GridLayout, { GridSkeleton } from "../../../components/layout/GridLayout";
import ListLayout, { ListSkeleton } from "../../../components/layout/ListLayout";
import EntityCard from "../../../components/cards/EntityCard";
import LoadMore from "../../../components/common/LoadMore";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState({ open: false, userId: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [layout, setLayout] = useState("grid");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, hasMore: false });

  const fetchUsers = async (pageToFetch = 1, append = false) => {
    try {
      if (append) setIsLoadingMore(true);
      else setLoading(true);

      const filters = { page: pageToFetch, limit: 12 };
      if (search) filters.search = search;
      if (providerFilter !== "all") filters.provider = providerFilter;

      const res = await getAllUsers("user", filters);
      const data = res?.data?.users || [];
      const pag = res?.data?.pagination || { page: 1, hasMore: false };

      if (append) {
        setUsers(prev => [...prev, ...data]);
      } else {
        setUsers(data);
      }
      setPagination(pag);
    } catch (error) {
      toast.error(error?.message || "Failed to load users");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, false);
  }, [search, providerFilter]);

  const handleLoadMore = () => {
    if (!isLoadingMore && pagination.hasMore) {
      fetchUsers(pagination.page + 1, true);
    }
  };

  const filteredUsers = users; // filtered from backend

  const handleViewUser = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleDeleteClick = (userId) => {
    setDeleteModal({ open: true, userId });
  };

  const confirmDeleteUser = async () => {
    if (!deleteModal.userId) return;
    setActionLoading(true);
    try {
      await deleteUser(deleteModal.userId);
      toast.success("User deleted successfully");
      setDeleteModal({ open: false, userId: null });
      fetchUsers();
    } catch (error) {
      toast.error(error?.message || "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
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
            User Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            View and manage all registered users
          </p>
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
            onClick={() => setLayout("list")}
            className={`p-2 rounded-md transition-all ${layout === "list" ? "bg-blue-600 text-white shadow-md" : "bg-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
            title="List View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
          </button>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name, email, or phone..."
          filters={[
            {
              key: "provider",
              label: "Sign-in method",
              value: providerFilter,
              onChange: setProviderFilter,
              options: [
                { value: "all", label: "All methods" },
                { value: "local", label: "Email" },
                { value: "google", label: "Google" },
              ],
            },
          ]}
          onClear={() => {
            setSearch("");
            setProviderFilter("all");
          }}
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        {loading ? (
          layout === "grid" ? <GridSkeleton count={6} /> : <ListSkeleton count={4} />
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <UserIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400">
              {search || providerFilter !== "all" ? "No users match your filters" : "No users found"}
            </p>
          </div>
        ) : (
          layout === "grid" ? (
            <GridLayout>
              {filteredUsers.map((user) => (
              <EntityCard
                key={user._id}
                onClick={() => handleViewUser(user._id)}
                footer={
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewUser(user._id);
                      }}
                      className="p-2 rounded-lg bg-blue-500 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(user._id);
                      }}
                      className="p-2 rounded-lg bg-red-500 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                }
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.authProvider === "google" ? "Google" : "Email"}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{user.email}</p>
                <p className="text-sm text-slate-500 mt-1">{user.phone || "No phone"}</p>
                <p className="text-xs text-slate-400 mt-2">Joined {formatDate(user.createdAt)}</p>
              </EntityCard>
            ))}
            </GridLayout>
          ) : (
            <ListLayout>
              {filteredUsers.map((user) => (
                <EntityCard
                  key={user._id}
                  onClick={() => handleViewUser(user._id)}
                  className="flex-row items-center !min-h-0"
                >
                  <div className="flex flex-col sm:flex-row items-center w-full justify-between"><div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{user.email} • {user.authProvider === "google" ? "Google" : "Email"}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1">
                      <p className="text-sm text-slate-600 dark:text-slate-400">{user.phone || "No phone"}</p>
                      <p className="text-xs text-slate-400">Joined {formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewUser(user._id);
                      }}
                      className="p-2 rounded-lg bg-blue-500 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(user._id);
                      }}
                      className="p-2 rounded-lg bg-red-500 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div></div></EntityCard>
              ))}
            </ListLayout>
          )
        )}

        {/* Load More */}
        {!loading && pagination.hasMore && (
          <div className="mt-8 flex justify-center w-full">
            <LoadMore 
              hasMore={pagination.hasMore}
              onLoadMore={handleLoadMore}
              isLoading={isLoadingMore}
            />
          </div>
        )}
      </motion.div>

      {/* Summary */}
      {!loading && filteredUsers.length > 0 && (
        <motion.p
          variants={fadeUp}
          className="text-sm text-slate-500 dark:text-slate-400"
        >
          Showing {filteredUsers.length} {pagination.total ? `of ${pagination.total}` : ''} users
        </motion.p>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, userId: null })}
        title="Delete User"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-sm font-medium">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModal({ open: false, userId: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={actionLoading}
              onClick={confirmDeleteUser}
            >
              {actionLoading ? "Deleting..." : "Delete User"}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Users;
