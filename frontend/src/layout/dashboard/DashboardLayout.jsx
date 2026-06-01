import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Sun,
  Moon,
  Search,
  ChevronRight,
  ChevronLeft,
  Menu,
  Bell,
} from "lucide-react";

import Sidebar from "./Sidebar";
import AdminSidebar from "./AdminSidebar";
import { sidebarConfig } from "./sidebar.config";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { ROLES } from "../../utils/constants";

const DashboardLayout = ({ theme, toggleTheme }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  const roleConfig = sidebarConfig[user?.role] || {};
  const title = roleConfig.title || "Dashboard";

  // Use AdminSidebar for admin users
  const SidebarComponent = user?.role === ROLES.ADMIN ? AdminSidebar : Sidebar;

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <SidebarComponent
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 w-full bg-slate-100 dark:bg-slate-950">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-white dark:bg-slate-900 shadow">
          {/* LEFT */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "Click to expand sidebar" : "Click to collapse sidebar"}
              className="p-2 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer transtion-all duration-300"
            >
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </button>

            <h1 className="font-semibold text-lg hidden sm:block dark:text-slate-100">
              {title}
            </h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded bg-slate-200 dark:bg-slate-800 dark:text-slate-200 cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => navigate("/admin/notifications")}
              className="relative p-2 rounded bg-slate-200 dark:bg-slate-800 dark:text-slate-200 cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2 text-sm font-medium dark:text-slate-100">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="profile" className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
              ) : null}
              {user?.name || title}
            </div>
          </div>

          {/* MOBILE MENU */}
          <button
            className="md:hidden dark:text-white"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 w-full min-w-0 p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-none">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
