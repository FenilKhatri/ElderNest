import { Outlet } from "react-router-dom";
import { useState } from "react";
import {
  Sun,
  Moon,
  Search,
  ChevronRight,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DashboardLayout = ({ title, Sidebar, theme, toggleTheme }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-950">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-white dark:bg-slate-900 shadow">
          {/* LEFT */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded bg-slate-200 dark:bg-slate-800"
            >
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </button>

            <h1 className="font-semibold text-lg hidden sm:block dark:text-slate-100">
              {title}
            </h1>
          </div>

          {/* SEARCH */}
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg w-1/3">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none ml-2 w-full text-sm"
            />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="hidden sm:block text-sm font-medium dark:text-slate-100">
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
        <div className="flex-1 p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
