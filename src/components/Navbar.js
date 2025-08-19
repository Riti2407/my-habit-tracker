import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const handleReset = () => {
  if (window.confirm("Are you sure you want to reset everything?")) {
    window.location.reload();
  }
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-logo">
        <NavLink to="/">Habit Tracker</NavLink>
      </div>
      <div className={`hamburger ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
      <ul className={isMenuOpen ? "nav-links active" : "nav-links"}>
        <li><NavLink to="/" exact onClick={toggleMenu}>Home</NavLink></li>
        <li><NavLink to="/summary" onClick={toggleMenu}>Monthly Summary</NavLink></li>
        <li><NavLink to="/About" onClick={toggleMenu}>About</NavLink></li>
        <li><NavLink to="/contact" onClick={toggleMenu}>Contact Us</NavLink></li>
        <li>
          <button onClick={handleReset} className="reset-btn">
            Reset Page
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
