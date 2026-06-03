import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User, Mail, Phone, Camera, Save, Shield,
  Calendar, BadgeCheck, ArrowRight, Loader2, Key, Users
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { updateProfile } from "../api/user.api";
import http from "../../../lib/axios";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import SetPassword from "../components/SetPassword";
import UserPageLayout from "../../../layout/dashboard/UserPageLayout";
import { resolveAssetUrl } from "../../../utils/blogImage";
import { formatDate } from "../../../utils/helpers";
import { fadeUp, stagger } from "../../../animations/motionVariants";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number").optional().or(z.literal("")),
});

const Profile = () => {
  const { user, fetchUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    reset
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("image", file);
    data.append("folder", "photos");

    try {
      const res = await http.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res?.url || res?.data?.url;
      if (url) {
        await updateProfile({ profileImage: url });
        fetchUser();
        toast.success("Profile image updated successfully!");
      } else {
        toast.error("Upload succeeded but no image URL was returned");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await updateProfile(data);
      toast.success("Profile updated successfully!");
      fetchUser();
      reset(data); // reset to new clean state
    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const userIdShort = user?._id ? `#USR-${user._id.slice(-4).toUpperCase()}` : "";

  return (
    <UserPageLayout title="User Profile" description="Manage your account details and security">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="max-w-4xl space-y-8"
      >
        {/* ─── Profile Header ─── */}
        <motion.div variants={fadeUp} className="relative rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-900 w-full relative">
            <div className="absolute inset-0 bg-[url('/pattern-light.svg')] opacity-20 dark:opacity-10 mix-blend-overlay"></div>
          </div>
          
          <div className="px-6 sm:px-10 pb-8 relative">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 mb-4">
              <div className="relative shrink-0 group">
                <div className="w-28 h-28 rounded-full bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 flex items-center justify-center overflow-hidden shadow-md">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  ) : user?.profileImage ? (
                    <img
                      src={resolveAssetUrl(user.profileImage)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                  )}
                </div>
                <label className="absolute bottom-1 right-1 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition-transform hover:scale-105 cursor-pointer border-2 border-white dark:border-slate-900">
                  <Camera className="w-4 h-4" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>

              <div className="flex-1 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {user?.name || "User"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md font-medium text-slate-700 dark:text-slate-300">
                        {userIdShort}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        Registered: {formatDate(user?.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Account
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Main Content Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                  Personal Information
                </h3>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-4.5 h-4.5 text-slate-400" />
                      </div>
                      <Input
                        type="text"
                        {...register("name")}
                        className={`w-full pl-10 ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="w-4.5 h-4.5 text-slate-400" />
                      </div>
                      <Input
                        type="email"
                        {...register("email")}
                        className={`w-full pl-10 ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="w-4.5 h-4.5 text-slate-400" />
                      </div>
                      <Input
                        type="tel"
                        {...register("phone")}
                        className={`w-full pl-10 ${errors.phone ? "border-red-500 focus:ring-red-500" : ""}`}
                        placeholder="9876543210"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Auth Provider</label>
                    <div className="relative">
                      <div className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 cursor-not-allowed">
                        <BadgeCheck className={`w-5 h-5 ${user?.authProvider === 'google' ? 'text-red-500' : 'text-blue-500'}`} />
                        <span className="capitalize font-medium">{user?.authProvider || "Local"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
                  <Button type="submit" disabled={!isDirty || loading} className="flex items-center gap-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </motion.div>

            {/* Security Card */}
            {user?.authProvider === "google" && (
              <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-amber-500" />
                    Security Settings
                  </h3>
                </div>
                <div className="p-6">
                  <SetPassword />
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            
            {/* Account Info Card */}
            <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  Account Information
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">User ID</p>
                  <p className="font-mono text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-100 dark:border-slate-700">{user?._id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Role</p>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 capitalize border border-blue-200 dark:border-blue-800">
                    {user?.role || "User"}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Member Since</p>
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{formatDate(user?.createdAt)}</p>
                </div>
              </div>
            </motion.div>

            {/* Patient Profiles CTA */}
            <motion.div variants={fadeUp} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Users className="w-32 h-32 text-white" />
              </div>
              <div className="p-6 sm:p-8 relative z-10 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/30">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Manage Family Members</h3>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                  Keep track of medical records, care plans, and emergency contacts for your loved ones receiving care.
                </p>
                <Link
                  to="/user/patients"
                  className="inline-flex items-center justify-center gap-2 w-full bg-white text-blue-700 hover:bg-blue-50 px-4 py-3 rounded-lg font-semibold transition-colors group"
                >
                  View Patient Profiles
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>

      </motion.div>
    </UserPageLayout>
  );
};

export default Profile;