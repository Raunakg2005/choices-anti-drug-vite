import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './EndingNegative.css';

const EndingNegative = () => {
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const typingTimeoutRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const storyTextRef = useRef(null);
  const navigate = useNavigate();

  
  const buildDynamicEnding = () => {
    const score = parseInt(sessionStorage.getItem('userScore') || '0');

    let recorded = null;
    try {
      const raw = sessionStorage.getItem('badChoices');
      if (raw) recorded = JSON.parse(raw);
    } catch (e) {
      recorded = null;
    }

    const stages = [
      {
        name: 'Childhood',
        consequence: 'You ignored early guidance and picked up risky habits that set the foundation for later problems.',
        actions: ['Experimented with substances at a young age', 'Skipped school and ignored caregivers', 'Began lying to cover behavior']
      },
      {
        name: 'Teenage',
        consequence: 'You gave in to peer pressure and experimented, which damaged your health and school life.',
        actions: ['Tried drugs at parties', 'Neglected studies and responsibilities', 'Started mixing with risky peers']
      },
      {
        name: 'Adult',
        consequence: 'You relied on substances to cope with stress, losing jobs and trust of loved ones.',
        actions: ['Missed work and lost jobs', 'Broke promises to family and friends', 'Used substances to numb emotions']
      },
      {
        name: 'Old age',
        consequence: 'Addiction consumed your health and relationships, leaving you isolated and unwell.',
        actions: ['Suffered chronic health decline', 'Lost close relationships', 'Lived in isolation and financial hardship']
      }
    ];

    const lines = [];
    lines.push('Your story ends tragically. Here are the consequences of the choices you made:');

    for (let i = 0; i < stages.length; i++) {
      const requiredPositives = i + 1; 

      const stageWasBad = recorded
        ? !!(recorded[stages[i].name] || recorded[stages[i].name.toLowerCase()])
        : score < requiredPositives;

      if (stageWasBad) {
        lines.push(`${i + 1}. ${stages[i].name}: ${stages[i].consequence}`);
        lines.push('   Examples of what happened:');
        for (const act of stages[i].actions) {
          lines.push(`   - ${act}`);
        }
      }
    }

    if (lines.length === 1) {
      lines.push('Throughout your life you made choices that gradually eroded your wellbeing — missed opportunities, lost relationships, and declining health. Every choice mattered.');
    }

    lines.push('\nThis is a reminder that every choice matters. Saying no to drugs can change the path of a life.');
    return lines.join('\n\n');
  };

  const endingText = buildDynamicEnding();

  const speak = (text) => {
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.6; // Slower rate for better sync
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Add event listeners to handle speech events
    utterance.onstart = () => {
      console.log('Speech started');
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      console.log('Speech ended');
      setIsSpeaking(false);
      // Clean up keep-alive interval
      if (utterance.keepAliveInterval) {
        clearInterval(utterance.keepAliveInterval);
      }
    };
    
    utterance.onerror = (event) => {
      console.error('Speech error:', event.error);
      setIsSpeaking(false);
      // Try to restart speech if it fails
      if (event.error !== 'canceled') {
        setTimeout(() => {
          synthRef.current.speak(utterance);
        }, 500);
      }
    };
    
    utterance.onpause = () => {
      console.log('Speech paused');
    };
    
    utterance.onresume = () => {
      console.log('Speech resumed');
    };
    
    // Ensure speech synthesis is ready
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    
    // Small delay to ensure clean start
    setTimeout(() => {
      synthRef.current.speak(utterance);
      
      // Workaround for browser speech synthesis timeout issue
      // Resume speech every 10 seconds to prevent cutoff
      const keepAliveInterval = setInterval(() => {
        if (synthRef.current.speaking && synthRef.current.paused) {
          synthRef.current.resume();
        } else if (!synthRef.current.speaking) {
          clearInterval(keepAliveInterval);
        }
      }, 10000);
      
      // Store interval to clean up later
      utterance.keepAliveInterval = keepAliveInterval;
    }, 100);
  };

  const typeText = (text) => {
    setIsTyping(true);
    setCurrentText('');
    let index = 0;
    
    // Calculate typing speed to match speech duration
    // Speech rate 0.6 = slower speech, but still need faster typing
    // Target: ~12-15 characters per second to match speech pace
    const charactersPerSecond = 12; // Faster to keep up with speech
    const typingSpeed = Math.max(40, 1000 / charactersPerSecond); // ~80ms per character
    
    const typeNextChar = () => {
      if (index < text.length) {
        setCurrentText(prev => {
          const newText = prev + text.charAt(index);
          // Auto-scroll to bottom after text update
          setTimeout(() => {
            if (storyTextRef.current) {
              storyTextRef.current.scrollTop = storyTextRef.current.scrollHeight;
            }
          }, 10);
          return newText;
        });
        index++;
        typingTimeoutRef.current = setTimeout(typeNextChar, typingSpeed);
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
    // Longer initial delay to ensure everything is loaded
    const startDelay = setTimeout(() => {
      // Start audio first
      speak(endingText);
      // Start typing with minimal delay to sync with speech start
      setTimeout(() => {
        typeText(endingText);
      }, 200);
    }, 1500);

    return () => {
      clearTimeout(startDelay);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (synthRef.current) {
        // Cancel any ongoing speech
        synthRef.current.cancel();
        // Clear any keep-alive intervals
        const utterances = synthRef.current.getVoices(); // This helps ensure cleanup
      }
      setIsSpeaking(false);
    };
  }, [endingText]);

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
            <div className="story-text" ref={storyTextRef}>
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