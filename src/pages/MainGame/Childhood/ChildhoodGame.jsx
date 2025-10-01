import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChildhoodGame.css';

const ChildhoodGame = () => {
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
    "Meet Raj, Raj is a bright and curious boy",
    "His playful days revolve around building sandcastles and catching fireflies",
    "One day... Raj finds his older brother, Ravi, acting strangely.",
    "Ravi's once vibrant eyes are glazed over, and his playful laughter has been replaced by a vacant smile.",
    "Ravi hides mysterious, colorful candies that seem to spark immense energy, followed by long periods of withdrawal and irritability.",
    "What should Raj do?"
  ];

  const imageUrls = [
    "/assets/main-game/childhood/0.png",
    "/assets/main-game/childhood/1.png",
    "/assets/main-game/childhood/2.png", 
    "/assets/main-game/childhood/3.png",
    "/assets/main-game/childhood/4.png"
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
    setIsTyping(false);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = imageUrls.map((url, index) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            resolve();
          };
          img.onerror = () => {
            reject(new Error(`Failed to load ${url}`));
          };
          img.src = url;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        setImagesLoaded(true);
      }
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

    // Do NOT forcibly cancel existing speech here — allow speech to play independently
    const utterance = new SpeechSynthesisUtterance(text);

    const setVoiceAndSpeak = () => {
      const voices = synthRef.current.getVoices();
      const femaleVoice = voices.find(
        (voice) => voice.name.includes('Female') || voice.name.includes('woman')
      ) || voices.find((voice) => voice.lang && voice.lang.startsWith('en'));

      utterance.voice = femaleVoice || voices[0];
      utterance.rate = 0.98;
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

  // Typing animation: simple timeout loop writing directly to DOM
  const updateDialogue = () => {
    if (!story[currentStoryIndex] || !dialogueRef.current) return;

    setIsTyping(true);

    // clear any prior timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    let localChar = 0;
    const length = story[currentStoryIndex].length;

    const type = () => {
      if (!dialogueRef.current) return;
      dialogueRef.current.textContent = story[currentStoryIndex].substring(0, localChar + 1);

      if (localChar < length - 1) {
        localChar += 1;
        typingTimeoutRef.current = setTimeout(type, 30);
      } else {
        // finished typing
        setIsTyping(false);
        typingTimeoutRef.current = null;

        // show choices if last line
        if (currentStoryIndex === story.length - 1) {
          setShowChoices(true);
        }
      }
    };

    // start typing
    typingTimeoutRef.current = setTimeout(type, 30);
  };

  // Handle screen clicks
  const handleScreenClick = (event) => {
    const clickedElement = event.target;
    
    // Ignore clicks on UI elements
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
      return;
    }

    if (isTyping) {
      // Finish typing instantly by clearing timeout and writing full text to the DOM
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (dialogueRef.current) dialogueRef.current.textContent = story[currentStoryIndex];
      setIsTyping(false);
    } else {
      const clickX = event.clientX;
      const halfScreenWidth = window.innerWidth / 2;

      if (clickX > halfScreenWidth) {
        // Move story forward
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
        // Go back in story
        const prevIndex = Math.max(currentStoryIndex - 1, 0);
        setCurrentStoryIndex(prevIndex);
        setShowChoices(false);
        setTimeout(updateDialogue, 100);
      }
    }
  };

  // Centralized: when intro is shown or story index changes, start speech + typing once
  useEffect(() => {
    if (!isIntroShown) return;

    // clear any pending typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    // stop previous speech to avoid overlaps
    stopSpeaking();

    const start = setTimeout(() => {
      speak(story[currentStoryIndex]);
      updateDialogue();
    }, 80);

    return () => clearTimeout(start);
  }, [isIntroShown, currentStoryIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      synthRef.current.cancel();
    };
  }, []);

  // (removed duplicate effect) centralized effect above handles story index changes

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
      // Negative choice - go to teenage negative path
      navigate('/main-game/teenage/negative');
    } else if (choice === 2) {
      // Positive choice - increase score and go to teenage positive path
      sessionStorage.setItem('userScore', (currentScore + 1).toString());
      navigate('/main-game/teenage/positive');
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
          <h1>Chapter 1: Childhood</h1>
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
              In Curiosity. He secretly eats one of Ravi's candies.
            </button>
            <button className="choice" onClick={() => makeChoice(2)}>
              With Fear and Understanding. He tells his parents about Ravi's behavior.
            </button>
          </div>
        )}

        {/* Dialogue Box */}
        {isIntroShown && (
          <div className={`dialogue-box ${isStoryTelling ? 'with-voice' : 'no-voice'}`} ref={dialogueRef}></div>
        )}
      </div>
    </div>
  );
};

export default ChildhoodGame;