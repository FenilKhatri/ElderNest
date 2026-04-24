import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { links } from "../../data/navigations/links";

const UserDropdown = ({ open, setOpen }) => {
  const ref = useRef();

  // close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="
        absolute right-0 mt-3 w-56
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-800
        shadow-xl rounded-2xl p-2 z-50
      "
    >
      {links.user.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition
            ${
              isActive
                ? "bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`
          }
        >
          <Icon size={16} />
          {label}
        </NavLink>
      ))}
    </div>
  );
};

export default UserDropdown;
