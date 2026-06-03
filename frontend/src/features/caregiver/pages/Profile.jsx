import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { MapPin, Star, User, Clock, CheckCircle, Edit, Shield, Heart, Camera } from "lucide-react";
import { getMyProfile, updateProfile } from "../api/caregiver.api";
import http from "../../../lib/axios";
import { fadeUp, stagger } from "../../../animations/motionVariants";
import { formatCurrency } from "../../../utils/helpers";
import Button from "../../../components/ui/Button";
import { useAuth } from "../../../context/AuthContext";
import SetPassword from "../../user/components/SetPassword";

const Profile = () => {
  const { user } = useAuth();
  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getMyProfile();
      setCaregiver(res.data?.caregiver);
    } catch (error) {
      toast.error("Failed to load your profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
        toast.success("Profile picture updated successfully!");
        fetchProfile();
      } else {
        toast.error("Upload succeeded but no image URL was returned");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!caregiver) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <User className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Profile Not Found</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          You haven't set up your caregiver profile yet.
        </p>
        <Link to="/caregiver/complete-profile">
          <Button>Complete Profile Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Public Profile</h2>
        <Link to="/caregiver/complete-profile">
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="w-4 h-4" /> Edit Profile
          </Button>
        </Link>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Summary */}
        <motion.div variants={fadeUp} className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center overflow-hidden shadow-inner border-4 border-white dark:border-slate-700">
                {uploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                ) : caregiver.profileImage || caregiver.userId?.profileImage ? (
                  <img src={caregiver.profileImage || caregiver.userId?.profileImage} alt={caregiver.userId?.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors cursor-pointer ring-2 ring-white dark:ring-slate-800">
                <Camera className="w-4 h-4" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {caregiver.userId?.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center text-sm mb-4">
              <MapPin className="w-4 h-4 mr-1" />
              {caregiver.location?.city}, {caregiver.location?.state}
            </p>
            
            <div className="flex items-center justify-center gap-4 py-4 border-y border-slate-100 dark:border-slate-700">
              <div className="text-center">
                <div className="flex items-center justify-center text-slate-900 dark:text-white font-bold text-lg">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                  {caregiver.rating || "New"}
                </div>
                <div className="text-xs text-slate-500">Rating</div>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
              <div className="text-center">
                <div className="text-slate-900 dark:text-white font-bold text-lg">
                  {caregiver.experienceYears}
                </div>
                <div className="text-xs text-slate-500">Years Exp.</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Information</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                <div>
                  <span className="block text-sm font-medium text-slate-900 dark:text-white">Status</span>
                  <span className="block text-xs text-slate-500 capitalize">{caregiver.status}</span>
                </div>
              </li>
              {/* Availability removed */}
              {caregiver.languages && caregiver.languages.length > 0 && (
                <li className="flex items-start">
                  <User className="w-5 h-5 text-purple-500 mr-3 shrink-0" />
                  <div>
                    <span className="block text-sm font-medium text-slate-900 dark:text-white">Languages</span>
                    <span className="block text-xs text-slate-500">{caregiver.languages.join(", ")}</span>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </motion.div>

        {/* Right Column - Details */}
        <motion.div variants={fadeUp} className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Heart className="w-5 h-5 text-rose-500 mr-2" />
              Bio
            </h2>
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
              <p className="whitespace-pre-line">{caregiver.bio || "No bio provided."}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 text-blue-500 mr-2" />
              Services Offered
            </h2>
            {caregiver.servicesOffered && caregiver.servicesOffered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {caregiver.servicesOffered.map(service => (
                  <div key={service._id || service} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <h4 className="font-semibold text-slate-900 dark:text-white">{service.title || service.name || service}</h4>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No specific services listed.</p>
            )}
          </div>

          {caregiver.pricing && (caregiver.pricing.hourlyRate || caregiver.pricing.dailyRate || caregiver.pricing.monthlyRate) && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-amber-500">
                Pricing
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {caregiver.pricing.hourlyRate && (
                  <div className="p-4 text-center rounded-xl bg-slate-50 dark:bg-slate-900">
                    <div className="text-sm text-slate-500 mb-1">Hourly Rate</div>
                    <div className="font-bold text-lg text-slate-900 dark:text-white">{formatCurrency(caregiver.pricing.hourlyRate)}/hr</div>
                  </div>
                )}
                {caregiver.pricing.dailyRate && (
                  <div className="p-4 text-center rounded-xl bg-slate-50 dark:bg-slate-900">
                    <div className="text-sm text-slate-500 mb-1">Daily Rate</div>
                    <div className="font-bold text-lg text-slate-900 dark:text-white">{formatCurrency(caregiver.pricing.dailyRate)}/day</div>
                  </div>
                )}
                {caregiver.pricing.monthlyRate && (
                  <div className="p-4 text-center rounded-xl bg-slate-50 dark:bg-slate-900">
                    <div className="text-sm text-slate-500 mb-1">Monthly Rate</div>
                    <div className="font-bold text-lg text-slate-900 dark:text-white">{formatCurrency(caregiver.pricing.monthlyRate)}/mo</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {user?.authProvider === 'google' && (
        <SetPassword />
      )}
    </div>
  );
};

export default Profile;