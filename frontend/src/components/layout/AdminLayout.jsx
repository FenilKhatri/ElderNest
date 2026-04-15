import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Sun, Moon, Search, ChevronRight, ChevronLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = ({ theme, toggleTheme }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main */}
      <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-950">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-white dark:bg-slate-900 shadow">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded bg-slate-200 dark:bg-slate-800"
            >
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </button>
            <h1 className="font-semibold text-lg hidden sm:block">
              Admin Panel
            </h1>
          </div>

          {/* CENTER - SEARCH */}
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
            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded bg-slate-200 dark:bg-slate-800"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Admin Name */}
            <div className="hidden sm:block text-sm font-medium">
              {user?.name || "Admin"}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
