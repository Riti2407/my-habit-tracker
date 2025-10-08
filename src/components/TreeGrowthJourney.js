import React from "react";
import { motion } from "framer-motion";
import { getStageInfo } from "../utils/streakCalculator";
import "./TreeGrowthJourney.css";

function TreeGrowthJourney({ currentStage, currentStreak, darkMode }) {
  const stages = ['empty', 'seed', 'sprout', 'sapling', 'tree', 'mature_tree', 'flowering_tree', 'fruit_tree', 'ancient_tree'];
  
  const getStageRequirement = (stage) => {
    const requirements = {
      empty: 0,
      seed: 1,
      sprout: 3,
      sapling: 7,
      tree: 14,
      mature_tree: 21,
      flowering_tree: 30,
      fruit_tree: 50,
      ancient_tree: 100
    };
    return requirements[stage] || 0;
  };

  const isStageUnlocked = (stage) => {
    return currentStreak >= getStageRequirement(stage);
  };

  const isCurrentStage = (stage) => {
    return stage === currentStage;
  };

  return (
    <div 
      className="tree-journey"
      style={{
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        color: darkMode ? "#f9fafb" : "#111827",
        borderRadius: "1rem",
        padding: "1.5rem",
        marginTop: "1rem",
        boxShadow: darkMode ? "0 4px 12px rgba(255,255,255,0.05)" : "0 4px 12px rgba(0,0,0,0.1)"
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "1.2rem" }}>
        🌱 Growth Journey
      </h3>
      
      <div className="journey-timeline">
        {stages.map((stage, index) => {
          const stageInfo = getStageInfo(stage);
          const unlocked = isStageUnlocked(stage);
          const current = isCurrentStage(stage);
          const requirement = getStageRequirement(stage);
          
          return (
            <motion.div
              key={stage}
              className={`journey-stage ${unlocked ? 'unlocked' : 'locked'} ${current ? 'current' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                opacity: unlocked ? 1 : 0.4,
                transform: current ? 'scale(1.1)' : 'scale(1)',
                borderColor: current ? stageInfo.color : (darkMode ? "#374151" : "#e5e7eb")
              }}
            >
              <div className="stage-content">
                <div 
                  className="stage-emoji"
                  style={{
                    fontSize: current ? "2.5rem" : "2rem",
                    filter: current ? `drop-shadow(0 0 8px ${stageInfo.color}50)` : 'none'
                  }}
                >
                  {stageInfo.emoji}
                  {stageInfo.pot && (
                    <div className="stage-pot" style={{ fontSize: "1rem", marginTop: "-5px" }}>
                      {stageInfo.pot}
                    </div>
                  )}
                </div>
                
                <div className="stage-info">
                  <div 
                    className="stage-name"
                    style={{ 
                      color: unlocked ? stageInfo.color : (darkMode ? "#6b7280" : "#9ca3af"),
                      fontWeight: current ? "bold" : "600"
                    }}
                  >
                    {stageInfo.name}
                  </div>
                  
                  <div 
                    className="stage-requirement"
                    style={{ 
                      color: darkMode ? "#9ca3af" : "#6b7280",
                      fontSize: "0.75rem"
                    }}
                  >
                    {requirement === 0 ? "Start" : `${requirement}+ days`}
                  </div>
                  
                  {current && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="current-indicator"
                      style={{
                        backgroundColor: stageInfo.color,
                        color: "white",
                        fontSize: "0.7rem",
                        padding: "0.2rem 0.4rem",
                        borderRadius: "0.25rem",
                        marginTop: "0.25rem"
                      }}
                    >
                      Current ({currentStreak} days)
                    </motion.div>
                  )}
                  
                  {unlocked && !current && (
                    <div
                      className="unlocked-indicator"
                      style={{
                        color: "#22c55e",
                        fontSize: "0.8rem",
                        marginTop: "0.25rem"
                      }}
                    >
                      ✅ Unlocked
                    </div>
                  )}
                </div>
              </div>
              
              {index < stages.length - 1 && (
                <div 
                  className="timeline-connector"
                  style={{
                    backgroundColor: unlocked ? "#22c55e" : (darkMode ? "#374151" : "#e5e7eb"),
                    height: "2px",
                    width: "100%",
                    margin: "0.5rem 0"
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
      
      <div 
        className="journey-progress"
        style={{
          marginTop: "1.5rem",
          textAlign: "center",
          padding: "1rem",
          backgroundColor: darkMode ? "#374151" : "#f9fafb",
          borderRadius: "0.5rem"
        }}
      >
        <div style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
          <strong>Journey Progress:</strong> {Math.min(Math.round((currentStreak / 100) * 100), 100)}%
        </div>
        
        <div
          className="journey-progress-bar"
          style={{
            height: "8px",
            backgroundColor: darkMode ? "#1f2937" : "#e5e7eb",
            borderRadius: "4px",
            overflow: "hidden"
          }}
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min((currentStreak / 100) * 100, 100)}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #22c55e, #16a34a, #ec4899)",
              borderRadius: "4px"
            }}
          />
        </div>
        
        <div style={{ fontSize: "0.8rem", marginTop: "0.5rem", color: darkMode ? "#9ca3af" : "#6b7280" }}>
          {currentStreak < 100 ? `${100 - currentStreak} days to legendary status` : "🎉 Legendary status achieved!"}
        </div>
      </div>
    </div>
  );
}

export default TreeGrowthJourney;