import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './OldNegative.css';

const OldNegative = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isIntroShown, setIsIntroShown] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isFullScreenMsgShown, setIsFullScreenMsgShown] = useState(true);
  const [isStoryTelling, setIsStoryTelling] = useState(
    localStorage.getItem('isStorytelling') === 'true' || true
  );
  
  const typingTimeoutRef = useRef(null);
  const dialogueRef = useRef(null);
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

  const imageUrls = [
    '/assets/main-game/old/Negative/0.jpg',
    '/assets/main-game/old/Negative/1.jpg',
    '/assets/main-game/old/Negative/2.jpg',
    '/assets/main-game/old/Negative/3.jpg',
    '/assets/main-game/old/Negative/4.jpg',
  ];

  const preloadImages = async () => {
    const promises = imageUrls.map((url) => new Promise((resolve) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve;
      img.src = url;
    }));
    await Promise.all(promises);
    setImagesLoaded(true);
  };

  const speak = (text) => {
    if (!isStoryTelling || isMobile) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const setVoiceAndSpeak = () => {
      const voices = synthRef.current.getVoices();
      utterance.voice = voices.find(v => v.lang && v.lang.startsWith && v.lang.startsWith('en')) || voices[0];
      utterance.rate = 0.98;
      utterance.pitch = 1;
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
        // Show choices only on final line
        if (currentStoryIndex === story.length - 1) setShowChoices(true);
      }
    };

    typingTimeoutRef.current = setTimeout(type, 30);
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

  const handleScreenClick = (event) => {
    const clickedElement = event.target;
    if (clickedElement.closest && (clickedElement.closest('.menu-icon') || clickedElement.closest('.menu-items') || clickedElement.closest('.choice-box') || clickedElement.closest('.fullscreen-msg'))) return;

    if (!isIntroShown) {
      setIsIntroShown(true);
      preloadImages();
      return;
    }

    if (isTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (dialogueRef.current) dialogueRef.current.textContent = story[currentStoryIndex];
      setIsTyping(false);
      if (currentStoryIndex === story.length - 1) setShowChoices(true);
    } else {
      const clickX = event.clientX;
      const halfScreenWidth = window.innerWidth / 2;
      if (clickX > halfScreenWidth) {
        const nextIndex = Math.min(currentStoryIndex + 1, story.length - 1);
        stopSpeaking();
        setShowChoices(false);
        setCurrentStoryIndex(nextIndex);
      } else {
        const prevIndex = Math.max(currentStoryIndex - 1, 0);
        setCurrentStoryIndex(prevIndex);
        setShowChoices(false);
      }
    }
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
    setImagesLoaded(false);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile && imagesLoaded) {
      const timer = setTimeout(() => setIsFullScreenMsgShown(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, imagesLoaded]);

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

  const getImageIndex = () => {
    return Math.min(Math.floor(currentStoryIndex / 2), 3);
  };

  return (
    <div className="childhood-game" onClick={handleScreenClick}>
      <div className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
        <img src={showMenu ? "/assets/cross-icon.png" : "/assets/menu-icon.png"} alt="menu" />
      </div>

      {showMenu && (
        <div className="menu-items">
          <div className="menu-item-container">
            <div className="menu-item">Menu</div>
            <div className="menu-item" onClick={handleHome}>Home</div>
          </div>
        </div>
      )}

      {!isIntroShown && (
        <div className="intro">
          <h1>Old Age - Negative Path</h1>
          <div className="right-half blink"></div>
          <div className="instructions">
            <p>Click on right half of screen to continue</p>
          </div>
        </div>
      )}

    <div className="gamecontainer">
      <div className="background" style={{ backgroundImage: `url(/assets/main-game/old/Negative/${getImageIndex()}.jpg)` }}></div>

        {showChoices && choices[currentStoryIndex] && (
          <div className="choice-box">
            {choices[currentStoryIndex].map((choice, idx) => (
              <button key={idx} className="choice" onClick={() => handleChoice(choice)}>
                {choice.text}
              </button>
            ))}
          </div>
        )}

        {isIntroShown && <div className={`dialogue-box ${'with-voice'}`} ref={dialogueRef}></div>}
      </div>
    </div>
  );
};

export default OldNegative;