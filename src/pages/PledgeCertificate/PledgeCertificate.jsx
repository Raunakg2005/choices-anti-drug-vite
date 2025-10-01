import React, { useRef, useEffect, useState } from 'react';
import Navigation from '../../components/Navigation';
import './PledgeCertificate.css';

const PledgeCertificate = () => {
  const canvasRef = useRef(null);
  const nameRef = useRef(null);
  const [consent, setConsent] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generate = () => {
    const name = (nameRef.current.value || 'Anonymous').trim();
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const w = 800;
    const h = 450;
    
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, w, h);

    // Border
    ctx.strokeStyle = '#1a202c';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, w - 16, h - 16);

    // Title
    ctx.fillStyle = '#1a202c';
    ctx.font = 'bold 32px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('ANTI-DRUG PLEDGE CERTIFICATE', w / 2, 70);

    // Decorative line
    ctx.strokeStyle = '#3182ce';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 150, 90);
    ctx.lineTo(w / 2 + 150, 90);
    ctx.stroke();

    // Subtitle
    ctx.fillStyle = '#4a5568';
    ctx.font = '16px Georgia';
    ctx.fillText('This certifies that', w / 2, 130);

    // Name
    ctx.fillStyle = '#2d3748';
    ctx.font = 'italic bold 36px Georgia';
    ctx.fillText(name, w / 2, 180);

    // Name underline
    ctx.strokeStyle = '#cbd5e0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const nameWidth = ctx.measureText(name).width;
    ctx.moveTo(w / 2 - nameWidth / 2 - 20, 190);
    ctx.lineTo(w / 2 + nameWidth / 2 + 20, 190);
    ctx.stroke();

    // Body text
    ctx.font = '14px Georgia';
    ctx.fillStyle = '#4a5568';
    ctx.fillText('has pledged to live a drug-free life and inspire others', w / 2, 220);
    ctx.fillText('to make healthy choices for a better tomorrow.', w / 2, 240);

    // Date
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    ctx.font = '12px Georgia';
    ctx.fillStyle = '#718096';
    ctx.fillText(`Date: ${today}`, w / 2, 280);

    // Signature
    ctx.fillStyle = '#2d3748';
    ctx.font = 'italic 16px Georgia';
    ctx.fillText('Sudo Choices Team', w / 2, h - 40);
    
    ctx.strokeStyle = '#cbd5e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 80, h - 50);
    ctx.lineTo(w / 2 + 80, h - 50);
    ctx.stroke();

    // Badge
    ctx.fillStyle = '#3182ce';
    ctx.beginPath();
    ctx.arc(w - 50, h - 50, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px Arial';
    ctx.fillText('DRUG', w - 50, h - 55);
    ctx.fillText('FREE', w - 50, h - 44);

    setGenerated(true);
  };

  const download = () => {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'anti-drug-pledge-certificate.png';
    a.click();
  };

  const openPreview = () => {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL('image/png');
    window.open(url, '_blank');
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent('I took the Anti-Drug Pledge! Join me in making healthy choices.');
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <div className="pledge-page">
      <Navigation />
      <div className="pledge-container">
        <div className="pledge-header">
          <h1>Get Your Pledge Certificate</h1>
          <p>Create your personalized anti-drug pledge certificate.</p>
        </div>

        <div className="certificate-preview">
          <canvas ref={canvasRef} className="certificate-canvas" />
        </div>

        <div className="pledge-controls">
          <input 
            ref={nameRef} 
            type="text"
            placeholder="Enter your full name" 
            className="name-input"
            onKeyPress={(e) => e.key === 'Enter' && consent && generate()}
          />
          
          <label className="consent-checkbox">
            <input 
              type="checkbox" 
              checked={consent} 
              onChange={(e) => setConsent(e.target.checked)} 
            />
            <span>I pledge to stay away from drugs and lead a healthy life</span>
          </label>

          <div className="button-group">
            <button 
              onClick={generate} 
              disabled={!consent}
              className="btn btn-primary"
            >
              Generate Certificate
            </button>
            <button 
              onClick={download} 
              disabled={!generated}
              className="btn btn-secondary"
            >
              Download PNG
            </button>
          </div>

          <div className="button-group">
            <button 
              onClick={openPreview} 
              disabled={!generated}
              className="btn btn-outline"
            >
              Open in New Tab
            </button>
            <button 
              onClick={shareWhatsApp} 
              disabled={!generated}
              className="btn btn-outline"
            >
              Share on WhatsApp
            </button>
          </div>

          <p className="privacy-note">🔒 Your certificate is generated locally and never uploaded.</p>
        </div>
      </div>
    </div>
  );
};

export default PledgeCertificate;