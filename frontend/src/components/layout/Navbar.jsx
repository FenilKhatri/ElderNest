import Logo from "../../assets/logo.avif";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { User, Menu, X, Moon, Sun, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { links } from "../../data/navigations/links";
import { logOut } from "../../api/logoutapi";

const Navbar = ({ theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, initialized } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const activeLinks = ({ isActive }) =>
    `p-2 font-semibold transition duration-300 ${
      isActive
        ? "border-b-4 border-[#2A7DE1] text-[#2A7DE1]"
        : "text-slate-600 dark:text-slate-300 hover:text-[#FF3366]"
    }`;

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  if (!initialized)
    return <div className="h-16 bg-white dark:bg-slate-900 animate-pulse" />;

  return (
    <>
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto flex items-center justify-between p-3">
          {/* LOGO */}
          <img src={Logo} alt="Logo" className="w-16" />

          {/* DESKTOP LINKS */}
          <ul className="hidden md:flex items-center gap-4">
            {links?.common?.map((link) => (
              <li key={link.path}>
                <NavLink to={link.path} className={activeLinks}>
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* RIGHT ACTIONS */}
          <div className="hidden md:flex items-center gap-3">
            {/* THEME */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* AUTH */}
            {!user ? (
              <>
                <NavLink to="/auth">
                  <Button>
                    <User size={18} /> Login
                  </Button>
                </NavLink>

                <NavLink to="/caregiver-auth">
                  <Button variant="secondary">
                    <User size={18} /> Become Caregiver
                  </Button>
                </NavLink>
              </>
            ) : (
              <>
                {/* ROLE BASED LINKS */}
                {user?.role === "admin" && (
                  <NavLink to="/admin/dashboard">
                    <Button variant="secondary">Admin Panel</Button>
                  </NavLink>
                )}

                {user?.role === "caregiver" && (
                  <NavLink to="/caregiver/dashboard">
                    <Button variant="secondary">Caregiver Panel</Button>
                  </NavLink>
                )}

                {user?.role === "user" && (
                  <NavLink to="/user/dashboard">
                    <Button variant="secondary">Dashboard</Button>
                  </NavLink>
                )}

                {/* LOGOUT */}
                <Button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600"
                >
                  <LogOut size={16} /> Logout
                </Button>
              </>
            )}
          </div>

          {/* MOBILE BUTTONS */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button onClick={() => setMenuOpen(true)}>
              <Menu size={28} />
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`
        fixed top-0 right-0 h-full w-72 bg-white dark:bg-slate-900
        z-50 shadow-xl transform transition-transform duration-300
        md:hidden
        ${menuOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-slate-700 dark:text-white">Menu</h2>
          <button onClick={() => setMenuOpen(false)}>
            <X />
          </button>
        </div>

        {/* LINKS */}
        <div className="p-4 flex flex-col gap-3">
          {links?.common?.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={activeLinks}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}

          {/* AUTH */}
          <div className="mt-4 flex flex-col gap-3">
            {!user ? (
              <>
                <NavLink to="/auth">
                  <Button>
                    <User size={18} /> Login
                  </Button>
                </NavLink>

                <NavLink to="/caregiver-auth">
                  <Button variant="secondary">
                    <User size={18} /> Become Caregiver
                  </Button>
                </NavLink>
              </>
            ) : (
              <>
                {/* ROLE BASED LINKS */}
                {user?.role === "admin" && (
                  <NavLink to="/admin/dashboard">
                    <Button variant="secondary">Admin Panel</Button>
                  </NavLink>
                )}

                {user?.role === "caregiver" && (
                  <NavLink to="/caregiver/dashboard">
                    <Button variant="secondary">Caregiver Panel</Button>
                  </NavLink>
                )}

                {user?.role === "user" && (
                  <NavLink to="/user/dashboard">
                    <Button variant="secondary">Dashboard</Button>
                  </NavLink>
                )}

                {/* LOGOUT */}
                <Button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600"
                >
                  <LogOut size={16} /> Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
