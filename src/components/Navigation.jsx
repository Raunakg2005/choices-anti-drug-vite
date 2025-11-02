import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const hideMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    hideMenu();
  };

  return (
    <nav className="navigation">
      <Link to="/" className="logo-link">
        <img src="/assets/sudo.png" alt="Logo" className="logo" />
      </Link>
      
      <ul className="nav-links-container">
        <li><Link to="/forum" className="nav-link">Anti-Drug Forum</Link></li>
        <li><Link to="/resources" className="nav-link">Resources & Help</Link></li>
        <li><Link to="/dynamic-game" className="nav-link">Dynamic Game</Link></li>
        <li><Link to="/main-game/childhood" className="play-game nav-link">Play Game</Link></li>
        
        {isAuthenticated ? (
          <li className="user-menu">
            <button className="user-btn" onClick={toggleDropdown}>
              <img src={user?.avatar} alt={user?.username} className="user-avatar" />
              <span>{user?.username}</span>
            </button>
            {isDropdownOpen && (
              <div className="user-dropdown">
                <Link to="/profile">My Profile</Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            )}
          </li>
        ) : (
          <>
            <li><Link to="/login" className="nav-link">Login</Link></li>
            <li><Link to="/signup" className="signup-btn nav-link">Sign Up</Link></li>
          </>
        )}
      </ul>

      <button 
        className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} 
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={hideMenu}>
        <ul className="menu-overlay-items" onClick={(e) => e.stopPropagation()}>
          <li><Link to="/forum" className="nav-link" onClick={hideMenu}>Anti-Drug Forum</Link></li>
          <li><Link to="/resources" className="nav-link" onClick={hideMenu}>Resources & Help</Link></li>
          <li><Link to="/dynamic-game" className="nav-link" onClick={hideMenu}>Dynamic Game</Link></li>
          <li><Link to="/main-game/childhood" className="play-game menu-overlay-link" onClick={hideMenu}>Play Game</Link></li>
          
          {isAuthenticated ? (
            <>
              <li className="mobile-user-info">
                <img src={user?.avatar} alt={user?.username} className="user-avatar" />
                <span>{user?.username}</span>
              </li>
              <li><Link to="/profile" className="menu-overlay-link" onClick={hideMenu}>My Profile</Link></li>
              <li><button onClick={handleLogout} className="mobile-logout-btn">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="nav-link" onClick={hideMenu}>Login</Link></li>
              <li><Link to="/signup" className="signup-btn menu-overlay-link" onClick={hideMenu}>Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;