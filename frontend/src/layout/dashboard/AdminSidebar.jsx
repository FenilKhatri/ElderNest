import { NavLink, useLocation } from "react-router-dom";
import { X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../../components/ui/LogoutButton";
import { adminSidebarLinks } from "./adminSidebar.config";
import Logo from "../../assets/logo.avif";

const AdminSidebar = ({ collapsed, mobileOpen, setMobileOpen }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);

  // Auto-open menus based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const newOpenMenus = {};

    adminSidebarLinks.forEach((link) => {
      if (link.subLinks) {
        const isActive = link.subLinks.some((sub) =>
          currentPath.startsWith(sub.to)
        );
        if (isActive) {
          newOpenMenus[link.label] = true;
        }
      }
    });

    setOpenMenus(newOpenMenus);
  }, [location.pathname]);

  const toggleMenu = (label) => {
    if (collapsed) {
      // When collapsed, show tooltip instead
      return;
    }
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleMouseEnter = (label) => {
    if (collapsed) {
      setHoveredItem(label);
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? "5rem" : "16rem",
        }}
        className={`fixed md:sticky md:top-0 z-50 h-screen flex flex-col  dark:bg-slate-900 bg-slate-900 border-r border-slate-800/50 shadow-2xl transition-all duration-300 ease-in-out ${mobileOpen ? "left-0" : "-left-72 md:left-0"
          } ${collapsed ? "md:w-20" : "md:w-64"}`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/50 shrink-0 bg-slate-900/50 backdrop-blur-xl">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <img src={Logo} alt="ElderNest" className="w-10 h-10" />
              <div>
                <h2 className="text-base font-bold text-white">ElderNest</h2>
                <p className="text-xs text-slate-400">Admin Panel</p>
              </div>
            </motion.div>
          )}
          {collapsed && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={Logo}
              alt="ElderNest"
              className="w-8 h-8 mx-auto"
            />
          )}
          <button
            className="md:hidden text-slate-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          {adminSidebarLinks.map((link) => {
            const hasSubLinks = !!link.subLinks;
            const isOpen = openMenus[link.label];
            const isAnySubActive =
              hasSubLinks &&
              link.subLinks.some((sub) => location.pathname.startsWith(sub.to));
            const isItemActive = !hasSubLinks && location.pathname === link.to;
            const Icon = link.icon;

            return (
              <div
                key={link.label}
                onMouseEnter={() => handleMouseEnter(link.label)}
                onMouseLeave={handleMouseLeave}
                className="relative"
              >
                {hasSubLinks ? (
                  <div>
                    {/* Dropdown Button */}
                    <button
                      onClick={() => toggleMenu(link.label)}
                      className={`w-full relative flex items-center rounded-xl transition-all duration-200 ${
                        collapsed ? "justify-center px-0" : "justify-between px-3"
                      } py-2.5 text-sm font-medium group ${
                        isAnySubActive
                          ? "bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/10"
                          : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isAnySubActive && !collapsed && (
                          <motion.span
                            layoutId="activeIndicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                        <Icon
                          size={20}
                          className={`${
                            isAnySubActive
                              ? "text-blue-400"
                              : "text-slate-400 group-hover:text-white"
                          } transition-colors`}
                        />
                        {!collapsed && <span>{link.label}</span>}
                      </div>
                      {!collapsed && (
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={16} />
                        </motion.div>
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isOpen && !collapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-1 ml-6 pl-4 pr-2 pb-1 space-y-1 relative">
                            {/* Vertical Line */}
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "100%" }}
                              exit={{ height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-slate-700 via-slate-600 to-slate-700"
                            />

                            {link.subLinks.map((sub, index) => {
                              const isSubActive = location.pathname.startsWith(
                                sub.to
                              );
                              return (
                                <motion.div
                                  key={sub.to}
                                  initial={{ x: -10, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="relative"
                                >
                                  {/* Connection dot */}
                                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-700 border-2 border-slate-900" />

                                  <NavLink
                                    to={sub.to}
                                    onClick={() => setMobileOpen(false)}
                                    className={`block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                      isSubActive
                                        ? "bg-blue-600/20 text-blue-400 shadow-md"
                                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white hover:translate-x-1"
                                    }`}
                                  >
                                    {sub.label}
                                  </NavLink>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Collapsed Tooltip */}
                    {collapsed && hoveredItem === link.label && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="fixed left-20 z-50 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap"
                        style={{
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <div className="font-medium mb-1">{link.label}</div>
                        {link.subLinks && (
                          <div className="text-xs text-slate-400 space-y-1">
                            {link.subLinks.map((sub) => (
                              <div key={sub.to}>{sub.label}</div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `relative flex items-center rounded-xl transition-all duration-200 ${
                        collapsed ? "justify-center px-0" : "gap-3 px-3"
                      } py-2.5 text-sm font-medium group ${
                        isActive
                          ? "bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/10"
                          : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && !collapsed && (
                          <motion.span
                            layoutId="activeIndicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                        <Icon
                          size={20}
                          className={`${
                            isActive
                              ? "text-blue-400"
                              : "text-slate-400 group-hover:text-white"
                          } transition-colors`}
                        />
                        {!collapsed && <span>{link.label}</span>}
                      </>
                    )}
                  </NavLink>
                )}

                {/* Collapsed Tooltip for regular links */}
                {collapsed && !hasSubLinks && hoveredItem === link.label && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="fixed left-20 z-50 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap"
                    style={{
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    {link.label}
                  </motion.div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800/50 shrink-0 bg-slate-900/50 backdrop-blur-xl">
          {!collapsed && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
            </motion.div>
          )}
          <LogoutButton showText={!collapsed} className="w-full" />
        </div>
      </motion.aside>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.8);
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;
