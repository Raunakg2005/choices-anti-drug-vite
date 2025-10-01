import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './EndingNegative.css';

const EndingNegative = () => {
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  
  const typingTimeoutRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const navigate = useNavigate();

  const endingText = "Your story has come to a tragic end. The choices you made throughout your life led you down a path of addiction and despair. Your potential was wasted, your relationships destroyed, and your dreams never realized. This is a reminder that every choice matters, and saying no to drugs could have led to a completely different life. Thank you for experiencing this cautionary tale.";

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
    <div className="ending-negative">
      <div className="game-header">
        <button className="menu-btn" onClick={handleMenu}>
          ☰
        </button>
        <h1>Game Over - Negative Ending</h1>
      </div>

      {showMenu && (
        <div className="menu-overlay">
          <div className="menu-content">
            <button onClick={handleHome}>Home</button>
            <button onClick={handleRestart}>Restart Game</button>
            <button onClick={() => setShowMenu(false)}>Close</button>
          </div>
        </div>
      )}

      <div className="ending-container">
        <div className="ending-content">
          <div className="ending-image">
            <img 
              src="/assets/main-game/endings/negative/0.jpg"
              alt="Negative ending"
              onError={(e) => {
                console.log('Image load error:', e.target.src);
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div className="ending-text">
            <h2>The End</h2>
            <div className="story-text">
              {currentText}
              {isTyping && <span className="cursor">|</span>}
            </div>

            {showRestart && (
              <div className="ending-actions">
                <h3 style={{color: '#ff6b6b', marginBottom: '1rem'}}>Game Over</h3>
                <button className="restart-btn" onClick={handleRestart}>
                  Try Again
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

export default EndingNegative;