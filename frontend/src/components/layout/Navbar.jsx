import Logo from "../../assets/logo.png";
import { NavLink } from "react-router-dom";
import { User, Menu, X, Moon, Sun, LogOut } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { links } from "../../data/navigations/links";

const Navbar = ({ theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, loading, initialized } = useAuth();

  const activeLinks = ({ isActive }) =>
    `p-2 font-semibold transition duration-300 ${
      isActive
        ? "border-b-4 border-[#2A7DE1] text-[#2A7DE1]"
        : "text-slate-600 dark:text-slate-300 hover:text-[#FF3366] hover:border-b-4 hover:border-[#FF3366]"
    }`;
  
    if(!initialized) return <div className="h-16 bg-white dark:bg-slate-900 animate-pulse" />;

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md sticky top-0 z-50 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-3">
        <img
          src={Logo}
          alt="Logo"
          className="w-16"
          height="full"
          width="full"
          loading="lazy"
          decoding="async"
          fetchPriority="high"
        />

        <ul className="hidden md:flex items-center gap-3">
          {links?.common?.map((link) => (
            <li key={link?.path}>
              <NavLink to={link?.path} className={activeLinks}>
                {link?.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            title="Toggle Theme"
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100 transition"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!user ? (
            <>
              <NavLink to="/auth">
                <Button>
                  <User size={18} />
                  Login
                </Button>
              </NavLink>

              <NavLink to="/caregiver-login">
                <Button variant="secondary">
                  <User size={18} />
                  Become Caregiver
                </Button>
              </NavLink>
            </>
          ) : user?.role === "admin" ? (
            <>
              <NavLink to="/admin/dashboard">
                <Button>Admin Panel</Button>
              </NavLink>
              <Button onClick={logout} className="bg-red-500 hover:bg-red-600">
                <LogOut size={16} />
                Logout
              </Button>
            </>
          ) : user?.role === "caregiver" ? (
            <>
              <NavLink to="/caregiver/dashboard">
                <Button>Caregiver Dashboard</Button>
              </NavLink>
              <Button onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <NavLink to="/user/dashboard">
                <Button>Dashboard</Button>
              </NavLink>
              <Button onClick={logout}>Logout</Button>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100 transition"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            className="text-slate-800 dark:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden px-6 pb-6 bg-white dark:bg-slate-900 transition-colors duration-300">
          <ul className="flex flex-col gap-3">
            {links?.common?.map((link) => (
              <NavLink
                key={link?.path}
                to={link?.path}
                className={activeLinks}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </NavLink>
            ))}

            <div className="flex flex-col gap-3 mt-3">
              <NavLink
                to="/auth"
                className="flex items-center gap-2 bg-[#2A7DE1]/10 text-[#2A7DE1] font-semibold px-4 py-2 rounded-md hover:bg-[#2A7DE1]/20 transition"
                onClick={() => setMenuOpen(false)}
              >
                <User size={18} /> Login
              </NavLink>

              <NavLink
                to="/caregiver-login"
                className="flex items-center gap-2 bg-[#FF3366]/10 text-[#FF3366] dark:bg-[#FF3366] dark:text-[#FF3366] font-semibold px-4 py-2 rounded-md hover:bg-[#e62e5c] transition"
                onClick={() => setMenuOpen(false)}
              >
                <User size={18} /> Become Caregiver
              </NavLink>
            </div>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
