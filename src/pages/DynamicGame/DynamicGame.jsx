import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import '../MainGame/Childhood/ChildhoodGame.css';

const DynamicGame = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Setup phase states
  const [isSetupPhase, setIsSetupPhase] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [playerAge, setPlayerAge] = useState('');

  // Game phase states
  const [isIntroShown, setIsIntroShown] = useState(false);
  const [isMenuShown, setIsMenuShown] = useState(false);
  const [isFullScreenMsgShown, setIsFullScreenMsgShown] = useState(true);
  const [isOutroShown, setIsOutroShown] = useState(false);
  const [isStoryTelling, setIsStoryTelling] = useState(
    localStorage.getItem('isStorytelling') === 'true' || true
  );
  
  // Story states
  const [sessionId, setSessionId] = useState(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [story, setStory] = useState([]);
  const [choices, setChoices] = useState({ choice1: '', choice2: '' });
  const [backgroundImage, setBackgroundImage] = useState('');
  const [imageUrls, setImageUrls] = useState([]); // Array of images for each sentence
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const dialogueRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Check mobile on mount
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    // Set username from auth
    if (user && isSetupPhase) {
      setPlayerName(user.username || '');
    }
  }, [user, isSetupPhase]);

  // Hide fullscreen message after 7 seconds
  useEffect(() => {
    if (!isMobile && !isSetupPhase) {
      const timer = setTimeout(() => setIsFullScreenMsgShown(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, isSetupPhase]);

  // Speech synthesis
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

  // Typing animation
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
        // If this is the final line of stage 4, show outro
        if (currentStoryIndex === story.length - 1 && currentStage >= 4) {
          setTimeout(() => setIsOutroShown(true), 2000);
        } else if (currentStoryIndex === story.length - 1) {
          setShowChoices(true);
        }
      }
    };

    typingTimeoutRef.current = setTimeout(type, 30);
  };

  // Handle screen clicks for navigation
  const handleScreenClick = (event) => {
    const clickedElement = event.target;
    if (clickedElement.closest('.menu-icon') || clickedElement.closest('.menu-items') || 
        clickedElement.closest('.choice-box') || clickedElement.closest('.fullscreen-msg') ||
        clickedElement.closest('.outro')) return;

    if (!isIntroShown) {
      setIsIntroShown(true);
      return;
    }

    if (isTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (dialogueRef.current) dialogueRef.current.textContent = story[currentStoryIndex];
      setIsTyping(false);
      // If at final line and game is complete, show outro
      if (currentStoryIndex === story.length - 1 && currentStage >= 4) {
        setIsOutroShown(true);
      } else if (currentStoryIndex === story.length - 1) {
        setShowChoices(true);
      }
    } else {
      const clickX = event.clientX;
      const halfScreenWidth = window.innerWidth / 2;

      if (clickX > halfScreenWidth) {
        const nextIndex = Math.min(currentStoryIndex + 1, story.length - 1);
        setCurrentStoryIndex(nextIndex);
        setIsMenuShown(false);
        setShowChoices(false);
        // Check if we've reached the end of final stage
        if (nextIndex === story.length - 1 && currentStage >= 4) {
          // Will show outro after typing completes
        }
      } else {
        const prevIndex = Math.max(currentStoryIndex - 1, 0);
        setCurrentStoryIndex(prevIndex);
        setShowChoices(false);
      }
    }
  };

  // Start game from setup
  const startGame = async () => {
    if (!isAuthenticated) {
      alert('Please login to play the personalized game');
      navigate('/login');
      return;
    }

    if (!playerName.trim() || !playerAge) {
      alert('Please enter your name and age');
      return;
    }

    setLoading(true);
    
    try {
      // Create game session
      const sessionResponse = await api.post('/game/sessions', {
        userName: playerName,
        userAge: parseInt(playerAge),
        userInterests: ''
      });
      setSessionId(sessionResponse.data._id);

      // Generate first story
      const storyResponse = await api.post('/game/generate-story', {
        sessionId: sessionResponse.data._id,
        stageNumber: 1,
        selectedChoice: 0
      });

      const { story: storyText, choice1, choice2, generatedImage, imageUrls: images } = storyResponse.data;
      
      console.log('🎮 Game Started:');
      console.log('Story:', storyText);
      console.log('Choices:', { choice1, choice2 });
      console.log('Generated Images:', images);
      
      // Split story into sentences
      const lines = storyText.split(/(?<=[.!?])\s+/).filter(line => line.trim());
      setStory(lines);
      setChoices({ choice1, choice2 });
      setImageUrls(images || [generatedImage]); // Use array of images or fallback to single image
      setBackgroundImage(images?.[0] || generatedImage); // Set first image
      setIsSetupPhase(false);
      setCurrentStoryIndex(0);
      
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to generate story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Make choice and generate next story
  const makeChoice = async (choiceNumber) => {
    if (loading) return;

    setLoading(true);
    setShowChoices(false);
    stopSpeaking();

    try {
      const storyResponse = await api.post('/game/generate-story', {
        sessionId,
        stageNumber: currentStage + 1,
        selectedChoice: choiceNumber
      });

      const { story: storyText, choice1, choice2, generatedImage, imageUrls: images, completed, score } = storyResponse.data;
      
      console.log(`🎮 Stage ${currentStage + 1}:`, {
        story: storyText,
        choices: { choice1, choice2 },
        images: images,
        completed,
        score
      });
      
      // Split story into sentences
      const lines = storyText.split(/(?<=[.!?])\s+/).filter(line => line.trim());
      setStory(lines);
      setChoices({ choice1, choice2 });
      setImageUrls(images || [generatedImage]); // Use array of images or fallback to single image
      setBackgroundImage(images?.[0] || generatedImage); // Set first image
      setCurrentStage(prev => prev + 1);
      setCurrentStoryIndex(0);
      setIsIntroShown(false); // Reset intro for new stage

      if (completed) {
        // Show the final story, then show outro after user finishes reading
        setFinalScore(score);
        // Don't immediately show outro - let them read the final story first
      }
      
    } catch (error) {
      console.error('Error generating story:', error);
      alert('Failed to generate next part. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Centralized effect: when intro is shown and story index changes, start speech and typing
  useEffect(() => {
    if (!isIntroShown || isSetupPhase) return;
    stopSpeaking();
    const t = setTimeout(() => {
      speak(story[currentStoryIndex]);
      updateDialogue();
      // Update background image to match current sentence
      if (imageUrls[currentStoryIndex]) {
        setBackgroundImage(imageUrls[currentStoryIndex]);
      }
    }, 80);
    return () => clearTimeout(t);
  }, [isIntroShown, currentStoryIndex, isSetupPhase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      synthRef.current.cancel();
    };
  }, []);

  // Setup Screen
  if (isSetupPhase) {
    return (
      <div className="childhood-game">
        <div className="intro">
          <h1 style={{ opacity: 1 }}>🎮 Sudo Choices: Dynamic Story</h1>
          <div style={{ 
            marginTop: '3rem', 
            width: '90%', 
            maxWidth: '500px',
            opacity: 1,
            animation: 'fadeInFromBottom 2s ease-out 0.5s forwards'
          }}>
            <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '1rem', 
                marginBottom: '0.8rem', 
                color: '#0edf23' 
              }}>
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={30}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '5px',
                  color: 'white',
                  fontSize: '1rem',
                  fontFamily: "'Press Start 2P', cursive"
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '1rem', 
                marginBottom: '0.8rem', 
                color: '#0edf23' 
              }}>
                Your Age
              </label>
              <input
                type="number"
                placeholder="Enter your age"
                value={playerAge}
                onChange={(e) => setPlayerAge(e.target.value)}
                min="8"
                max="100"
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '5px',
                  color: 'white',
                  fontSize: '1rem',
                  fontFamily: "'Press Start 2P', cursive"
                }}
              />
            </div>

            <button
              onClick={startGame}
              disabled={loading || !playerName.trim() || !playerAge}
              style={{
                width: '100%',
                padding: '1.2rem',
                backgroundColor: loading ? '#666' : '#0edf23',
                border: 'none',
                borderRadius: '5px',
                color: 'black',
                fontSize: '1.1rem',
                fontWeight: '600',
                fontFamily: "'Press Start 2P', cursive",
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: 1,
                animation: 'fadeInFromBottom 2s ease-out 0.9s forwards'
              }}
            >
              {loading ? 'Generating Story...' : 'Begin Adventure'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (loading && !isIntroShown) {
    return (
      <div className="loading-screen">
        <div className="loading-animation">AI is generating your story...</div>
      </div>
    );
  }

  // Main Game Screen
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
          <h1>Sudo Choices: AI-Powered Journey</h1>
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
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}></div>

        {loading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#0edf23',
            fontSize: '1.2rem',
            zIndex: 200,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            padding: '2rem',
            borderRadius: '10px'
          }}>
            Generating next chapter...
          </div>
        )}

        {showChoices && !loading && (
          <div className="choice-box">
            <button className="choice" onClick={() => makeChoice(1)}>
              {choices.choice1}
            </button>
            <button className="choice" onClick={() => makeChoice(2)}>
              {choices.choice2}
            </button>
          </div>
        )}

        {isIntroShown && <div className="dialogue-box" ref={dialogueRef}></div>}
      </div>

      {/* Outro Screen - Like Static Game */}
      {isOutroShown && (
        <div className="outro" onClick={() => {
          // Good path (score >= 75) → Pledge Certificate
          // Other paths → Forum
          if (finalScore >= 75) {
            navigate('/pledge-certificate');
          } else {
            navigate('/forum');
          }
        }}>
          <h1>Journey Complete!</h1>
          <p>Your final score: {finalScore}/100</p>
          <p>
            {finalScore >= 75 && "Outstanding! You made wise choices throughout your journey."}
            {finalScore >= 50 && finalScore < 75 && "Good job! You showed resilience in many situations."}
            {finalScore < 50 && "Every journey teaches us something. Remember, it's never too late to choose a better path."}
          </p>
          <p className="blink">
            {finalScore >= 75 ? "Click anywhere to get your pledge certificate" : "Click anywhere to continue to the forum"}
          </p>
        </div>
      )}
    </div>
  );
};

export default DynamicGame;
