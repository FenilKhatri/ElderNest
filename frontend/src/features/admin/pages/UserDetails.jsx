import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, Calendar, MapPin, User } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAllUsers } from "../api/admin.api";
import Button from "../../../components/ui/Button";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      // Fetch all users and find the specific user by ID
      const response = await getAllUsers();
      const foundUser = response.data.users.find(u => u._id === id);
      
      if (!foundUser) {
        toast.error("User not found");
        navigate("/admin/users");
        return;
      }
      
      setUser(foundUser);
    } catch (error) {
      toast.error("Failed to fetch user details");
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">User not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate("/admin/users")}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          User Details
        </h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600" />

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-12">
            <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-900 flex items-center justify-center">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={40} className="text-slate-400" />
              )}
            </div>
            <div className="pb-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {user.name}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white capitalize">
                {user.status || "Active"}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Role</p>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 capitalize">{user.role}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Member Since</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Contact Information</h3>
              
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                  <p className="text-slate-900 dark:text-white">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Phone</p>
                  <p className="text-slate-900 dark:text-white">{user.phone || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Registration Date</p>
                  <p className="text-slate-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Account Details</h3>
              
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Auth Provider</p>
                <p className="text-slate-900 dark:text-white capitalize">{user.authProvider || "local"}</p>
              </div>

              {user.role === "caregiver" && (
                <>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Approval Status</p>
                    <p className={`font-medium capitalize ${
                      user.isApproved 
                        ? "text-green-600 dark:text-green-400" 
                        : "text-yellow-600 dark:text-yellow-400"
                    }`}>
                      {user.isApproved ? "Approved" : "Pending Approval"}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Account Status</p>
                    <p className={`font-medium capitalize ${
                      user.status === "approved" 
                        ? "text-green-600 dark:text-green-400" 
                        : user.status === "rejected"
                        ? "text-red-600 dark:text-red-400"
                        : "text-yellow-600 dark:text-yellow-400"
                    }`}>
                      {user.status}
                    </p>
                  </div>
                </>
              )}

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Last Updated</p>
                <p className="text-slate-900 dark:text-white">
                  {new Date(user.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserDetails;
