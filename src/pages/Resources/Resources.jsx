import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import './Resources.css';

function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchResources();
  }, [category]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await api.get('/resources', {
        params: { category }
      });
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      await api.post('/resources/refresh');
      fetchResources();
    } catch (error) {
      console.error('Error refreshing resources:', error);
      alert('Failed to refresh resources. Please try again.');
    }
  };

  const categories = [
    { value: 'all', label: 'All Resources', icon: '📚' },
    { value: 'helpline', label: 'Helplines', icon: '📞' },
    { value: 'support-group', label: 'Support Groups', icon: '👥' },
    { value: 'support-meetings', label: 'Meetings', icon: '🤝' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'family-support', label: 'Family Support', icon: '👨‍👩‍👧' }
  ];

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="resources-loading">Loading resources...</div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="resources-container">
      <div className="resources-header">
        <h1>Anti-Drug Resources & Support</h1>
        <p>Find help, support groups, and educational materials</p>
        {user && (
          <button onClick={handleRefresh} className="btn-refresh">
            🔄 Refresh Resources
          </button>
        )}
      </div>

      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`category-tab ${category === cat.value ? 'active' : ''}`}
          >
            <span className="category-icon">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="resources-grid">
        {resources.length === 0 ? (
          <div className="no-resources">
            <p>No resources found in this category.</p>
          </div>
        ) : (
          resources.map((resource, index) => (
            <div key={index} className="resource-card">
              <div className="resource-header">
                <h3>{resource.title}</h3>
                <span className={`resource-badge ${resource.category}`}>
                  {resource.category.replace('-', ' ')}
                </span>
              </div>
              <p className="resource-description">{resource.description}</p>
              <div className="resource-footer">
                <span className="resource-source">Source: {resource.source}</span>
                <a 
                  href={resource.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-visit"
                >
                  Visit Resource →
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="emergency-section">
        <h2>🚨 Need Immediate Help?</h2>
        <div className="emergency-cards">
          <div className="emergency-card">
            <h3>SAMHSA National Helpline</h3>
            <p className="emergency-number">1-800-662-4357</p>
            <p>Free, confidential, 24/7 treatment referral service</p>
          </div>
          <div className="emergency-card">
            <h3>Crisis Text Line</h3>
            <p className="emergency-number">Text "HELLO" to 741741</p>
            <p>24/7 support for people in crisis</p>
          </div>
          <div className="emergency-card">
            <h3>National Suicide Prevention Lifeline</h3>
            <p className="emergency-number">988</p>
            <p>24/7 free and confidential support</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Resources;
