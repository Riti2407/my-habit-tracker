import React from "react";
import { useTranslation } from "react-i18next";
import "./TreeGrowth.css";

function TreeGrowth({ completedCount, darkMode }) {
  const { t, ready } = useTranslation();
  if (!ready) return null;

  const growthStage = Math.min(Math.floor(completedCount / 5), 5);
  const treeEmojis = ["🌱", "🌿", "🌳", "🎄", "🌴", "🪴"];
  const stageNames = ["Seed", "Sprout", "Sapling", "Young Tree", "Mature Tree", "Thriving Garden"];
  const progressToNext = ((completedCount % 5) / 5) * 100;

  return (
    <div className={`tree-growth-container ${darkMode ? "dark" : ""}`}>
      <div className="tree-header">
        <h2 className="tree-title">
          <span className="tree-icon">🌳</span>
          {t("treeGrowth.title")}
        </h2>
        <p className="tree-subtitle">
          {t("treeGrowth.habitsCompleted", { count: completedCount })}
        </p>
      </div>

      <div className="tree-display">
        <div className="tree-emoji-container">
          <div className="tree-emoji" key={growthStage}>
            {treeEmojis[growthStage]}
          </div>
          <div className="tree-glow"></div>
        </div>
        <div className="tree-stage-name">{stageNames[growthStage]}</div>
      </div>

      {/* Progress to next stage */}
      {growthStage < 5 && (
        <div className="next-stage-progress">
          <div className="progress-label">
            <span>Progress to {stageNames[growthStage + 1]}</span>
            <span className="progress-count">
              {completedCount % 5}/5 habits
            </span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${progressToNext}%` }}
            >
              <div className="progress-shimmer"></div>
            </div>
          </div>
        </div>
      )}

      {/* Overall Progress */}
      <div className="overall-progress">
        <div className="progress-stats">
          <div className="stat-item">
            <span className="stat-number">{completedCount}</span>
            <span className="stat-text">Total Habits</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">{growthStage + 1}/6</span>
            <span className="stat-text">Growth Stage</span>
          </div>
        </div>
        
        <div className="completion-bar">
          <div 
            className="completion-fill"
            style={{ width: `${Math.min((completedCount / 30) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="completion-text">
          {completedCount >= 30 
            ? "🎉 Maximum growth achieved!" 
            : `${30 - completedCount} more to reach full growth`}
        </p>
      </div>

      {/* Milestones */}
      <div className="milestones">
        {treeEmojis.map((emoji, index) => (
          <div 
            key={index}
            className={`milestone ${index <= growthStage ? "achieved" : ""}`}
          >
            <div className="milestone-emoji">{emoji}</div>
            <div className="milestone-count">{index * 5}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TreeGrowth;