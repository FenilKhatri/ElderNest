import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Save, AlertTriangle, Globe, Lock, Bell } from "lucide-react";
import { getSettings, updateSettings } from "../api/admin.api";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import Button from "../../../components/ui/Button";
import Checkbox from "../../../components/ui/Checkbox";
import Input from "../../../components/ui/Input";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowNewRegistrations: true,
    contactEmail: "",
    supportPhone: "",
    siteName: "ElderNest",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSettings();
        if (res.data?.settings && Object.keys(res.data.settings).length > 0) {
          setSettings(prev => ({ ...prev, ...res.data.settings }));
        }
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(settings);
      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading settings...</div>;
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="w-full max-w-6xl mx-auto space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Configure global platform behavior and preferences</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* General Settings */}
        <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" /> General Configuration
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Site Name</label>
                <Input
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Support Email</label>
                <Input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Support Phone</label>
                <Input
                  type="text"
                  name="supportPhone"
                  value={settings.supportPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security & Access */}
        <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-500" /> Security & Access
            </h2>
          </div>
          <div className="p-6 space-y-6">
            
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-white">Maintenance Mode</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Enable this to temporarily disable the public site. Only admins will be able to log in.
                </p>
              </div>
              <div className="flex items-center">
                <Checkbox
                  checked={settings.maintenanceMode} 
                  onChange={handleChange}
                  name="maintenanceMode"
                />
              </div>
            </div>

            {settings.maintenanceMode && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-400">
                  Maintenance mode is active. Users will see a "Down for maintenance" screen.
                </p>
              </div>
            )}

            <div className="flex items-start justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-white">Allow New Registrations</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  When disabled, new users and caregivers cannot sign up.
                </p>
              </div>
              <div className="flex items-center">
                <Checkbox
                  checked={settings.allowNewRegistrations} 
                  onChange={handleChange}
                  name="allowNewRegistrations"
                />
              </div>
            </div>

          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex justify-end pt-4">
          <Button type="submit" disabled={saving} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? "Saving Changes..." : "Save Configuration"}
          </Button>
        </motion.div>

      </form>
    </motion.div>
  );
};

export default Settings;