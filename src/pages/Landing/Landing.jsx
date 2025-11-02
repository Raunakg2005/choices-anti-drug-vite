import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ForumNavbar from '../../components/ForumNavbar';
import './Landing.css';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to forum
    if (isAuthenticated) {
      navigate('/forum');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <ForumNavbar />
      <div className="landing-page">
        <div className="landing-background-effects">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
        <div className="landing-container">
          <div className="landing-content">
            <h1 className="landing-title">
              Connect with your <span className="highlight">friends</span>
            </h1>
            <p className="landing-subtitle">
              Follow people who interest you, stay up to date on the latest news 
              and join conversation with your friends
            </p>
            <div className="landing-buttons">
              <Link to="/login" className="btn-landing btn-light">
                <i className="fa fa-sign-in"></i> Login
              </Link>
              <Link to="/signup" className="btn-landing btn-dark">
                <i className="fa fa-user-plus"></i> Register
              </Link>
            </div>
            <div className="landing-features">
              <div className="feature-item">
                <i className="fa fa-users"></i>
                <span>Join Community</span>
              </div>
              <div className="feature-item">
                <i className="fa fa-comments"></i>
                <span>Share Stories</span>
              </div>
              <div className="feature-item">
                <i className="fa fa-heart"></i>
                <span>Get Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
