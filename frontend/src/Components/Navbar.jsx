import { NavLink } from "react-router-dom";
import React from "react";
import { useNavigate } from "react-router-dom";
const { useState } = React;




const Navbar = () => {
  const navigate = useNavigate();
  
const [menuOpen, setMenuOpen,] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token"); // 🔥 MOST IMPORTANT
    navigate("/signup");
    window.location.reload(); // force re-render
  };

  return (
  <nav className="fixed top-0 h-18 w-full z-30 bg-black/40 backdrop-blur-xl border-b border-white/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">

      {/* LOGO */}
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide
        bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500
        bg-clip-text text-transparent cursor-pointer">
        📒 Contact Vault
      </h1>

      {/* DESKTOP LINKS */}
      <div className="hidden md:flex items-center gap-8 text-white text-lg">

        <NavLink
          to="/add-contact"
          className={({ isActive }) =>
            `relative transition
            ${isActive ? "text-pink-400" : "hover:text-pink-300"}`
          }
        >
          New Contact
          <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-pink-400 scale-x-0 hover:scale-x-100 transition origin-left"></span>
        </NavLink>

        <NavLink
          to="/contacts"
          className={({ isActive }) =>
            `relative transition
            ${isActive ? "text-pink-400" : "hover:text-pink-300"}`
          }
        >
          Contacts
          <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-pink-400 scale-x-0 hover:scale-x-100 transition origin-left"></span>
        </NavLink>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="
            px-5 py-2 rounded-full
            bg-gradient-to-r from-red-500 to-pink-600
            hover:scale-105
            shadow-lg shadow-red-500/40
            transition font-semibold cursor-pointer
          "
        >
          Logout
        </button>
      </div>

      {/* MOBILE MENU ICON */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-white text-3xl"
      >
        ☰
      </button>
    </div>

    {/* MOBILE MENU */}
    {menuOpen && (
      <div className="md:hidden bg-black/80 backdrop-blur-xl px-6 py-6 space-y-4 text-white">

        <NavLink
          to="/add-contact"
          onClick={() => setMenuOpen(false)}
          className="block text-lg hover:text-pink-400"
        >
          ➕ New Contact
        </NavLink>

        <NavLink
          to="/contacts"
          onClick={() => setMenuOpen(false)}
          className="block text-lg hover:text-pink-400"
        >
          📋 Contacts List
        </NavLink>

        <button
          onClick={handleLogout}
          className="
            w-full py-2 rounded-lg
            bg-gradient-to-r from-red-500 to-pink-600
            font-semibold cursor-pointer
          "
        >
          Logout
        </button>
      </div>
    )}
  </nav>
);

};

export default Navbar;
