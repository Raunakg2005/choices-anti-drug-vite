import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Childhood/ChildhoodGame.css';

const OldPositive = () => {
  const navigate = useNavigate();
  const [isIntroShown, setIsIntroShown] = useState(false);
  const [isMenuShown, setIsMenuShown] = useState(false);
  const [isFullScreenMsgShown, setIsFullScreenMsgShown] = useState(true);
  const [isStoryTelling, setIsStoryTelling] = useState(
    localStorage.getItem('isStorytelling') === 'true' || true
  );
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [showOutro, setShowOutro] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const dialogueRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  const story = [
    "Raj is now old and 70 years old. He has been living a healthy life. He has good family and friends.",
    "He has seen all the ups and downs of life. He has been able to overcome all the challenges of life.",
    "also he guides his younger generation to live a healthy life, and consult with parents and professionals if they face any wrong situations in life.",
    "with all the cherishable memories and happiness he dies at the age of 80. having many loved ones around him."
  ];

  const imageUrls = [
    "/assets/main-game/old/Positive/0.jpg",
    "/assets/main-game/old/Positive/1.jpg",
    "/assets/main-game/old/Positive/2.jpg", 
    "/assets/main-game/old/Positive/3.jpg"
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
    setShowOutro(false);
    setIsTyping(false);
    
    // Initialize speech synthesis voices
    if (synthRef.current.getVoices().length === 0) {
      synthRef.current.addEventListener('voiceschanged', () => {
        console.log('🎭 Voices loaded:', synthRef.current.getVoices().length);
      }, { once: true });
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const preloadImages = async () => {
      console.log('Starting Old Positive image preload...');
      console.log('Image URLs to load:', imageUrls);
      
      const imagePromises = imageUrls.map((url, index) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            console.log(`✓ Old Positive image ${index} loaded:`, url);
            resolve();
          };
          img.onerror = (error) => {
            console.error(`✗ Old Positive image ${index} FAILED to load:`, url, error);
            resolve();
          };
          console.log(`Attempting to load image ${index}:`, url);
          img.src = url;
        });
      });
      
      await Promise.all(imagePromises);
      console.log('Old Positive: All images processed, setting imagesLoaded = true');
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

  // Speech synthesis with better synchronization
  const speak = (text) => {
    if (!isStoryTelling || isMobile) {
      console.log('Speech skipped - storytelling:', isStoryTelling, 'mobile:', isMobile);
      return;
    }
    
    console.log('🎙️ Speaking text:', text);
    
    // Stop any current speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Wait for voices to load
    const setVoiceAndSpeak = () => {
      const voices = synthRef.current.getVoices();
      console.log('Available voices:', voices.length);
      
      // Try to find a good English voice
      const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
      const femaleVoice = englishVoices.find(
        (voice) => voice.name.toLowerCase().includes('female') || 
                   voice.name.toLowerCase().includes('woman') ||
                   voice.name.toLowerCase().includes('zira') ||
                   voice.name.toLowerCase().includes('hazel')
      );
      
      const selectedVoice = femaleVoice || englishVoices[0] || voices[0];
      
      if (selectedVoice) {
        console.log('🎤 Using voice:', selectedVoice.name, 'Language:', selectedVoice.lang);
        utterance.voice = selectedVoice;
      }
      
      // Optimize speech settings for better sync
      utterance.rate = 0.8; // Slightly slower to match typing
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      
      utterance.onstart = () => {
        console.log('🎵 Speech started for:', text.substring(0, 20) + '...');
      };
      
      utterance.onend = () => {
        console.log('🔇 Speech ended');
      };
      
      utterance.onerror = (e) => {
        console.error('❌ Speech error:', e.error, e.type);
      };
      
      utterance.onpause = () => {
        console.log('⏸️ Speech paused');
      };
      
      utterance.onresume = () => {
        console.log('▶️ Speech resumed');
      };
      
      // Use timeout to ensure speech starts
      setTimeout(() => {
        synthRef.current.speak(utterance);
      }, 50);
    };
    
    if (synthRef.current.getVoices().length === 0) {
      console.log('Waiting for voices to load...');
      synthRef.current.addEventListener('voiceschanged', setVoiceAndSpeak, { once: true });
    } else {
      setVoiceAndSpeak();
    }
  };

  const stopSpeaking = () => {
    synthRef.current.cancel();
  };

  // Typing animation with synchronized speech
  const updateDialogue = () => {
    if (!story[currentStoryIndex] || !dialogueRef.current) return;

    console.log('Updating dialogue for story index:', currentStoryIndex);
    console.log('Story text:', story[currentStoryIndex]);

    setIsTyping(true);

    // Clear any existing timeouts
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    // Clear dialogue box first
    dialogueRef.current.textContent = '';

    const text = story[currentStoryIndex];
    // Start speech synthesis with a small delay to sync with typing
    setTimeout(() => {
      speak(text);
    }, 100);

    let localChar = 0;
    const length = text.length;
    const typeSpeed = 30; // consistent speed across pages

    const type = () => {
      if (!dialogueRef.current) return;
      dialogueRef.current.textContent = text.substring(0, localChar + 1);

      if (localChar < length - 1) {
        localChar += 1;
        typingTimeoutRef.current = setTimeout(type, typeSpeed);
      } else {
        setIsTyping(false);
        typingTimeoutRef.current = null;
        // End-of-story behavior
        if (currentStoryIndex === story.length - 1) {
          setTimeout(() => {
            setShowOutro(true);
            setIsStoryTelling(false);
          }, 2000);
        }
      }
    };

    typingTimeoutRef.current = setTimeout(type, typeSpeed);
  };

  // Centralized: when intro is shown or story index changes, start speech + typing once
  useEffect(() => {
    if (!isIntroShown) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

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

  // Screen click handler
  const handleScreenClick = (event) => {
    const clickedElement = event.target;
    
    // Handle outro click
    if (clickedElement.closest('.outro')) {
      navigate('/pledge-certificate');
      return;
    }
    
    // Ignore clicks on UI elements
    if (
      clickedElement.closest('.menu-icon') ||
      clickedElement.closest('.menu-items') ||
      clickedElement.closest('.choice-box') ||
      clickedElement.closest('.fullscreen-msg') ||
      clickedElement.closest('.mobile-popup')
    ) {
      return;
    }

    if (!isIntroShown) {
      setIsIntroShown(true);
      return;
    }

    // Don't allow clicks if outro is shown
    if (showOutro) {
      return;
    }

    if (isTyping) {
      // Finish typing instantly but keep speech going
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (dialogueRef.current) {
        dialogueRef.current.textContent = story[currentStoryIndex];
      }
      setIsTyping(false);
      console.log('💨 Typing finished instantly, speech continues...');
      // If last line, schedule outro (keep existing timing)
      if (currentStoryIndex === story.length - 1) {
        setTimeout(() => {
          setShowOutro(true);
          setIsStoryTelling(false);
        }, 2000);
      }
    } else {
      const clickX = event.clientX;
      const halfScreenWidth = window.innerWidth / 2;

      if (clickX > halfScreenWidth) {
        // Move story forward
        const nextIndex = Math.min(currentStoryIndex + 1, story.length - 1);
        setCurrentStoryIndex(nextIndex);
        stopSpeaking();
        setIsMenuShown(false);
      } else {
        // Go back in story
        const prevIndex = Math.max(currentStoryIndex - 1, 0);
        setCurrentStoryIndex(prevIndex);
        setShowChoices(false);
        setShowOutro(false);
      }
    }
  };

  // Menu functions
  const toggleMenu = () => {
    setIsMenuShown(!isMenuShown);
  };

  const toggleStoryTeller = () => {
    const newValue = !isStoryTelling;
    setIsStoryTelling(newValue);
    localStorage.setItem('isStorytelling', newValue.toString());
    console.log('Story teller toggled to:', newValue);
    if (!newValue) {
      stopSpeaking();
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="childhood-game" onClick={handleScreenClick}>
      {/* Fullscreen Message */}
      {isFullScreenMsgShown && !isMobile && (
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
          <h1>Chapter 4: Old Age - Positive Path</h1>
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

      {/* Outro Screen */}
      {showOutro && (
        <div className="outro">
          <h1>Congratulations!</h1>
          <p>Raj lived a full and meaningful life, surrounded by loved ones.</p>
          <p>Click to get your completion certificate</p>
        </div>
      )}

      {/* Game Container */}
      <div className="gamecontainer">
        <div 
          className="background"
          style={{
            backgroundImage: `url(${imageUrls[Math.min(currentStoryIndex, imageUrls.length - 1)]})`
          }}
          onLoad={() => console.log('Background image loaded:', imageUrls[Math.min(currentStoryIndex, imageUrls.length - 1)])}
          onError={() => console.error('Background image failed:', imageUrls[Math.min(currentStoryIndex, imageUrls.length - 1)])}
        ></div>

        {isIntroShown && !showOutro && (
          <div className="dialogue-box" ref={dialogueRef}></div>
        )}
      </div>
    </div>
  );
};

export default OldPositive;