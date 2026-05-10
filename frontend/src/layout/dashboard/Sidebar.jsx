import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { toast } from "react-toastify";
import { sidebarConfig } from "./sidebar.config";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ collapsed, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const roleConfig = sidebarConfig[user?.role] || {};
  const title = roleConfig.title || "Dashboard";
  const navLinks = roleConfig.links || [];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed!");
    }
  };

  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static z-50 h-screen flex flex-col bg-white/90 dark:bg-slate-950 backdrop-blur-2xl border-r border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-200/30 dark:shadow-black/40 transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden w-64 md:w-auto before:absolute before:top-0 before:right-0 before:h-full before:w-px before:bg-linear-to-b before:from-transparent before:via-slate-300/60 before:to-transparent dark:before:via-slate-700/60 ${mobileOpen ? "left-0" : "-left-72 md:left-0"} ${collapsed ? "md:w-20" : "md:w-64"}`}
      >
        {/* HEADER */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          {!collapsed && (
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              {title}
            </h2>
          )}

          <button
            className="md:hidden dark:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 p-2 space-y-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `relative group flex items-center rounded-xl transition
                ${collapsed ? "justify-center" : "gap-3 px-3"}
                py-2.5 text-sm font-medium
                ${
                  isActive
                    ? "bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-white"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full" />
                  )}

                  <Icon size={18} />

                  {!collapsed && <span>{label}</span>}

                  {collapsed && (
                    <span className="absolute left-16 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      {label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2
            px-3 py-2 rounded-xl text-sm font-medium
            bg-red-500 hover:bg-red-600 text-white
            transition active:scale-95 cursor-pointer"
          >
            <LogOut size={18} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
