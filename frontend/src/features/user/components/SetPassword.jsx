import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "../../../components/ui/Button";
import { setPassword } from "../api/user.api";
import Input from "../../../components/ui/Input";
import { Eye, EyeOff, Lock } from "lucide-react";

const SetPassword = ({ onPasswordSet }) => {
  const [password, setPasswordState] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain at least one lowercase letter.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      toast.error("Password must contain at least one number.");
      return;
    }
    if (!/[!@#$%^&*(){}[\]/+\-*]/.test(password)) {
      toast.error("Password must contain at least one special character.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await setPassword(password);
      toast.success("Password set successfully! You can now login with email and password.");
      setPasswordState("");
      setConfirmPassword("");
      if (onPasswordSet) onPasswordSet();
    } catch (error) {
      toast.error(error.message || "Failed to set password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
        <Lock className="w-5 h-5 text-amber-500" />
        Set Password
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
        Since you signed up with Google, you can set a password here to also allow logging in with your email and password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            New Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPasswordState(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="At least 8 characters"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
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
