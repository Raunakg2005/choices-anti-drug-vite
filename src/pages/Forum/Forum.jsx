import React from 'react';
import Navigation from '../../components/Navigation';

const Forum = () => {
  return (
    <div className="forum">
      <Navigation />
      <div style={{ 
        padding: '100px 20px 20px', 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0c0c0c, #1a1a1a)',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1>Anti-Drug Forum</h1>
        <p>Community forum for anti-drug discussions coming soon!</p>
      </div>
    </div>
  );
};

export default Forum;