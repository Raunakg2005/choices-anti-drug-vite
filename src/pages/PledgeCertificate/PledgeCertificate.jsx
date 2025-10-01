import React from 'react';
import Navigation from '../../components/Navigation';

const PledgeCertificate = () => {
  return (
    <div className="pledge-certificate">
      <Navigation />
      <div style={{ 
        padding: '100px 20px 20px', 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0c0c0c, #1a1a1a)',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1>Pledge Certificate</h1>
        <p>Take the pledge against drugs and get your certificate!</p>
      </div>
    </div>
  );
};

export default PledgeCertificate;