import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Childhood/ChildhoodGame.css';

const AdultNegative = () => {
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
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const dialogueRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  const story = [
    "Raj is now in adult phase of his life, and 25 years old.",
    "He has been using the powder for years. He has become dependent on it to function.",
    "Due to this addiction, it has become difficult for him to make correct decisions. He is not able to resist the temptation of drugs.",
    "One day, his old friend from school days appears seeing condition of Raj he advises him to seek professional help.",
    "What should Raj do?"
  ];

  const imageUrls = [
    "/assets/main-game/adult/Negative/assets/0.jpg",
    "/assets/main-game/adult/Negative/assets/1.jpg",
    "/assets/main-game/adult/Negative/assets/2.jpg", 
    "/assets/main-game/adult/Negative/assets/3.jpg"
  ];

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    setCurrentStoryIndex(0);
    setIsIntroShown(false);
    setShowChoices(false);
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

  useEffect(() => {
    if (!isMobile && imagesLoaded) {
      const timer = setTimeout(() => setIsFullScreenMsgShown(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, imagesLoaded]);

  const speak = (text) => {
    if (!isStoryTelling || isMobile) return;

    const utterance = new SpeechSynthesisUtterance(text);

    const setVoiceAndSpeak = () => {
      const voices = synthRef.current.getVoices();
      utterance.voice = voices.find(v => v.lang && v.lang.startsWith && v.lang.startsWith('en')) || voices[0];
      utterance.rate = 0.98;
      synthRef.current.speak(utterance);
    };

    if (synthRef.current.getVoices().length === 0) {
      synthRef.current.addEventListener('voiceschanged', setVoiceAndSpeak, { once: true });
    } else {
      setVoiceAndSpeak();
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current && synthRef.current.cancel) synthRef.current.cancel();
  };

  const updateDialogue = () => {
    if (!story[currentStoryIndex] || !dialogueRef.current) return;
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    const fullText = story[currentStoryIndex];
    let idx = 0;
    dialogueRef.current.textContent = '';

    const type = () => {
      if (!dialogueRef.current) return;
      idx += 1;
      dialogueRef.current.textContent = fullText.substring(0, idx);
      if (idx < fullText.length) {
        typingTimeoutRef.current = setTimeout(type, 30);
        } else {
          setIsTyping(false);
          // If this is the final line, reveal choices. Otherwise wait for user click to advance (no auto-advance)
          if (currentStoryIndex === story.length - 1) {
            setShowChoices(true);
          }
      }
    };

    // start typing after a short delay to match other chapters
    typingTimeoutRef.current = setTimeout(type, 30);
  };

  const handleScreenClick = (event) => {
    const clickedElement = event.target;
    if (clickedElement.closest('.menu-icon') || clickedElement.closest('.menu-items') || 
        clickedElement.closest('.choice-box') || clickedElement.closest('.fullscreen-msg')) return;

    if (!isIntroShown) {
      setIsIntroShown(true);
      // centralized effect will kick off speak/updateDialogue when isIntroShown becomes true
      return;
    }

    if (isTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (dialogueRef.current) dialogueRef.current.textContent = story[currentStoryIndex];
      setIsTyping(false);
      // If this is the final line, reveal choices immediately
      if (currentStoryIndex === story.length - 1) setShowChoices(true);
    } else {
      const clickX = event.clientX;
      const halfScreenWidth = window.innerWidth / 2;

      if (clickX > halfScreenWidth) {
        const nextIndex = Math.min(currentStoryIndex + 1, story.length - 1);
        setCurrentStoryIndex(nextIndex);
        setIsMenuShown(false);
        setShowChoices(false);
        // centralized effect will handle speak/updateDialogue for the new index
      } else {
        const prevIndex = Math.max(currentStoryIndex - 1, 0);
        setCurrentStoryIndex(prevIndex);
        setShowChoices(false);
      }
    }
  };

  // Centralized effect: when intro is shown and story index changes, start speech and typing
  useEffect(() => {
    if (!isIntroShown) return;
    // Stop previous speech to avoid overlaps, then speak current line and begin typing.
    stopSpeaking();
    const t = setTimeout(() => {
      speak(story[currentStoryIndex]);
      updateDialogue();
    }, 80);
    return () => clearTimeout(t);
  }, [isIntroShown, currentStoryIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      synthRef.current.cancel();
    };
  }, []);

  const makeChoice = (choice) => {
    if (choice === 1) {
      navigate('/main-game/old/negative');
    } else {
      let score = parseInt(sessionStorage.getItem('userScore') || '0');
      sessionStorage.setItem('userScore', (score + 1).toString());
      navigate('/main-game/old/positive');
    }
  };

  if (!imagesLoaded) {
    return <div className="loading-screen"><div className="loading-animation">Loading...</div></div>;
  }

  return (
    <div className="childhood-game" onClick={handleScreenClick}>
      {isFullScreenMsgShown && (
        <div className="fullscreen-msg">
          <h2>Game is best played in fullscreen mode <br />Click for Fullscreen mode</h2>
          <div className="fullscreen-btn" onClick={() => {
            document.documentElement.requestFullscreen();
            setIsFullScreenMsgShown(false);
          }}>
            <label>Fullscreen</label>
            <img src="/assets/Fit Screen.gif" alt="fullscreen-icon" />
          </div>
          <div className="loading-bar"></div>
        </div>
      )}

      <div className="menu-icon" onClick={() => setIsMenuShown(!isMenuShown)}>
        <img src={isMenuShown ? "/assets/cross-icon.png" : "/assets/menu-icon.png"} alt="menu" />
      </div>

      {isMenuShown && (
        <div className="menu-items">
          <div className="menu-item-container">
            <div className="menu-item">Story Teller</div>
            <div className="toggle-button-story" onClick={() => {
              const newValue = !isStoryTelling;
              setIsStoryTelling(newValue);
              localStorage.setItem('isStorytelling', newValue);
            }} style={{ backgroundColor: isStoryTelling ? 'green' : 'transparent' }}>
              {isStoryTelling ? 'ON' : 'OFF'}
            </div>
          </div>
        </div>
      )}

      {!isIntroShown && (
        <div className="intro">
          <h1>Chapter 3: Adult - Negative Path</h1>
          <div className="right-half blink"></div>
          <div className="instructions">
            <p>Click on right half of screen to continue</p>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="mobile-popup">
          <p>This Game is meant to be played in landscape mode</p>
          <img src="/assets/tilt.gif" alt="tilt-icon" className="tilt-icon" />
        </div>
      )}

      <div className="gamecontainer">
        <div className="background" style={{
          backgroundImage: `url(${imageUrls[Math.min(currentStoryIndex, imageUrls.length - 1)]})`
        }}></div>

        {showChoices && (
          <div className="choice-box">
            <button className="choice" onClick={() => makeChoice(1)}>
              He ignores the friend's advice and continues with his addiction.
            </button>
            <button className="choice" onClick={() => makeChoice(2)}>
              He takes the friend's advice and seeks professional help.
            </button>
          </div>
        )}

        {isIntroShown && <div className="dialogue-box" ref={dialogueRef}></div>}
      </div>
    </div>
  );
};

export default AdultNegative;