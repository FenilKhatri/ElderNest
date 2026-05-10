import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { User, Menu, X, Moon, Sun, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import Logo from "../../assets/logo.avif";
import { useAuth } from "../../context/AuthContext";
import { navLinks } from "../../features/public/data/routes/public.routes";
import Button from "../../components/ui/Button";
import UserDropdown from "../../components/ui/UserDropdown";
import AuthSkeleton from "../../components/feedback/skeleton/AuthSkeleton";
import MobileAuthSkeleton from "../../components/feedback/skeleton/MobileAuthSkeleton";
import LogoutButton from "../../components/ui/LogoutButton";

const Navbar = ({ theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { user, loading } = useAuth();
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

  const DesktopAuthButtons = () => {
    if (loading) return <AuthSkeleton />;

    if (!user) {
      return (
        <NavLink to="/auth">
          <Button>
            <User size={18} /> Login
          </Button>
        </NavLink>
      );
    }

    return (
      <div className="flex items-center gap-3">
        {user?.role === "admin" && (
          <NavLink to="/admin/profile" title="Go to Admin Panel">
            <Button variant="secondary">Admin Panel</Button>
          </NavLink>
        )}

        {user?.role === "caregiver" && (
          <NavLink to="/caregiver/profile" title="Go to Caregiver Panel">
            <Button variant="primary">Caregiver Panel</Button>
          </NavLink>
        )}

        {user?.role === "user" && (
          <div className="relative">
            <button
              onClick={() => setUserOpen((prev) => !prev)}
              title="User Dropdown"
              className="flex items-center justify-center gap-3 px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 cursor-pointer"
            >
              {user.name}
              <ChevronDown size={18} />
            </button>
            <UserDropdown open={userOpen} setOpen={setUserOpen} />
          </div>
        )}

        <LogoutButton />
      </div>
    );
  };

  const MobileAuthButtons = () => {
    if (loading) return <MobileAuthSkeleton />;

    if (!user) {
      return (
        <NavLink to="/auth">
          <Button>
            <User size={18} /> Login
          </Button>
        </NavLink>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        {user?.role === "admin" && (
          <NavLink to="/admin/profile">
            <Button variant="secondary">Admin Panel</Button>
          </NavLink>
        )}

        {user?.role === "caregiver" && (
          <NavLink to="/caregiver/profile">
            <Button variant="secondary">Caregiver Panel</Button>
          </NavLink>
        )}

        {user?.role === "user" && (
          <NavLink to="/user/profile">
            <Button variant="primary">User Panel</Button>
          </NavLink>
        )}

        <LogoutButton />
      </div>
    );
  };

  return (
    <>
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto flex items-center justify-between p-3">
          {/* LOGO */}
          <img src={Logo} alt="Logo" className="w-16" />

          {/* DESKTOP LINKS */}
          <ul className="hidden md:flex items-center gap-4">
            {navLinks?.map((link) => (
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
              title="Toggle Theme"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 cursor-pointer"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <DesktopAuthButtons />
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
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-slate-700 dark:text-white">Menu</h2>
          <button onClick={() => setMenuOpen(false)}>
            <X />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {navLinks?.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={activeLinks}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}

          <MobileAuthButtons />
        </div>
      </div>
    </>
  );
};

export default Navbar;
