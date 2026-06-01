import { useState } from "react";
import { toast } from "react-toastify";
import { Settings as SettingsIcon, Bell, Lock } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Checkbox from "../../../components/ui/Checkbox";
import SetPassword from "../../user/components/SetPassword";

const Settings = () => {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    bookingAlerts: true,
    marketingEmails: false,
  });

  const handleSavePrefs = () => {
    toast.success("Notification preferences saved");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-7 h-7" />
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Account, security, and notifications.</p>
      </div>

      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5" /> Security
        </h2>
        {user?.hasPassword === false ? (
          <SetPassword />
        ) : (
          <p className="text-sm text-slate-500 mb-4">
            Use the password reset flow from login if you need to change your password.
          </p>
        )}
        <div className="grid gap-3 mt-4 max-w-md">
          <Input label="Email" value={user?.email || ""} disabled />
          <Input label="Phone" value={user?.phone || ""} disabled />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5" /> Notification preferences
        </h2>
        <div className="space-y-3">
          <Checkbox
            label="Email notifications"
            checked={prefs.emailNotifications}
            onChange={(e) => setPrefs({ ...prefs, emailNotifications: e.target.checked })}
          />
          <Checkbox
            label="Booking alerts"
            checked={prefs.bookingAlerts}
            onChange={(e) => setPrefs({ ...prefs, bookingAlerts: e.target.checked })}
          />
          <Checkbox
            label="Marketing emails"
            checked={prefs.marketingEmails}
            onChange={(e) => setPrefs({ ...prefs, marketingEmails: e.target.checked })}
          />
        </div>
        <Button onClick={handleSavePrefs} className="mt-4">
          Save preferences
        </Button>
      </section>
    </div>
  );
};

export default Settings;
