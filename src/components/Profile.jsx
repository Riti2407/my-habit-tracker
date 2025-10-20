import React from 'react';
import './Profile.css';

const Profile = ({ user, achievements, darkMode }) => {
  // Default user data if none is provided
  const defaultUser = {
    name: 'Guest User',
    avatar: 'https://www.gravatar.com/avatar/',
    joinDate: new Date().toISOString().split('T')[0],
    totalHabits: 0,
    completedHabits: 0,
    currentStreak: 0,
    longestStreak: 0,
  };

  const currentUser = user || defaultUser;
  const userAchievements = achievements || [];

  return (
    <div className={`profile-page ${darkMode ? 'dark' : ''}`}>
      <div className="profile-header">
        <div className="avatar-container">
          <img src={currentUser.avatar} alt="User Avatar" className="avatar" />
        </div>
        <h1 className="user-name">{currentUser.name}</h1>
        <p className="join-date">Joined on {new Date(currentUser.joinDate).toLocaleDateString()}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Current Streak</h3>
          <p>🔥 {currentUser.currentStreak} Days</p>
        </div>
        <div className="stat-card">
          <h3>Longest Streak</h3>
          <p>🏆 {currentUser.longestStreak} Days</p>
        </div>
        <div className="stat-card">
          <h3>Habits Completed</h3>
          <p>✅ {currentUser.completedHabits}</p>
        </div>
      </div>

      <div className="achievements-section">
        <h2>Achievements</h2>
        {userAchievements.length > 0 ? (
          <div className="achievements-grid">
            {userAchievements.map((ach, index) => (
              <div key={index} className="achievement-card">
                <div className="achievement-icon">{ach.icon}</div>
                <div className="achievement-details">
                  <h3>{ach.title}</h3>
                  <p>{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No achievements yet. Keep tracking your habits!</p>
        )}
      </div>

      <div className="settings-section">
        <h2>Settings</h2>
        <div className="settings-options">
          <button className="setting-button">Edit Profile</button>
          <button className="setting-button">Notification Settings</button>
          <button className="setting-button logout">Log Out</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;