import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  getUnlockedAchievements, 
  getNextAchievements, 
  calculatePoints, 
  calculateLevel,
  ACHIEVEMENTS 
} from '../utils/gamification';
import './Achievements.css';

const Achievements = ({ habitList, completedData, darkMode }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('unlocked');

  const unlockedAchievements = useMemo(() => 
    getUnlockedAchievements(completedData, habitList), 
    [completedData, habitList]
  );

  const nextAchievements = useMemo(() => 
    getNextAchievements(completedData, habitList).slice(0, 6), 
    [completedData, habitList]
  );

  const totalPoints = useMemo(() => 
    calculatePoints(completedData, habitList), 
    [completedData, habitList]
  );

  const levelInfo = useMemo(() => 
    calculateLevel(totalPoints), 
    [totalPoints]
  );

  const achievementPoints = unlockedAchievements.reduce((sum, achievement) => 
    sum + achievement.points, 0
  );

  return (
    <div className={`achievements-container ${darkMode ? 'dark' : ''}`}>
      {/* Header Section */}
      <div className="achievements-header">
        <div className="level-display">
          <div className="level-badge">
            <span className="level-number">{levelInfo.level}</span>
            <span className="level-title">{levelInfo.title}</span>
          </div>
          <div className="points-display">
            <span className="points-value">{totalPoints.toLocaleString()}</span>
            <span className="points-label">Total Points</span>
          </div>
        </div>
        
        {levelInfo.nextLevelPoints && (
          <div className="level-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${(totalPoints / levelInfo.nextLevelPoints) * 100}%` 
                }}
              />
            </div>
            <span className="progress-text">
              {totalPoints} / {levelInfo.nextLevelPoints} points to next level
            </span>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <span className="stat-icon">🏆</span>
          <div className="stat-info">
            <span className="stat-value">{unlockedAchievements.length}</span>
            <span className="stat-label">Achievements</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <div className="stat-info">
            <span className="stat-value">{achievementPoints}</span>
            <span className="stat-label">Achievement Points</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <div className="stat-info">
            <span className="stat-value">
              {Math.round((unlockedAchievements.length / Object.keys(ACHIEVEMENTS).length) * 100)}%
            </span>
            <span className="stat-label">Completion</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'unlocked' ? 'active' : ''}`}
          onClick={() => setActiveTab('unlocked')}
        >
          <span className="tab-icon">🏆</span>
          Unlocked ({unlockedAchievements.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          <span className="tab-icon">🎯</span>
          In Progress ({nextAchievements.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <span className="tab-icon">📋</span>
          All ({Object.keys(ACHIEVEMENTS).length})
        </button>
      </div>

      {/* Achievement Content */}
      <div className="achievements-content">
        {activeTab === 'unlocked' && (
          <div className="achievements-grid">
            {unlockedAchievements.length > 0 ? (
              unlockedAchievements.map(achievement => (
                <div key={achievement.id} className="achievement-card unlocked">
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-info">
                    <h3 className="achievement-name">{achievement.name}</h3>
                    <p className="achievement-description">{achievement.description}</p>
                    <div className="achievement-points">+{achievement.points} points</div>
                  </div>
                  <div className="achievement-status">
                    <span className="status-badge unlocked">✓ Unlocked</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🎯</span>
                <h3>No achievements yet</h3>
                <p>Start completing habits to unlock your first achievement!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="achievements-grid">
            {nextAchievements.map(achievement => (
              <div key={achievement.id} className="achievement-card in-progress">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <h3 className="achievement-name">{achievement.name}</h3>
                  <p className="achievement-description">{achievement.description}</p>
                  <div className="achievement-points">+{achievement.points} points</div>
                </div>
                <div className="achievement-progress">
                  <div className="progress-bar small">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${achievement.progress * 100}%` }}
                    />
                  </div>
                  <span className="progress-percentage">
                    {Math.round(achievement.progress * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'all' && (
          <div className="achievements-grid">
            {Object.values(ACHIEVEMENTS).map(achievement => {
              const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
              const progressAchievement = nextAchievements.find(a => a.id === achievement.id);
              
              return (
                <div 
                  key={achievement.id} 
                  className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-info">
                    <h3 className="achievement-name">{achievement.name}</h3>
                    <p className="achievement-description">{achievement.description}</p>
                    <div className="achievement-points">+{achievement.points} points</div>
                  </div>
                  <div className="achievement-status">
                    {isUnlocked ? (
                      <span className="status-badge unlocked">✓ Unlocked</span>
                    ) : progressAchievement ? (
                      <div className="achievement-progress">
                        <div className="progress-bar small">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${progressAchievement.progress * 100}%` }}
                          />
                        </div>
                        <span className="progress-percentage">
                          {Math.round(progressAchievement.progress * 100)}%
                        </span>
                      </div>
                    ) : (
                      <span className="status-badge locked">🔒 Locked</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
