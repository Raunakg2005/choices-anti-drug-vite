import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './Settings.css';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Profile Settings
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: ''
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    showProfile: true,
    showGameHistory: true,
    emailNotifications: true
  });

  // Game Settings
  const [gameSettings, setGameSettings] = useState({
    soundEnabled: true,
    voiceEnabled: true,
    autoSave: true,
    difficulty: 'medium'
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserSettings();
  }, [user, navigate]);

  const fetchUserSettings = async () => {
    try {
      const response = await api.get('/auth/profile');
      const userData = response.data;
      
      setProfileData({
        username: userData.username || '',
        email: userData.email || '',
        bio: userData.bio || '',
        avatar: userData.avatar || ''
      });

      setPrivacySettings(userData.privacy || privacySettings);
      setGameSettings(userData.gameSettings || gameSettings);
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Sending profile update:', profileData);
      const response = await api.put('/auth/profile', profileData);
      console.log('Profile update response:', response.data);
      updateUser(response.data.user);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyUpdate = async () => {
    setLoading(true);
    try {
      await api.put('/auth/privacy', privacySettings);
      setSuccess('Privacy settings updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const handleGameSettingsUpdate = async () => {
    setLoading(true);
    try {
      await api.put('/auth/game-settings', gameSettings);
      setSuccess('Game settings updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update game settings');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setLoading(true);
    try {
      const response = await api.post('/auth/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfileData({ ...profileData, avatar: response.data.avatarUrl });
      setUser({ ...user, avatar: response.data.avatarUrl });
      setSuccess('Avatar uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="settings-page">
        <div className="settings-container">
          <h1 className="settings-title">⚙️ Settings</h1>

          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          {/* Profile Settings */}
          <div className="settings-section">
            <h2>👤 Profile Settings</h2>
            <form onSubmit={handleProfileUpdate} className="settings-form">
              <div className="avatar-upload">
                <img 
                  src={profileData.avatar || 'https://via.placeholder.com/150'} 
                  alt="Avatar" 
                  className="settings-avatar"
                />
                <label htmlFor="avatar-input" className="upload-btn">
                  📷 Change Avatar
                </label>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: 'none' }}
                />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>

          {/* Password Change */}
          <div className="settings-section">
            <h2>🔒 Change Password</h2>
            <form onSubmit={handlePasswordChange} className="settings-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  minLength="6"
                />
              </div>

              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>

          {/* Privacy Settings */}
          <div className="settings-section">
            <h2>🔐 Privacy Settings</h2>
            <div className="toggle-settings">
              <div className="toggle-item">
                <div className="toggle-info">
                  <h3>Public Profile</h3>
                  <p>Allow others to view your profile</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={privacySettings.showProfile}
                    onChange={(e) => setPrivacySettings({ ...privacySettings, showProfile: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h3>Show Game History</h3>
                  <p>Display your game sessions to others</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={privacySettings.showGameHistory}
                    onChange={(e) => setPrivacySettings({ ...privacySettings, showGameHistory: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h3>Email Notifications</h3>
                  <p>Receive updates and news via email</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={privacySettings.emailNotifications}
                    onChange={(e) => setPrivacySettings({ ...privacySettings, emailNotifications: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <button onClick={handlePrivacyUpdate} className="save-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save Privacy Settings'}
              </button>
            </div>
          </div>

          {/* Game Settings */}
          <div className="settings-section">
            <h2>🎮 Game Settings</h2>
            <div className="toggle-settings">
              <div className="toggle-item">
                <div className="toggle-info">
                  <h3>Sound Effects</h3>
                  <p>Enable game sound effects</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={gameSettings.soundEnabled}
                    onChange={(e) => setGameSettings({ ...gameSettings, soundEnabled: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h3>Voice Narration</h3>
                  <p>Enable text-to-speech for story narration</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={gameSettings.voiceEnabled}
                    onChange={(e) => setGameSettings({ ...gameSettings, voiceEnabled: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h3>Auto-Save</h3>
                  <p>Automatically save game progress</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={gameSettings.autoSave}
                    onChange={(e) => setGameSettings({ ...gameSettings, autoSave: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="form-group">
                <label>Game Difficulty</label>
                <select
                  value={gameSettings.difficulty}
                  onChange={(e) => setGameSettings({ ...gameSettings, difficulty: e.target.value })}
                  className="difficulty-select"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <button onClick={handleGameSettingsUpdate} className="save-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save Game Settings'}
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="settings-section danger-zone">
            <h2>⚠️ Danger Zone</h2>
            <p className="danger-text">These actions are irreversible. Please be careful.</p>
            <button className="danger-btn" onClick={() => {
              if (window.confirm('Are you sure you want to delete all your game data? This cannot be undone.')) {
                // Handle delete game data
                console.log('Delete game data');
              }
            }}>
              🗑️ Delete Game Data
            </button>
            <button className="danger-btn" onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                // Handle delete account
                console.log('Delete account');
              }
            }}>
              ❌ Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
