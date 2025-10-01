import React from 'react';
import Navigation from '../../components/Navigation';

const DynamicGame = () => {
  return (
    <div className="dynamic-game">
      <Navigation />
      <div style={{ 
        padding: '100px 20px 20px', 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0c0c0c, #1a1a1a)',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1>Dynamic Game</h1>
        <p>AI-powered dynamic storytelling coming soon!</p>
      </div>
    </div>
  );
};

export default DynamicGame;