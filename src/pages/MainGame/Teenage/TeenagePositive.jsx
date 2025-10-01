import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Childhood/ChildhoodGame.css';

const TeenagePositive = () => {
  const navigate = useNavigate();
  const [isIntroShown, setIsIntroShown] = useState(false);
  const [isMenuShown, setIsMenuShown] = useState(false);
  const [isFullScreenMsgShown, setIsFullScreenMsgShown] = useState(true);
  const [isStoryTelling, setIsStoryTelling] = useState(
    localStorage.getItem('isStorytelling') === 'true' || true
  );
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentCharacter, setCurrentCharacter] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const dialogueRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  const story = [
    "Years have passed. Raj, now a teenager and 15 years old",
    "His parents have been able to help Ravi overcome his addiction. Raj has learned from his brother's experience and is more aware of the dangers of drugs.",
    "At school, a charismatic group promises acceptance and escape from everyday pressures.",
    "They share a seemingly harmless powder that boosts confidence and makes the mundane exciting. Friends offer Raj the powder.",
    "What should Raj do?"
  ];

  const imageUrls = [
    "/assets/main-game/teenage/Positive/assets/0.jpg",
    "/assets/main-game/teenage/Positive/assets/1.jpg",
    "/assets/main-game/teenage/Positive/assets/2.jpg", 
    "/assets/main-game/teenage/Positive/assets/3.jpg"
  ];



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
    const preloadImages = async () => {
      const imagePromises = imageUrls.map((url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = url;
        });
      });
      await Promise.all(imagePromises);
      setImagesLoaded(true);
    };
    preloadImages();
  }, []);

  // Handle fullscreen message hiding
  useEffect(() => {
    if (!isMobile && imagesLoaded) {
      const timer = setTimeout(() => setIsFullScreenMsgShown(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, imagesLoaded]);

  // Speech synthesis
  const speak = (text) => {
    if (!isStoryTelling || isMobile) return;
    
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    const setVoiceAndSpeak = () => {
      const voices = synthRef.current.getVoices();
      const femaleVoice = voices.find(
        (voice) => voice.name.includes('Female') || voice.name.includes('woman')
      ) || voices.find(
        (voice) => voice.lang.startsWith('en')
      );
      
      utterance.voice = femaleVoice || voices[0];
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      synthRef.current.speak(utterance);
    };
    
    if (synthRef.current.getVoices().length === 0) {
      synthRef.current.addEventListener('voiceschanged', setVoiceAndSpeak, { once: true });
    } else {
      setVoiceAndSpeak();
    }
  };

  const stopSpeaking = () => {
    synthRef.current.cancel();
  };

  // Typing animation
  const updateDialogue = () => {
    if (!story[currentStoryIndex] || !dialogueRef.current) return;
    
    setIsTyping(true);
    setCurrentCharacter(0);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    const type = () => {
      if (dialogueRef.current && story[currentStoryIndex]) {
        const text = story[currentStoryIndex].substring(0, currentCharacter + 1);
        dialogueRef.current.textContent = text;

      }
      
      if (currentCharacter < story[currentStoryIndex].length - 1) {
        setCurrentCharacter(prev => prev + 1);
        typingTimeoutRef.current = setTimeout(type, 30);
      } else {
        setIsTyping(false);
        // Auto continue after typing finishes if no choices
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
      }
    };

    type();
  };

  // Handle screen clicks
  const handleScreenClick = (event) => {
    const clickedElement = event.target;
    
    if (
      clickedElement.closest('.menu-icon') ||
      clickedElement.closest('.menu-items') ||
      clickedElement.closest('.choice-box') ||
      clickedElement.closest('.fullscreen-msg')
    ) {
      return;
    }

    if (!isIntroShown) {
      setIsIntroShown(true);
      setTimeout(() => {
        speak(story[0]);
        updateDialogue();
      }, 300);
      return;
    }

    if (isTyping) {
      clearTimeout(typingTimeoutRef.current);
      setCurrentCharacter(story[currentStoryIndex].length);
      if (dialogueRef.current) {
        dialogueRef.current.textContent = story[currentStoryIndex];
      }
      setIsTyping(false);
    } else {
      const clickX = event.clientX;
      const halfScreenWidth = window.innerWidth / 2;

      if (clickX > halfScreenWidth) {
        const nextIndex = Math.min(currentStoryIndex + 1, story.length - 1);
        setCurrentStoryIndex(nextIndex);
        stopSpeaking();
        setIsMenuShown(false);
        
        if (nextIndex < story.length - 1) {
          speak(story[nextIndex]);
        }
        
        setTimeout(updateDialogue, 100);
        
        if (nextIndex === story.length - 1) {
          setShowChoices(true);
        }
      } else {
        const prevIndex = Math.max(currentStoryIndex - 1, 0);
        setCurrentStoryIndex(prevIndex);
        setShowChoices(false);
        setTimeout(updateDialogue, 100);
      }
    }
  };

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

  const toggleMenu = () => {
    setIsMenuShown(!isMenuShown);
  };

  const toggleStoryTeller = () => {
    const newValue = !isStoryTelling;
    setIsStoryTelling(newValue);
    localStorage.setItem('isStorytelling', newValue);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreenMsgShown(false);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const makeChoice = (choice) => {
    let currentScore = parseInt(sessionStorage.getItem('userScore') || '0');
    
    if (choice === 1) {
      // Negative choice - go to adult negative path
      navigate('/main-game/adult/negative');
    } else if (choice === 2) {
      // Positive choice - increase score and go to adult positive path
      sessionStorage.setItem('userScore', (currentScore + 1).toString());
      navigate('/main-game/adult/positive');
    }
  };

  if (!imagesLoaded) {
    return (
      <div className="loading-screen">
        <div className="loading-animation">Loading...</div>
      </div>
    );
  }

  return (
    <div className="childhood-game" onClick={handleScreenClick}>
      {/* Fullscreen Message */}
      {isFullScreenMsgShown && (
        <div className="fullscreen-msg">
          <h2>Game is best played in fullscreen mode <br />Click for Fullscreen mode</h2>
          <div className="fullscreen-btn" onClick={toggleFullScreen}>
            <label>Fullscreen</label>
            <img src="/assets/Fit Screen.gif" alt="fullscreen-icon" />
          </div>
          <div className="loading-bar"></div>
        </div>
      )}

      {/* Menu Icon */}
      <div className="menu-icon" onClick={toggleMenu}>
        <img src={isMenuShown ? "/assets/cross-icon.png" : "/assets/menu-icon.png"} alt="menu" />
      </div>

      {/* Menu Items */}
      {isMenuShown && (
        <div className="menu-items">
          <div className="menu-item-container">
            <div className="menu-item">Story Teller</div>
            <div 
              className="toggle-button-story"
              onClick={toggleStoryTeller}
              style={{
                backgroundColor: isStoryTelling ? 'green' : 'transparent'
              }}
            >
              {isStoryTelling ? 'ON' : 'OFF'}
            </div>
          </div>
          <div className="menu-item-container">
            <div className="menu-item">Full Screen</div>
            <div className="toggle-button-fullscreen" onClick={toggleFullScreen}>
              OFF
            </div>
          </div>
          <div className="menu-footer">
            <a href="/" target="_blank">
              <div className="team-logo">
                <img src="/assets/sudo.png" alt="Sudo Logo" />
              </div>
            </a>
            <a href="https://github.com/spark-lucifer/Choices-an-Anti-Drug-Adventure" target="_blank" rel="noopener noreferrer">
              <div className="repo-link">
                <p>Project Repository</p>
                <img src="/assets/github.png" alt="Project Repository" />
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Intro Screen */}
      {!isIntroShown && (
        <div className="intro">
          <h1>Chapter 2: Teenage - Positive Path</h1>
          <div className="right-half blink"></div>
          <div className="instructions">
            <p>You can turn off the story teller from Menu on top right</p>
            <p>Click on right half of screen to continue</p>
          </div>
        </div>
      )}

      {/* Mobile Popup */}
      {isMobile && (
        <div className="mobile-popup">
          <p>This Game is meant to be played in landscape mode please tilt your device and reload the page</p>
          <img src="/assets/tilt.gif" alt="tilt-icon" className="tilt-icon" />
        </div>
      )}

      {/* Game Container */}
      <div className="gamecontainer">
        <div 
          className="background"
          style={{
            backgroundImage: `url(${imageUrls[Math.min(currentStoryIndex, imageUrls.length - 1)]})`
          }}
        ></div>

        {/* Choice Box */}
        {showChoices && (
          <div className="choice-box">
            <button className="choice" onClick={() => makeChoice(1)}>
              He tries the powder, thinking it's harmless.
            </button>
            <button className="choice" onClick={() => makeChoice(2)}>
              He remembers his brother's struggle and refuses the offer.
            </button>
          </div>
        )}

        {isIntroShown && <div className="dialogue-box" ref={dialogueRef}></div>}
      </div>
    </div>
  );
};

export default TeenagePositive;