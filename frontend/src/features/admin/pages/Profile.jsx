import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { User, Mail, Phone, Camera, Save } from "lucide-react";
import http from "../../../lib/axios";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import Button from "../../../components/ui/Button";
import { resolveAssetUrl } from "../../../utils/blogImage";
import { useAuth } from "../../../context/AuthContext";
import Input from "../../../components/ui/Input";

const Profile = () => {
  const { fetchUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await http.get("/auth/me");
        const user = res?.data?.user;
        if (user) {
          setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            profileImage: user.profileImage || "",
          });
        } else {
          toast.error("Could not load profile data");
        }
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        setFormData((prev) => ({ ...prev, profileImage: url }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Upload succeeded but no image URL was returned");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) {
        toast.warning("Please wait for image upload to complete");
        return;
    }
    setSaving(true);
    try {
      await http.patch("/users/profile", {
        name: formData.name,
        phone: formData.phone,
        profileImage: formData.profileImage,
      });
      if (fetchUser) await fetchUser();
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="w-full max-w-5xl mx-auto space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account details and preferences</p>
      </motion.div>

      <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-md flex items-center justify-center overflow-hidden">
                {uploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                ) : formData.profileImage ? (
                  <img
                    src={resolveAssetUrl(formData.profileImage)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-slate-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors cursor-pointer">
                <Camera className="w-4 h-4" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <Input icon={User} 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  
                 />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <Input icon={Mail} 
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  
                 />
              <p className="text-xs text-slate-500 mt-1">Email cannot be changed.</p>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
              <Input icon={Phone} 
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  
                 />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="submit" disabled={saving || uploading} className={`flex items-center gap-2 ${uploading ? 'cursor-wait' : ''}`}>
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Profile;