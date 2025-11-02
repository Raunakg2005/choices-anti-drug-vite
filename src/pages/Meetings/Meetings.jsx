import React, { useState, useEffect } from 'react';
import ForumNavbar from '../../components/ForumNavbar';
import api from '../../utils/api';
import './Meetings2.css';

const Meetings = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    fetchResources();
  }, [activeCategory]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = activeCategory !== 'all' ? { category: activeCategory } : {};
      const response = await api.get('/resources', { params });
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await api.post('/resources/refresh');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
      fetchResources();
    } catch (error) {
      console.error('Error refreshing resources:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
    }
  };

  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'helpline', name: 'Helplines' },
    { id: 'support-meetings', name: 'AA Meetings' },
    { id: 'support-group', name: 'Support Groups' },
    { id: 'education', name: 'Education' },
    { id: 'recovery', name: 'Recovery' }
  ];

  return (
    <>
      <ForumNavbar />
      <div className="meetings-page">
        <div className="meetings-container">
          {/* Success/Error Notifications */}
          {showSuccess && (
            <div className="notification-card success">
              <div className="notification-icon">
                <i className="fa fa-check-circle"></i>
              </div>
              <div className="notification-content">
                <strong>Success!</strong>
                <p>Resources refreshed successfully. Showing latest updates.</p>
              </div>
              <button 
                className="notification-close" 
                onClick={() => setShowSuccess(false)}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
          )}

          {showError && (
            <div className="notification-card error">
              <div className="notification-icon">
                <i className="fa fa-exclamation-circle"></i>
              </div>
              <div className="notification-content">
                <strong>Error</strong>
                <p>Failed to refresh resources. Please try again.</p>
              </div>
              <button 
                className="notification-close" 
                onClick={() => setShowError(false)}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
          )}

          {/* Hero Header with Background Animation */}
          <div className="meetings-hero">
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <div className="hero-badge">
                <i className="fa fa-heart-pulse"></i>
                <span>We're Here to Help</span>
              </div>
              <h1 className="meetings-title">Support Meetings & Resources</h1>
              <p className="meetings-subtitle">
                Discover AA meetings, crisis helplines, and recovery resources available 24/7
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <i className="fa fa-users"></i>
                  <div>
                    <strong>100+</strong>
                    <span>Support Groups</span>
                  </div>
                </div>
                <div className="stat-item">
                  <i className="fa fa-phone-volume"></i>
                  <div>
                    <strong>24/7</strong>
                    <span>Helplines</span>
                  </div>
                </div>
                <div className="stat-item">
                  <i className="fa fa-calendar-check"></i>
                  <div>
                    <strong>Daily</strong>
                    <span>Meetings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Alert Banner */}
          <div className="emergency-alert">
            <div className="alert-icon">
              <i className="fa fa-exclamation-triangle"></i>
            </div>
            <div className="alert-content">
              <strong>In Crisis?</strong> Call the helplines below immediately. Help is available 24/7.
            </div>
          </div>

          {/* Emergency Helplines */}
          <section className="emergency-section">
            <div className="section-header">
              <h2 className="section-title">
                <i className="fa fa-phone"></i>
                Emergency Helplines
              </h2>
              <p className="section-subtitle">Immediate assistance available anytime</p>
            </div>
            <div className="helpline-cards">
              <div className="helpline-card emergency pulse">
                <div className="card-glow"></div>
                <div className="helpline-icon">
                  <i className="fa fa-phone-volume"></i>
                </div>
                <h3>SAMHSA National Helpline</h3>
                <a href="tel:1-800-662-4357" className="helpline-number">1-800-662-4357</a>
                <p className="helpline-desc">
                  Free, confidential, 24/7 treatment referral and information service in English and Spanish
                </p>
                <div className="helpline-features">
                  <span><i className="fa fa-check-circle"></i> Free & Confidential</span>
                  <span><i className="fa fa-clock"></i> 24/7 Available</span>
                  <span><i className="fa fa-language"></i> Multilingual</span>
                </div>
              </div>

              <div className="helpline-card emergency pulse">
                <div className="card-glow"></div>
                <div className="helpline-icon crisis">
                  <i className="fa fa-heart"></i>
                </div>
                <h3>988 Suicide & Crisis Lifeline</h3>
                <a href="tel:988" className="helpline-number">988</a>
                <p className="helpline-desc">
                  24/7 emotional support for people in distress, prevention and crisis resources
                </p>
                <div className="helpline-features">
                  <span><i className="fa fa-check-circle"></i> Immediate Support</span>
                  <span><i className="fa fa-user-shield"></i> Trained Counselors</span>
                  <span><i className="fa fa-comments"></i> Text & Chat Available</span>
                </div>
              </div>
            </div>
          </section>

          {/* Category Filter Section */}
          <section className="filter-section">
            <div className="section-header">
              <h2 className="section-title">
                <i className="fa fa-filter"></i>
                Browse Resources
              </h2>
              <div className="filter-actions">
                <button onClick={handleRefresh} className="refresh-btn">
                  <i className="fa fa-refresh"></i>
                  <span>Refresh</span>
                </button>
              </div>
            </div>
            <div className="category-tabs">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span className="tab-icon">
                    {cat.id === 'all' && <i className="fa fa-th"></i>}
                    {cat.id === 'helpline' && <i className="fa fa-phone"></i>}
                    {cat.id === 'support-meetings' && <i className="fa fa-users"></i>}
                    {cat.id === 'support-group' && <i className="fa fa-hands-helping"></i>}
                    {cat.id === 'education' && <i className="fa fa-graduation-cap"></i>}
                    {cat.id === 'recovery' && <i className="fa fa-star"></i>}
                  </span>
                  {cat.name}
                </button>
              ))}
            </div>
          </section>

          {/* Resources List */}
          <section className="resources-section">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner">
                  <i className="fa fa-spinner fa-spin"></i>
                </div>
                <p>Loading resources...</p>
              </div>
            ) : resources.length === 0 ? (
              <div className="empty-state">
                <i className="fa fa-inbox"></i>
                <h3>No Resources Found</h3>
                <p>No resources found in this category. Try selecting a different filter or refresh the page.</p>
              </div>
            ) : (
              <>
                <div className="results-header">
                  <p className="results-count">
                    <i className="fa fa-check-circle"></i>
                    Found <strong>{resources.length}</strong> {resources.length === 1 ? 'resource' : 'resources'}
                  </p>
                </div>
                <div className="resources-grid">
                  {resources.map((resource, index) => (
                    <div key={index} className="resource-card" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="card-corner"></div>
                      <div className="resource-header">
                        <div className="resource-icon">
                          {resource.category === 'helpline' && <i className="fa fa-phone"></i>}
                          {resource.category === 'support-meetings' && <i className="fa fa-users"></i>}
                          {resource.category === 'support-group' && <i className="fa fa-hands-helping"></i>}
                          {resource.category === 'education' && <i className="fa fa-book"></i>}
                          {resource.category === 'recovery' && <i className="fa fa-star"></i>}
                          {!resource.category && <i className="fa fa-info-circle"></i>}
                        </div>
                        <span className={`resource-badge ${resource.category}`}>
                          {resource.category?.replace('-', ' ')}
                        </span>
                      </div>
                      <h3 className="resource-title">{resource.title}</h3>
                      {resource.description && (
                        <p className="resource-desc">{resource.description}</p>
                      )}
                      <div className="resource-footer">
                        <a 
                          href={resource.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="resource-link"
                        >
                          <span>Visit Resource</span>
                          <i className="fa fa-arrow-right"></i>
                        </a>
                        {resource.source && (
                          <p className="resource-source">
                            <i className="fa fa-shield-alt"></i>
                            {resource.source}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Meetings;
