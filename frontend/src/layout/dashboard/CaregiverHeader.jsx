import NotificationBell from "../../components/ui/NotificationBell";
import { useState } from "react";
import { Menu, Sun, Moon, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../../components/ui/LogoutButton";

const CaregiverHeader = ({ onMenuClick, theme, toggleTheme }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between">
        {/* Left — mobile menu + title */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 dark:hover:bg-slate-800"
          >
            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <span className="hidden lg:block text-lg font-semibold text-slate-900 dark:text-white">
            Caregiver Panel
          </span>
        </div>

        {/* Right — theme, bell, user name, logout */}
        <div className="flex items-center space-x-2">
          {/* Theme toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 dark:hover:bg-slate-800"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>

          {/* Notifications */}
          <NotificationBell />

          {/* User name */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800">
            <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">
                {user?.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Caregiver
              </p>
            </div>
          </div>

          {/* Logout — rightmost */}
          <LogoutButton showText={false} className="!px-2.5 !py-2" />
        </div>
      </div>
    </header>
  );
};

export default CaregiverHeader;