import React, { useState, useEffect } from 'react';
import './AchievementNotification.css';

const AchievementNotification = ({ achievement, onClose, darkMode }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div className={`achievement-notification ${isVisible ? 'visible' : ''} ${darkMode ? 'dark' : ''}`}>
      <div className="notification-content">
        <div className="achievement-icon-large">{achievement.icon}</div>
        <div className="achievement-details">
          <h3>Achievement Unlocked!</h3>
          <h4>{achievement.name}</h4>
          <p>{achievement.description}</p>
          <div className="points-earned">+{achievement.points} points</div>
        </div>
        <button className="close-btn" onClick={() => setIsVisible(false)}>×</button>
      </div>
    </div>
  );
};

export default AchievementNotification;
