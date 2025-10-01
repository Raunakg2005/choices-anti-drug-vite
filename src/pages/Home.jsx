import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import ProfileCard from '../components/ProfileCard/ProfileCard';
import './Home.css';

const Home = () => {
  const videoRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [autoScrollCount, setAutoScrollCount] = useState(0);
  
  useEffect(() => {
    const video = videoRef.current;
    const targetElement = document.getElementById('homeSection');
    
    // Scroll to home section on load
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth',
      });
    }

    // Video event listeners
    const handleTimeUpdate = () => {
      if (video && video.currentTime >= 0.9 * video.duration && autoScrollCount < 1) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        setAutoScrollCount(prev => prev + 1);
      }
    };

    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
    }

    // Scroll event listeners
    let lastScrollPos = 0;
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const nav = document.querySelector('.navigation');

      // Hide/show navigation
      if (currentScrollPos > lastScrollPos && currentScrollPos > 100) {
        if (nav) nav.style.transform = 'translateY(-100%)';
      } else {
        if (nav) nav.style.transform = 'translateY(0)';
      }
      lastScrollPos = currentScrollPos;

      // Auto-scroll behavior
      if (currentScrollPos === 0) {
        setIsScrolled(false);
      }

      if (currentScrollPos > 0 && currentScrollPos <= 70) {
        if (!isScrolled && targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth',
          });
          setIsScrolled(true);
        }
      }

      // Animation triggers
      const tagLine = document.querySelector('.tag-line');
      const tagLineH1 = document.querySelector('.tag-line h1');
      const description = document.querySelector('.description');
      const gameRedirectContainer = document.querySelector('.game-redirect-container');
      const rules = document.querySelector('.rules');

      if (currentScrollPos > 0) {
        if (tagLine) tagLine.style.padding = '50px 0px';
        if (tagLineH1) tagLineH1.style.margin = '25px 30px';
        if (description) {
          description.style.left = '0';
          description.style.marginTop = '20rem';
          description.style.opacity = '1';
        }
        
        if (window.innerWidth > 620) {
          if (gameRedirectContainer) {
            gameRedirectContainer.style.right = '20px';
            gameRedirectContainer.style.bottom = '10px';
            gameRedirectContainer.style.height = '30%';
            gameRedirectContainer.style.width = '25%';
          }
          if (rules) {
            rules.style.display = 'none';
            rules.style.opacity = '0';
          }
        } else {
          if (autoScrollCount < 1) {
            setTimeout(() => {
              if (gameRedirectContainer) gameRedirectContainer.style.bottom = '-2%';
            }, 3000);
          } else {
            if (gameRedirectContainer) gameRedirectContainer.style.bottom = '-2%';
          }
        }

        // Start playing video
        if (video && video.paused) {
          video.play();
        }
      } else {
        if (tagLine) tagLine.style.padding = '10px 0px';
        if (tagLineH1) tagLineH1.style.margin = '0px 30px';
        if (description) description.style.marginTop = '17rem';
        
        if (window.innerWidth > 850) {
          if (gameRedirectContainer) {
            gameRedirectContainer.style.bottom = '100px';
            gameRedirectContainer.style.transition = 'all 0.5s ease-in-out';
            gameRedirectContainer.style.height = '70%';
            gameRedirectContainer.style.width = '40%';
          }
          if (rules) {
            rules.style.display = 'flex';
            rules.style.opacity = '1';
          }
        } else {
          if (gameRedirectContainer) gameRedirectContainer.style.bottom = '7%';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      if (video) {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolled, autoScrollCount]);

  return (
    <div className="home">
      <Navigation />
      
      <main id="homeSection">
        <video
          ref={videoRef}
          id="videoBackground"
          muted
          playsInline
          preload="auto"
          className="video-background"
        >
          <source src="/assets/Web-Site-Background-2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="tag-line">
          <h2>Empower Your Future:</h2>
          <h1>Choose Life</h1>
          <h2>Not Drugs</h2>
          <p className="description" id="Description">
            Experience this storyline play-through to learn more about the effects of drugs on your body and how to
            avoid them.<br />
            Every<strong> Choice </strong>Matters in this play-through.
            <br />
            try to make the right choices to get the best ending.
            <br />
            <br />
          </p>
        </div>
        
        <div className="game-redirect-container">
          <h2>Ready?</h2>
          <ul className="rules">
            <li>Game Have 4 stages</li>
            <li>Every stage have its own choices</li>
            <li>Your Choices will shape the further story of Game</li>
            <li>Game is Best Played in Full-Screen</li>
            <li>You can turn off story teller from Menu</li>
          </ul>
          <Link to="/main-game/childhood" className="play-game game-redirect">
            Start Game
          </Link>
        </div>
      </main>

      <div className="new-features">
        <h1>What's New?</h1>
        <div className="new-features-container">
          <Link to="/main-game/childhood" className="new-feature-card">
            <img src="/assets/main-game-ss.png" alt="Feature 1" />
            <h3>Interactive Story Game</h3>
            <p>Play a Interactive Story game consisting of different choices and visuals</p>
          </Link>
          
          <Link to="/forum" className="new-feature-card">
            <img src="/assets/forum-ss.png" alt="Feature 2" />
            <h3>Sudo:<br /> Anti-Drug Forum</h3>
            <p>Connect with people who are fighting against drugs and Councillors</p>
          </Link>
          
          <Link to="/dynamic-game" className="new-feature-card">
            <img src="/assets/dynamic-game-ss.png" alt="Feature 3" />
            <h3>Dynamic Game</h3>
            <p>Every time experience a new story line with Sudo AI</p>
          </Link>
        </div>
        

      </div>

      <div id="aboutTeam" className="about about-team">
        <h1>About Our Team: <img src="/assets/sudo.png" height="40px" alt="Sudo" /></h1>
        
        {/* New ProfileCard grid (modern, interactive) */}
        <div className="profile-card-grid">
          <ProfileCard
            name="Raunak Kumar Gupta"
            title="Full Stack Developer"
            handle="raunakgupta"
            status="Student"
            contactText="Connect"
            avatarUrl="/assets/rkg-1.png"
            miniAvatarUrl="/assets/rkg.jpg"
            enableTilt={true}
            onContactClick={() => window.open('https://www.linkedin.com/in/raunak-kumar-gupta-7b3503270/','_blank')}
          />

          <ProfileCard
            name="Piyush Chaudhary"
            title="Backend Developer"
            handle="piyush"
            status="Student"
            contactText="Contact"
            avatarUrl="/assets/pc-1.png"
            miniAvatarUrl="/assets/pc.jpg"
            enableTilt={true}
            onContactClick={() => window.open('https://www.linkedin.com/in/piyush-chaudhary-9b5999187/','_blank')}
          />

          <ProfileCard
            name="Rahul Kadam"
            title="Full Stack Developer"
            handle="rahulk"
            status="Student"
            contactText="Contact"
            avatarUrl="https://media.licdn.com/dms/image/D4D03AQFg7zU_GLhX5Q/profile-displayphoto-shrink_200_200/0/1689414065287?e=2147483647&v=beta&t=Xd__cVA3nevSnqbLUimJIfplzF_5Rh8wpRcSPBXh9DQ"
            enableTilt={true}
            onContactClick={() => window.open('https://www.linkedin.com/in/kunalshah017','_blank')}
          />
        </div>

        {/* Original team-members block kept below for reference — commented out to avoid duplication */}
        {/*
        <div className="team-members">
          <div className="team-member">
            <div className="member-image">
              <img src="https://media.licdn.com/dms/image/D4D03AQE9M7-ltniH2A/profile-displayphoto-shrink_200_200/0/1696560440213?e=1709769600&v=beta&t=Uws9XgdFyHljNcJDrTjN8h4Cc0inga0PFcU38YU_VAw" alt="Team Member" />
            </div>
            <div className="member-description even">
              <h3>Raunak Kumar Gupta</h3>
              <ul>
                <li>First-Year | Bachelor's of Technology - Computer Engineering</li>
                <li>KJ Somaiya College, Somaiya Vidyavihar University</li>
                <li>Front-End Developer</li>
              </ul>
              <div className="member-socials">
                <a href="https://www.linkedin.com/in/raunak-gupta-7b3503270/" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/linkedin.png" alt="LinkedIn" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="team-member">
            <div className="member-image">
              <img src="https://media.licdn.com/dms/image/D4E03AQFDvyJUinwVWg/profile-displayphoto-shrink_200_200/0/1686121558557?e=1709769600&v=beta&t=dH55upHpNmUQPwJcT5ijWPn3IUGV8A8E1YHK6uANJVE" alt="Team Member" />
            </div>
            <div className="member-description odd">
              <h3>Piyush Chaudhary <br />(<strong style={{color: '#0edf23'}}>Sudo su Team-Leader</strong>)</h3>
              <ul>
                <li>First-Year | Bachelor's of Technology - Computer Engineering</li>
                <li>KJ Somaiya College, Somaiya Vidyavihar University</li>
                <li>Front-End Developer</li>
              </ul>
              <div className="member-socials">
                <a href="https://www.linkedin.com/in/piyush-chaudhary-9b5999187/" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/linkedin.png" alt="LinkedIn" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="team-member">
            <div className="member-image">
              <img src="https://media.licdn.com/dms/image/D4D03AQFg7zU_GLhX5Q/profile-displayphoto-shrink_200_200/0/1689414065287?e=2147483647&v=beta&t=Xd__cVA3nevSnqbLUimJIfplzF_5Rh8wpRcSPBXh9DQ" alt="Team Member" />
            </div>
            <div className="member-description even">
              <h3>Rahul Kadam</h3>
              <ul>
                <li>First-Year | Bachelor's in Computer Applications</li>
                <li>SK Somaiya College, Somaiya Vidyavihar University</li>
                <li>Front-End Developer</li>
              </ul>
              <div className="member-socials">
                <a href="https://www.linkedin.com/in/kunalshah017" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/linkedin.png" alt="LinkedIn" />
                </a>
              </div>
            </div>
          </div>
        </div>
        */}

      </div>

      <div id="aboutProject" className="about about-project">
        <h1>About Project</h1>
        <div className="about-project-description">
          <p>
            <strong>Choose Life Not Drugs</strong> is a project made by <strong>Sudo</strong> for the
            <strong> Re-Inventing Youth Communication</strong> Hackathon.
            <br />
            <br />
            This project is made to spread awareness about the effects of drugs on the human body and how to
            avoid them.
            <br />
            <br />
            This project is made using <strong>React</strong>, <strong>Vite</strong>, <strong>CSS</strong>, 
            <strong> JavaScript</strong> and <strong>Node.js</strong>.
          </p>
        </div>
        <div className="about-project-image">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/fJ6kTPEgKEY?si=Pl2YsRcM13BhGlYL&rel=0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="footer">
        <div className="footer-message">
          Made with ❤️ by <strong>Sudo</strong>
        </div>
        <div className="footer-links">
          <a href="https://github.com/Raunakg2005/choices-anti-drug-vite" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://youtu.be/hTmDJXYRnE" target="_blank" rel="noopener noreferrer">YouTube</a>
        </div>
      </div>
    </div>
  );
};

export default Home;