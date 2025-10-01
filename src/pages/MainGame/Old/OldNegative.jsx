import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './OldNegative.css';

const OldNegative = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isIntroShown, setIsIntroShown] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const typingTimeoutRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const navigate = useNavigate();

  const story = [
    "Years of drug abuse have taken their toll. Your body is failing, your relationships destroyed.",
    "You sit alone in a rundown apartment, counting the mistakes of your past.",
    "The drugs that once seemed to solve your problems have become your greatest enemy.",
    "Your health is deteriorating rapidly. You struggle to perform even basic daily tasks.",
    "Everyone you once cared about has given up on you. You are completely isolated.",
    "Looking in the mirror, you barely recognize the person staring back at you.",
    "Your final days are approaching, filled with regret and the consequences of your choices.",
    "This is not the life you dreamed of as a child. Your story ends in tragedy."
  ];

  const choices = [
    [
      { text: "Try to seek help one last time", next: 1 },
      { text: "Accept your fate", next: 2 }
    ],
    [
      { text: "Call a rehabilitation center", next: 3 },
      { text: "Reach out to family", next: 4 }
    ],
    [
      { text: "Reflect on your life", next: 5 },
      { text: "Give up completely", next: 6 }
    ],
    [
      { text: "Enter treatment", next: 7 },
      { text: "Change your mind", next: 5 }
    ],
    [
      { text: "Try to make amends", next: 7 },
      { text: "Face rejection", next: 6 }
    ],
    [
      { text: "Find some peace", next: 7 },
      { text: "Spiral deeper", next: 6 }
    ],
    [
      { text: "Continue to ending", action: 'ending-negative' }
    ],
    [
      { text: "Continue to ending", action: 'ending-negative' }
    ]
  ];

  const preloadImages = () => {
    for (let i = 0; i <= 3; i++) {
      const img = new Image();
      img.src = `/assets/main-game/old/negative/${i}.jpg`;
    }
  };

  const speak = (text) => {
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    synthRef.current.speak(utterance);
  };

  const typeText = (text, callback) => {
    setIsTyping(true);
    setCurrentText('');
    let index = 0;
    
    const typeNextChar = () => {
      if (index < text.length) {
        setCurrentText(text.substring(0, index + 1));
        index++;
        typingTimeoutRef.current = setTimeout(typeNextChar, 30);
      } else {
        setIsTyping(false);
        if (callback) callback();
      }
    };
    
    typeNextChar();
  };

  const updateDialogue = () => {
    if (currentStoryIndex < story.length) {
      const text = story[currentStoryIndex];
      speak(text);
      typeText(text, () => {
        setTimeout(() => {
          if (choices[currentStoryIndex] && choices[currentStoryIndex].length > 0) {
            setShowChoices(true);
          } else if (currentStoryIndex < story.length - 1) {
            // Auto continue to next story after 2 seconds only if not at end
            setTimeout(() => {
              setCurrentStoryIndex(prev => prev + 1);
            }, 2000);
          }
        }, 500);
      });
    }
  };

  const handleChoice = (choice) => {
    setShowChoices(false);
    
    if (choice.action === 'ending-negative') {
      navigate('/main-game/ending/negative');
      return;
    }
    
    if (choice.next !== undefined) {
      setCurrentStoryIndex(choice.next);
    }
  };

  const handleStartGame = () => {
    setIsIntroShown(true);
    preloadImages();
    setTimeout(() => {
      speak(story[0]);
      updateDialogue();
    }, 100);
  };

  const handleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleHome = () => {
    navigate('/');
  };

  // Mobile detection and reset state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Reset game state on mount
    setCurrentStoryIndex(0);
    setIsIntroShown(false);
    setShowChoices(false);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isIntroShown && currentStoryIndex > 0) {
      updateDialogue();
    }
  }, [currentStoryIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      synthRef.current.cancel();
    };
  }, []);

  const getImageIndex = () => {
    return Math.min(Math.floor(currentStoryIndex / 2), 3);
  };

  return (
    <div className="old-negative">
      <div className="game-header">
        <button className="menu-btn" onClick={handleMenu}>
          ☰
        </button>
        <h1>Old Age - The Final Chapter</h1>
      </div>

      {showMenu && (
        <div className="menu-overlay">
          <div className="menu-content">
            <button onClick={handleHome}>Home</button>
            <button onClick={() => setShowMenu(false)}>Close</button>
          </div>
        </div>
      )}

      <div className="game-container">
        {!isIntroShown ? (
          <div className="intro-screen">
            <div className="intro-content">
              <h2>Old Age - Negative Path</h2>
              <p>The consequences of a lifetime of poor choices.</p>
              <button className="start-btn" onClick={handleStartGame}>
                Start Chapter
              </button>
            </div>
          </div>
        ) : (
          <div className="story-section">
            <div className="story-image">
              <img 
                src={`/assets/main-game/old/negative/${getImageIndex()}.jpg`}
                alt={`Old age scene ${getImageIndex()}`}
                onError={(e) => {
                  console.log('Image load error:', e.target.src);
                  e.target.style.display = 'none';
                }}
              />
            </div>

            <div className="dialogue-section">
              <div className="dialogue-box">
                <div className="dialogue-text">
                  {currentText}
                  {isTyping && <span className="cursor">|</span>}
                </div>
              </div>

              {showChoices && choices[currentStoryIndex] && (
                <div className="choices">
                  {choices[currentStoryIndex].map((choice, index) => (
                    <button 
                      key={index}
                      className="choice-btn"
                      onClick={() => handleChoice(choice)}
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OldNegative;