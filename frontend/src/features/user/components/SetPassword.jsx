import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "../../../components/ui/Button";
import { setPassword } from "../api/user.api";

const SetPassword = () => {
  const [password, setPasswordState] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
        toast.error("Password must be at least 6 characters.");
        return;
    }
    
    try {
      setLoading(true);
      await setPassword(password);
      toast.success("Password set successfully! You can now login with email and password.");
      setPasswordState("");
    } catch (error) {
      toast.error(error.message || "Failed to set password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 mt-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Set Password</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        Since you signed up with Google, you can set a password here to also allow logging in with your email and password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPasswordState(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="At least 6 characters"
            required
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Setting Password..." : "Set Password"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SetPassword;
