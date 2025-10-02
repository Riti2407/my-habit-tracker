import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const handleReset = () => {
  if (window.confirm("⚠️ Are you sure you want to reset everything? This action cannot be undone.")) {
    window.location.reload();
  }
};

const Navbar = ({ darkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.navbar')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""} ${darkMode ? "dark" : ""}`}>
      <div className="nav-logo">
        <NavLink to="/" onClick={closeMenu}>✨ Habit Tracker</NavLink>
      </div>
      
      <div 
        className={`hamburger ${isMenuOpen ? "active" : ""}`} 
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
      
      <ul className={isMenuOpen ? "nav-links active" : "nav-links"}>
        <li><NavLink to="/" exact onClick={closeMenu}>🏠 Home</NavLink></li>
        <li><NavLink to="/dashboard" onClick={closeMenu}>📊 Dashboard</NavLink></li>
        <li><NavLink to="/summary" onClick={closeMenu}>📅 Summary</NavLink></li>
        <li><NavLink to="/About" onClick={closeMenu}>ℹ️ About</NavLink></li>
        <li><NavLink to="/contact" onClick={closeMenu}>📧 Contact</NavLink></li>
        <li><NavLink to="/login" onClick={closeMenu}>🔐 Login</NavLink></li>
        <li><NavLink to="/signup" onClick={closeMenu}>✍️ Signup</NavLink></li>
        <li>
          <button onClick={() => { handleReset(); closeMenu(); }} className="reset-btn">
            🔄 Reset
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;