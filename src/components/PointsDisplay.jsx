import React, { useMemo } from 'react';
import { calculatePoints, calculateLevel, getUnlockedAchievements } from '../utils/gamification';
import './PointsDisplay.css';

const PointsDisplay = ({ habitList, completedData, darkMode }) => {
  const totalPoints = useMemo(() => 
    calculatePoints(completedData, habitList), 
    [completedData, habitList]
  );

  const levelInfo = useMemo(() => 
    calculateLevel(totalPoints), 
    [totalPoints]
  );

  const recentAchievements = useMemo(() => 
    getUnlockedAchievements(completedData, habitList).slice(-3), 
    [completedData, habitList]
  );

  const progressToNext = levelInfo.nextLevelPoints 
    ? (totalPoints / levelInfo.nextLevelPoints) * 100 
    : 100;

  return (
    <div className={`points-display-container ${darkMode ? 'dark' : ''}`}>
      {/* Level and Points Section */}
      <div className="level-points-section">
        <div className="level-info">
          <div className="level-badge">
            <span className="level-number">{levelInfo.level}</span>
          </div>
          <div className="level-details">
            <span className="level-title">{levelInfo.title}</span>
            <span className="points-count">{totalPoints.toLocaleString()} pts</span>
          </div>
        </div>
        
        {levelInfo.nextLevelPoints && (
          <div className="level-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            <span className="progress-text">
              {levelInfo.nextLevelPoints - totalPoints} pts to level {levelInfo.level + 1}
            </span>
          </div>
        )}
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div className="recent-achievements">
          <h4>Recent Achievements</h4>
          <div className="achievements-list">
            {recentAchievements.map(achievement => (
              <div key={achievement.id} className="mini-achievement">
                <span className="achievement-icon">{achievement.icon}</span>
                <div className="achievement-info">
                  <span className="achievement-name">{achievement.name}</span>
                  <span className="achievement-points">+{achievement.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsDisplay;
