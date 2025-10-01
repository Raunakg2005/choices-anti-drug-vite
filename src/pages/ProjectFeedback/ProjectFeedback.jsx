import React from 'react';
import Navigation from '../../components/Navigation';

const ProjectFeedback = () => {
  return (
    <div className="project-feedback">
      <Navigation />
      <div style={{ 
        padding: '100px 20px 20px', 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0c0c0c, #1a1a1a)',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1>Project Feedback</h1>
        <p>Share your feedback about this project!</p>
      </div>
    </div>
  );
};

export default ProjectFeedback;