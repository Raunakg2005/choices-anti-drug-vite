import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const hideMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navigation">
      <Link to="/" className="logo-link">
        <img src="/assets/sudo.png" alt="Logo" className="logo" />
      </Link>
      
      <ul className="nav-links-container">
        <li><Link to="/forum" className="nav-link">Anti-Drug Forum</Link></li>
        <li><Link to="/dynamic-game" className="nav-link">Dynamic Game</Link></li>
        <li><Link to="/main-game/childhood" className="play-game nav-link">Play Game</Link></li>
      </ul>

      <button className="hamburger-menu" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`}>
        <ul className="menu-overlay-items">
          <li><Link to="/forum" className="nav-link" onClick={hideMenu}>Anti-Drug Forum</Link></li>
          <li><Link to="/dynamic-game" className="nav-link" onClick={hideMenu}>Dynamic Game</Link></li>
          <li><Link to="/main-game/childhood" className="play-game menu-overlay-link" onClick={hideMenu}>Play Game</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;