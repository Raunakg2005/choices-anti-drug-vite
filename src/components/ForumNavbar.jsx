import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForumNavbar.css';

const ForumNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const hideMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="forum-nav">
      <Link to="/">
        <img src="https://i.imgur.com/HpGoS3G.png" alt="Logo" className="forum-nav-logo" />
      </Link>

      <ul className="forum-nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/meetings">Meetings</Link></li>
        <li><Link to="/forum">Community</Link></li>
      </ul>

      <button 
        className={`forum-hamburger-menu ${isMenuOpen ? 'open' : ''}`} 
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`forum-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
        <ul className="forum-menu-overlay-items">
          <li><Link to="/" onClick={hideMenu}>Home</Link></li>
          <li><Link to="/about" onClick={hideMenu}>About</Link></li>
          <li><Link to="/meetings" onClick={hideMenu}>Meetings</Link></li>
          <li><Link to="/forum" onClick={hideMenu}>Community</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default ForumNavbar;
