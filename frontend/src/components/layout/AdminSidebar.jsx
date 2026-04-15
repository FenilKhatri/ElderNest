import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { links } from "../../data/navigations/links";

const AdminSidebar = ({ collapsed }) => {
  const { logout } = useAuth();

  return (
    <aside
      className={`bg-slate-900 text-white h-screen transition-all duration-300 
      ${collapsed ? "w-20" : "w-64"} flex flex-col`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-center h-16 border-b border-slate-700">
        {!collapsed && <h2 className="text-lg font-bold">Admin</h2>}
      </div>

      {/* LINKS */}
      <nav className="flex-1 flex flex-col gap-2 p-2">
        {links?.admin.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex items-center ${
                collapsed ? "justify-center" : "gap-3"
              } px-3 py-2 rounded-lg transition
              ${isActive ? "bg-blue-600" : "hover:bg-slate-700 text-slate-300"}`
            }
          >
            <Icon size={18} />

            {/* Label */}
            {!collapsed && <span>{label}</span>}

            {/* Tooltip */}
            {collapsed && (
              <span className="absolute left-16 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT */}
      <div className="p-2">
        <button
          onClick={logout}
          className="flex items-center justify-center w-full gap-2 px-3 py-2 bg-red-500 rounded-lg hover:bg-red-600"
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
