import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { sidebarConfig } from "./sidebar.config";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../../components/ui/LogoutButton";

// Reusable portal tooltip matching the design
const SidebarTooltip = ({ label, icon: Icon, y }) =>
  createPortal(
    <div
      className="fixed left-18 z-9999 flex items-center pointer-events-none"
      style={{ top: `${y}px`, transform: "translateY(-50%)" }}
    >
      {/* Arrow */}
      <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-10 border-r-slate-700" />

      {/* Card */}
      <div className="flex items-center gap-3 bg-slate-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-xl whitespace-nowrap">
        {Icon && <Icon size={18} className="text-red-400" />}
        <span>{label}</span>
      </div>
    </div>,
    document.body,
  );

const Sidebar = ({ collapsed, mobileOpen, setMobileOpen }) => {
  const { user } = useAuth();
  const [tooltip, setTooltip] = useState({
    show: false,
    label: "",
    icon: null,
    y: 0,
  });

  const roleConfig = sidebarConfig[user?.role] || {};
  const title = roleConfig.title || "Dashboard";
  const navLinks = roleConfig.links || [];

  const handleMouseEnter = (e, label, icon) => {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ show: true, label, icon, y: rect.top + rect.height / 2 });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, label: "", icon: null, y: 0 });
  };

  return (
    <>
      {collapsed && tooltip.show && (
        <SidebarTooltip
          label={tooltip.label}
          icon={tooltip.icon}
          y={tooltip.y}
        />
      )}

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={` fixed md:static z-50 h-screen flex flex-col bg-white/90 dark:bg-slate-950 backdrop-blur-2xl border-r border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-200/30 dark:shadow-black/40 transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden w-64 md:w-auto before:absolute before:top-0 before:right-0 before:h-full before:w-px before:bg-linear-to-b before:from-transparent before:via-slate-300/60 before:to-transparent dark:before:via-slate-700/60 ${mobileOpen ? "left-0" : "-left-72 md:left-0"} ${collapsed ? "md:w-20" : "md:w-64"}`}
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
            <div
              key={to}
              onMouseEnter={(e) => handleMouseEnter(e, label, Icon)}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `relative flex items-center rounded-xl transition
                  ${collapsed ? "justify-center px-0" : "gap-3 px-3"}
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
                  </>
                )}
              </NavLink>
            </div>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <LogoutButton showText={!collapsed} className="w-full" />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
