import React from 'react';
import ForumNavbar from '../../components/ForumNavbar';
import './About2.css';

const About = () => {
  return (
    <>
      <ForumNavbar />
      <div className="about-page">
        <div className="about-container">
          <h1 className="about-title">About Anti-Drug Project</h1>
          
          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              This project aims to raise awareness about drug abuse and provide support 
              for individuals struggling with addiction. Through interactive games, 
              educational resources, and community support, we help people make informed 
              choices about their health and wellbeing.
            </p>
          </section>

          <section className="about-section">
            <h2>Features</h2>
            <ul className="features-list">
              <li>
                <strong>Interactive Story Game:</strong> Experience life choices through 
                different stages (Childhood, Teenage, Adult, Old Age) and see the impact 
                of your decisions.
              </li>
              <li>
                <strong>Dynamic AI Game:</strong> Personalized scenarios powered by AI to 
                help you understand the consequences of drug use.
              </li>
              <li>
                <strong>Community Forum:</strong> Connect with others, share experiences, 
                and support each other in recovery and prevention.
              </li>
              <li>
                <strong>Resources & Help:</strong> Access to helplines, support groups, 
                AA meetings, and educational materials.
              </li>
              <li>
                <strong>Pledge Certificate:</strong> Take a pledge against drug use and 
                receive a personalized certificate.
              </li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Get Help</h2>
            <p>
              If you or someone you know is struggling with addiction, help is available:
            </p>
            <div className="help-resources">
              <div className="help-card">
                <h3>SAMHSA National Helpline</h3>
                <p className="help-number">1-800-662-4357</p>
                <p>Free, confidential, 24/7 treatment referral and information service</p>
              </div>
              <div className="help-card">
                <h3>988 Suicide & Crisis Lifeline</h3>
                <p className="help-number">988</p>
                <p>24/7 support for people in distress, prevention and crisis resources</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Join Our Community</h2>
            <p>
              Visit our <a href="/forum">Community Forum</a> to connect with others, 
              share your story, and find support. Together, we can make a difference.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

export default About;
