import { NavLink, useLocation } from "react-router-dom";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { sidebarConfig } from "./sidebar.config";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../../components/ui/LogoutButton";
import { motion, AnimatePresence } from "framer-motion";

const SidebarTooltip = ({ label, icon: Icon, y }) =>
  createPortal(
    <div
      className="fixed left-18 z-9999 flex items-center pointer-events-none"
      style={{ top: `${y}px`, transform: "translateY(-50%)" }}
    >
      <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-10 border-r-slate-700" />
      <div className="flex items-center gap-3 bg-slate-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-xl whitespace-nowrap">
        {Icon && <Icon size={18} className="text-red-400" />}
        <span>{label}</span>
      </div>
    </div>,
    document.body,
  );

const Sidebar = ({ collapsed, mobileOpen, setMobileOpen }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [tooltip, setTooltip] = useState({ show: false, label: "", icon: null, y: 0 });
  const [openMenus, setOpenMenus] = useState({});

  const roleConfig = sidebarConfig[user?.role] || {};
  const title = roleConfig.title || "Dashboard";
  const navLinks = roleConfig.links || [];

  // Open menus based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const newOpenMenus = { ...openMenus };
    let changed = false;

    navLinks.forEach((link, idx) => {
      if (link.subLinks) {
        const isActive = link.subLinks.some(sub => currentPath.startsWith(sub.to));
        if (isActive && !newOpenMenus[link.label]) {
          newOpenMenus[link.label] = true;
          changed = true;
        }
      }
    });

    if (changed && !collapsed) {
      setOpenMenus(newOpenMenus);
    }
  }, [location.pathname, collapsed]);

  const toggleMenu = (label) => {
    if (collapsed) return;
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

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
        <SidebarTooltip label={tooltip.label} icon={tooltip.icon} y={tooltip.y} />
      )}

      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/40 z-40 md:hidden" />
      )}

      <aside
        className={`fixed md:sticky md:top-0 z-50 h-screen flex flex-col bg-white/90 dark:bg-slate-950 backdrop-blur-2xl border-r border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-200/30 dark:shadow-black/40 transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden w-64 md:w-auto before:absolute before:top-0 before:right-0 before:h-full before:w-px before:bg-linear-to-b before:from-transparent before:via-slate-300/60 before:to-transparent dark:before:via-slate-700/60 ${mobileOpen ? "left-0" : "-left-72 md:left-0"} ${collapsed ? "md:w-20" : "md:w-64"}`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          {!collapsed && <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">{title}</h2>}
          <button className="md:hidden dark:text-white" onClick={() => setMobileOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {navLinks.map(({ to, label, icon: Icon, subLinks }, idx) => {
            const hasSubLinks = !!subLinks;
            const isOpen = openMenus[label];
            const isAnySubActive = hasSubLinks && subLinks.some(sub => location.pathname.startsWith(sub.to));
            const isItemActive = !hasSubLinks && location.pathname === to;

            return (
              <div key={label} onMouseEnter={(e) => handleMouseEnter(e, label, Icon)} onMouseLeave={handleMouseLeave}>
                {hasSubLinks ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(label)}
                      className={`w-full relative flex items-center justify-between rounded-xl transition ${collapsed ? "px-0 justify-center" : "px-3 gap-3"} py-2.5 text-sm font-medium ${isAnySubActive ? "bg-blue-50/50 dark:bg-slate-800/50 text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"}`}
                    >
                      <div className="flex items-center gap-3">
                        {isAnySubActive && <span className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full" />}
                        <Icon size={18} className={isAnySubActive ? "text-blue-600 dark:text-blue-400" : ""} />
                        {!collapsed && <span>{label}</span>}
                      </div>
                      {!collapsed && (
                        <div className="pr-1">
                          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                      )}
                    </button>
                    <AnimatePresence>
                      {isOpen && !collapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-1 space-y-1 pl-9 pr-2 pb-1">
                            {subLinks.map((sub) => (
                              <NavLink
                                key={sub.to}
                                to={sub.to}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                  `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive
                                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                  }`
                                }
                              >
                                {sub.label}
                              </NavLink>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <NavLink
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `relative flex items-center rounded-xl transition ${collapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 text-sm font-medium ${
                        isActive
                          ? "bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-white"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <span className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full" />}
                        <Icon size={18} className={isActive ? "text-blue-600 dark:text-blue-400" : ""} />
                        {!collapsed && <span>{label}</span>}
                      </>
                    )}
                  </NavLink>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <LogoutButton showText={!collapsed} className="w-full" />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
