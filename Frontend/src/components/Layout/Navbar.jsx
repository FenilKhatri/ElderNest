import Logo from "../../assets/Logo.png";
import { NavLink } from "react-router-dom";
import { User, Menu, X } from "lucide-react";
import { useState } from "react";
import Button from "../common/Button";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const activeLinks = ({ isActive }) =>
  `p-2 font-semibold transition duration-300
  ${
    isActive
      ? "border-b-4 border-[#2A7DE1] text-[#2A7DE1]"
      : "text-slate-600 hover:text-[#FF3366] hover:border-b-4 hover:border-[#FF3366]"
  }`;

  return (
    <div className="bg-white/80 backdrop-blur-md shadow-md sticky top-0">
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-3">
        {/* Logo */}
        <img src={Logo} alt="Logo" className="w-16" />

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-3">
          <li>
            <NavLink to="/" className={activeLinks}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={activeLinks}>
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={activeLinks}>
              Contact Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" className={activeLinks}>
              Services
            </NavLink>
          </li>
          <li>
            <NavLink to="/blogs" className={activeLinks}>
              Blogs
            </NavLink>
          </li>
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <NavLink
            to="/login"
          >
            <Button><User size={18} />Login</Button>
          </NavLink>

          <NavLink
            to="/caregiver-login"
          >
            <Button variant="secondary"><User size={18} />Become Caregiver</Button>
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6">
          <ul className="flex flex-col gap-3">
            <NavLink
              to="/"
              className={activeLinks}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={activeLinks}
              onClick={() => setMenuOpen(false)}
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={activeLinks}
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </NavLink>
            <NavLink
              to="/services"
              className={activeLinks}
              onClick={() => setMenuOpen(false)}
            >
              Services
            </NavLink>
            <NavLink
              to="/blogs"
              className={activeLinks}
              onClick={() => setMenuOpen(false)}
            >
              Blogs
            </NavLink>

            <div className="flex flex-col gap-3 mt-3">
              <NavLink
                to="/login"
                className="flex items-center gap-2 bg-[#2A7DE1]/10 text-[#2A7DE1] font-semibold px-4 py-2 rounded-md hover:bg-[#2A7DE1]/20 transition"
                onClick={() => setMenuOpen(false)}
              >
                <User size={18} /> Login
              </NavLink>

              <NavLink
                to="/caregiver-login"
                className="flex items-center gap-2 bg-[#FF3366]/10 text-[#FF3366] font-semibold px-4 py-2 rounded-md hover:bg-[#e62e5c] transition"
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
