import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './EndingPositive.css';

const EndingPositive = () => {
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  
  const typingTimeoutRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const navigate = useNavigate();

  const endingText = "Congratulations! You have successfully completed your journey through life by making wise choices and staying away from drugs. Your story is one of triumph, showing how saying 'no' to drugs opened doors to education, meaningful relationships, career success, and a fulfilling life. You became a positive influence in your community and left a lasting legacy for future generations. Thank you for choosing the path of wisdom and demonstrating that life without drugs is not only possible, but incredibly rewarding.";

  const speak = (text) => {
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    synthRef.current.speak(utterance);
  };

  const typeText = (text) => {
    setIsTyping(true);
    setCurrentText('');
    let index = 0;
    
    const typeNextChar = () => {
      if (index < text.length) {
        setCurrentText(prev => prev + text.charAt(index));
        index++;
        typingTimeoutRef.current = setTimeout(typeNextChar, 50);
      } else {
        setIsTyping(false);
        setTimeout(() => {
          setShowRestart(true);
        }, 2000);
      }
    };
    
    typeNextChar();
  };

  const handleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleRestart = () => {
    navigate('/main-game/childhood');
  };

  const handlePledge = () => {
    navigate('/pledge-certificate');
  };

  useEffect(() => {
    setTimeout(() => {
      speak(endingText);
      typeText(endingText);
    }, 1000);

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      synthRef.current.cancel();
    };
  }, []);

  return (
    <div className="ending-positive">
      <div className="game-header">
        <button className="menu-btn" onClick={handleMenu}>
          ☰
        </button>
        <h1>Victory! - Positive Ending</h1>
      </div>

      {showMenu && (
        <div className="menu-overlay">
          <div className="menu-content">
            <button onClick={handleHome}>Home</button>
            <button onClick={handleRestart}>Restart Game</button>
            <button onClick={handlePledge}>Get Certificate</button>
            <button onClick={() => setShowMenu(false)}>Close</button>
          </div>
        </div>
      )}

      <div className="ending-container">
        <div className="ending-content">
          <div className="ending-image">
            <img 
              src="/assets/main-game/endings/positive/0.jpg"
              alt="Positive ending"
              onError={(e) => {
                console.log('Image load error:', e.target.src);
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div className="ending-text">
            <h2>Victory!</h2>
            <div className="story-text">
              {currentText}
              {isTyping && <span className="cursor">|</span>}
            </div>

            {showRestart && (
              <div className="ending-actions">
                <button className="certificate-btn" onClick={handlePledge}>
                  Get Certificate
                </button>
                <button className="restart-btn" onClick={handleRestart}>
                  Play Again
                </button>
                <button className="home-btn" onClick={handleHome}>
                  Return Home
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndingPositive;