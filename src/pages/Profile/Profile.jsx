import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './Profile2.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [gameSessions, setGameSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalGames: 0,
    avgScore: 0,
    bestScore: 0,
    gamesCompleted: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProfile();
    fetchGameSessions();
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/profile');
      setProfile(res.data);
      updateUser({ 
        id: res.data._id, 
        username: res.data.username, 
        email: res.data.email, 
        avatar: res.data.avatar, 
        bio: res.data.bio 
      });
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGameSessions = async () => {
    try {
      const response = await api.get('/game/sessions/user');
      const sessions = response.data;
      setGameSessions(sessions);

      // Calculate stats
      const completed = sessions.filter(s => s.completed);
      const scores = completed.map(s => s.score);
      
      setStats({
        totalGames: sessions.length,
        avgScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
        bestScore: scores.length > 0 ? Math.max(...scores) : 0,
        gamesCompleted: completed.length
      });
    } catch (error) {
      console.error('Error fetching game sessions:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navigation />
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar-section">
              <img src={profile?.avatar || '/assets/default-avatar.png'} alt={profile?.username} className="profile-avatar" />
              <div className="profile-info">
                <h1>{profile?.username}</h1>
                <p className="profile-email">{profile?.email}</p>
                <p className="profile-joined">
                  Joined {new Date(profile?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            <button className="settings-btn" onClick={() => navigate('/settings')}>
              <i className="fa fa-cog"></i> Settings
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎮</div>
              <div className="stat-value">{stats.totalGames}</div>
              <div className="stat-label">Games Played</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-value">{stats.gamesCompleted}</div>
              <div className="stat-label">Games Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">{stats.bestScore}</div>
              <div className="stat-label">Best Score</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">{stats.avgScore}</div>
              <div className="stat-label">Average Score</div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Recent Game Sessions</h2>
            {loading ? (
              <div className="loading">Loading game history...</div>
            ) : gameSessions.length === 0 ? (
              <div className="no-games">
                <p>No games played yet!</p>
                <button className="play-btn" onClick={() => navigate('/dynamic-game')}>
                  Start Your First Game
                </button>
              </div>
            ) : (
              <div className="games-list">
                {gameSessions.map((session, index) => (
                  <div key={session._id} className="game-card">
                    <div className="game-header">
                      <h3>Game #{gameSessions.length - index}</h3>
                      <span className={`game-status ${session.completed ? 'completed' : 'in-progress'}`}>
                        {session.completed ? '✓ Completed' : '⏳ In Progress'}
                      </span>
                    </div>
                    <div className="game-details">
                      <div className="game-detail">
                        <span className="detail-label">Player:</span>
                        <span className="detail-value">{session.userName}, Age {session.userAge}</span>
                      </div>
                      <div className="game-detail">
                        <span className="detail-label">Score:</span>
                        <span className="detail-value score">{session.score}/100</span>
                      </div>
                      <div className="game-detail">
                        <span className="detail-label">Stages:</span>
                        <span className="detail-value">{session.stages?.length || 0}/4</span>
                      </div>
                      <div className="game-detail">
                        <span className="detail-label">Date:</span>
                        <span className="detail-value">
                          {new Date(session.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                    {session.completed && session.score >= 75 && (
                      <button className="certificate-btn" onClick={() => navigate('/pledge-certificate')}>
                        <i className="fa fa-certificate"></i> View Certificate
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="profile-actions">
            <button className="action-btn primary" onClick={() => navigate('/dynamic-game')}>
              <i className="fa fa-play"></i> Play Dynamic Game
            </button>
            <button className="action-btn secondary" onClick={() => navigate('/main-game/childhood')}>
              <i className="fa fa-gamepad"></i> Play Story Mode
            </button>
            <button className="action-btn tertiary" onClick={() => navigate('/forum')}>
              <i className="fa fa-comments"></i> Visit Forum
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

