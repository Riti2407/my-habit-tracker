import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from "react-router-dom";

const Foot = () => {
  return (
    <footer style={{ backgroundColor: '#222', color: '#ccc', padding: '20px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Logo or Website Name */}
        <h3 style={{ color: 'white', marginBottom: '10px' }}>Habit - Tracker</h3>
        
        {/* Navigation Links */}
        <nav style={{ marginBottom: '15px' }}>
          <Link to="/" style={{ color: '#ccc', margin: '0 10px', textDecoration: 'none' }}>Home</Link>
          <Link to="/about" style={{ color: '#ccc', margin: '0 10px', textDecoration: 'none' }} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>About</Link>
          <Link to="/add-habit" style={{ color: '#ccc', margin: '0 10px', textDecoration: 'none' }}>Contact</Link>
          {/* <Link to="/privacy" style={{ color: '#ccc', margin: '0 10px', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: '#ccc', margin: '0 10px', textDecoration: 'none' }}>Terms</Link> */}
        </nav>

        {/* Social Media Links */}
        <div style={{ marginBottom: '15px' }}>
          <a href="https://github.com/Riti2407/my-habit-tracker" target="_blank" rel="noreferrer" style={{ color: '#ccc', margin: '0 10px' }}>
            <i className="bi bi-github" style={{ fontSize: '20px' }}></i>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: '#ccc', margin: '0 10px' }}>
            <i className="bi bi-facebook" style={{ fontSize: '20px' }}></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: '#ccc', margin: '0 10px' }}>
            <i className="bi bi-twitter" style={{ fontSize: '20px' }}></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: '#ccc', margin: '0 10px' }}>
            <i className="bi bi-instagram" style={{ fontSize: '20px' }}></i>
          </a>
          <a href="https://www.linkedin.com/in/riti-273b36322" target="_blank" rel="noreferrer" style={{ color: '#ccc', margin: '0 10px' }}>
            <i className="bi bi-linkedin" style={{ fontSize: '20px' }}></i>
          </a>
        </div>

        {/* Copyright */}
        <p style={{ fontSize: '14px', margin: 0 }}>© 2025 Habit-Tracker. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Foot;
