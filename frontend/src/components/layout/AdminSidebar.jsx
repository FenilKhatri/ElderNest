import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { links } from "../../data/navigations/links";
import { signOut } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";
import { toast } from "react-toastify";

const AdminSidebar = ({ collapsed, mobileOpen, setMobileOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await logout();
      navigate("/");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* BACKDROP (Mobile only) */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static z-50 h-screen flex flex-col
          bg-white dark:bg-slate-950
          border-r border-slate-200 dark:border-slate-800
          transition-all duration-300

          w-64 md:w-auto

          ${mobileOpen ? "left-0" : "-left-72 md:left-0"}
          ${collapsed ? "md:w-20" : "md:w-64"}
        `}
      >
        {/* HEADER */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          {!collapsed && (
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              Admin Panel
            </h2>
          )}

          {/* Close button (mobile only) */}
          <button className="md:hidden dark:text-white" onClick={() => setMobileOpen(false)}>
            <X />
          </button>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 p-2 space-y-1">
          {links?.admin.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)} // auto close on mobile
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

                  {/* Tooltip for collapsed desktop */}
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
            transition active:scale-95"
          >
            <LogOut size={18} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
