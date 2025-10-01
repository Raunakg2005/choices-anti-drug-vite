import React from 'react';
import './ProfileCard-Simple.css';

const ProfileCardSimple = ({ name, title, handle, status, contactText = 'Contact', avatarUrl, miniAvatarUrl, onContactClick }) => {
  const handleImgError = (e) => {
    if (miniAvatarUrl && e.target.src !== miniAvatarUrl) e.target.src = miniAvatarUrl;
    else e.target.src = '/assets/tab-logo.png';
    e.target.style.objectFit = 'cover';
  };

  return (
    <div className="pc-card-modern">
      <div className="pc-card-media">
        <img
          className="pc-avatar"
          src={avatarUrl}
          alt={`${name} avatar`}
          onError={handleImgError}
        />
      </div>

      <div className="pc-card-body">
        <div className="pc-card-row">
          <div className="pc-text">
            <h3 className="pc-name">{name}</h3>
            <p className="pc-title">{title}</p>
            {handle && <p className="pc-handle">@{handle}</p>}
          </div>

          {status && <span className="pc-badge">{status}</span>}
        </div>

        <div className="pc-card-actions">
          <button className="pc-connect" onClick={onContactClick}>{contactText}</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardSimple;
