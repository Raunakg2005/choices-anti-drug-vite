import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Childhood/ChildhoodGame.css';

const AdultPositive = () => {
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
    "Raj is now in adult phase of his life and 25 Years old.",
    "He is living a healthy life, after finishing his education he has landed a good job.",
    "He has good family and friends.",
    "But the Job where he currently works is very stressful.",
    "What should Raj do?"
  ];

  const imageUrls = [
    "/assets/main-game/adult/Positive/assets/0.jpg",
    "/assets/main-game/adult/Positive/assets/1.jpg",
    "/assets/main-game/adult/Positive/assets/2.jpg", 
    "/assets/main-game/adult/Positive/assets/3.jpg",
    "/assets/main-game/adult/Positive/assets/4.jpg"
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
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthRef.current.getVoices();
    utterance.voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    utterance.rate = 0.9;
    synthRef.current.speak(utterance);
  };

  const updateDialogue = () => {
    if (!story[currentStoryIndex] || !dialogueRef.current) return;
    setIsTyping(true);
    setCurrentCharacter(0);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    const type = () => {
      if (dialogueRef.current && story[currentStoryIndex]) {
        dialogueRef.current.textContent = story[currentStoryIndex].substring(0, currentCharacter + 1);
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

  const handleScreenClick = (event) => {
    const clickedElement = event.target;
    if (clickedElement.closest('.menu-icon') || clickedElement.closest('.menu-items') ||
        clickedElement.closest('.choice-box') || clickedElement.closest('.fullscreen-msg')) return;

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
      if (dialogueRef.current) dialogueRef.current.textContent = story[currentStoryIndex];
      setIsTyping(false);
    } else {
      const clickX = event.clientX;
      const halfScreenWidth = window.innerWidth / 2;

      if (clickX > halfScreenWidth) {
        const nextIndex = Math.min(currentStoryIndex + 1, story.length - 1);
        setCurrentStoryIndex(nextIndex);
        synthRef.current.cancel();
        
        if (nextIndex < story.length - 1) speak(story[nextIndex]);
        setTimeout(updateDialogue, 100);
        if (nextIndex === story.length - 1) setShowChoices(true);
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
          <h1>Chapter 3: Adult - Positive Path</h1>
          <div className="right-half blink"></div>
          <div className="instructions">
            <p>Click on right half of screen to continue</p>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="mobile-popup">
          <p>This Game is meant to be played in landscape mode</p>
        </div>
      )}

      <div className="gamecontainer">
        <div className="background" style={{
          backgroundImage: `url(${imageUrls[Math.min(currentStoryIndex, imageUrls.length - 1)]})`
        }}></div>

        {showChoices && (
          <div className="choice-box">
            <button className="choice" onClick={() => makeChoice(1)}>
              He turns to substances to cope with stress.
            </button>
            <button className="choice" onClick={() => makeChoice(2)}>
              He finds healthy ways to manage stress through exercise and meditation.
            </button>
          </div>
        )}

        {isIntroShown && <div className="dialogue-box" ref={dialogueRef}></div>}
      </div>
    </div>
  );
};

export default AdultPositive;