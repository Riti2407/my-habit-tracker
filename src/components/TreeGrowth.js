import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { calculateStreaks, getCongrats } from "../utils/streakCalculator";
import TreeGrowthJourney from "./TreeGrowthJourney";
import "./TreeGrowth.css";

function TreeGrowth({ completedHabits, habitKeys, darkMode }) {
  const { t, ready } = useTranslation();
  const [data, setData] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [message, setMessage] = useState("");
  const [showStats, setShowStats] = useState(false);
  const [showJourney, setShowJourney] = useState(false);

  useEffect(() => {
    if (ready && completedHabits && habitKeys && habitKeys.length > 0) {
      const newData = calculateStreaks(completedHabits, habitKeys);
      
      // Check for stage change before updating data
      if (data && newData.growthStage !== data.growthStage) {
        if (getLevel(newData.growthStage) > getLevel(data.growthStage)) {
          setMessage(getCongrats(newData.growthStage, newData.currentStreak));
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 4000);
        }
      }
      
      setData(newData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedHabits, habitKeys, ready]);

  const getLevel = (stage) => {
    const levels = { 
      empty: 0, seed: 1, sprout: 2, sapling: 3, tree: 4, 
      mature_tree: 5, flowering_tree: 6, fruit_tree: 7, ancient_tree: 8 
    };
    return levels[stage] || 0;
  };

  const getWeeklyCompletion = () => {
    if (!data || !data.completedDates) return 0;
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentDates = data.completedDates.filter(date => {
      const dateObj = new Date(date);
      return dateObj >= weekAgo && dateObj <= today;
    });
    return Math.round((recentDates.length / 7) * 100);
  };

  const getMotivationalQuote = (stage) => {
    const quotes = {
      empty: "Every journey begins with a single step.",
      seed: "Small seeds grow into mighty trees.",
      sprout: "Persistence is the key to growth.",
      sapling: "Consistency beats perfection.",
      tree: "Strong roots produce beautiful fruits.",
      mature_tree: "Wisdom comes through sustained practice.",
      flowering_tree: "Your dedication is blooming beautifully.",
      fruit_tree: "The harvest of hard work is sweet.",
      ancient_tree: "You are a living legend of consistency."
    };
    return quotes[stage] || "Keep growing!";
  };

  if (!ready || !data) {
    return (
      <div style={{
        marginTop: "2rem",
        padding: "1.5rem",
        textAlign: "center",
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        borderRadius: "1rem",
        boxShadow: darkMode ? "0 4px 12px rgba(255,255,255,0.05)" : "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🌱</div>
        <p style={{ color: darkMode ? "#d1d5db" : "#6b7280" }}>
          Loading your habit tree...
        </p>
      </div>
    );
  }

  const info = data.stageInfo;
  const weeklyCompletion = getWeeklyCompletion();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          borderRadius: "1rem",
          boxShadow: darkMode
            ? "0 4px 12px rgba(255,255,255,0.05)"
            : "0 4px 12px rgba(0,0,0,0.1)",
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#f9fafb" : "#111827",
          textAlign: "center",
          maxWidth: "400px",
          marginLeft: "auto",
          marginRight: "auto",
          transition: "background 0.3s, color 0.3s",
          position: "relative",
          border: `2px solid ${info.color}20`,
        }}
      >
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            style={{
              position: "absolute",
              top: "-60px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "white",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              fontSize: "0.9rem",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
              zIndex: 10,
              whiteSpace: "nowrap",
            }}
          >
            {message}
            <div
              style={{
                position: "absolute",
                bottom: "-6px",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid #16a34a",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.25rem", margin: 0 }}>
          {t("treeGrowth.title")}
        </h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setShowStats(!showStats)}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              color: info.color,
              padding: "0.25rem"
            }}
            title="Toggle Stats"
          >
            📊
          </button>
          <button
            onClick={() => setShowJourney(!showJourney)}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              color: info.color,
              padding: "0.25rem"
            }}
            title="View Growth Journey"
          >
            🗺️
          </button>
        </div>
      </div>

      {/* Tree and Pot Container */}
      <div style={{ position: "relative", marginBottom: "1rem" }}>
        {info.pot && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            style={{
              fontSize: "2rem",
              position: "absolute",
              bottom: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1
            }}
          >
            {info.pot}
          </motion.div>
        )}
        
        <motion.div
          animate={{ 
            scale: [0.8, 1.1, 1],
            opacity: [0, 1, 1]
          }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut",
            times: [0, 0.6, 1]
          }}
          key={`tree-${data.growthStage}`}
          style={{
            fontSize: "4rem",
            position: "relative",
            zIndex: 2,
            filter: data.growthStage === 'ancient_tree' ? 'drop-shadow(0 0 15px #7c2d1250)' : 
                   data.growthStage === 'flowering_tree' ? 'drop-shadow(0 0 10px #ec489950)' : 'none',
          }}
        >
          {info.emoji}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 
          style={{ 
            fontSize: "1.1rem", 
            fontWeight: "600", 
            color: info.color,
            marginBottom: "0.5rem" 
          }}
        >
          {info.name}
        </h3>
        <p 
          style={{ 
            fontSize: "0.9rem", 
            color: darkMode ? "#d1d5db" : "#6b7280",
            marginBottom: "1rem" 
          }}
        >
          {info.description}
        </p>
      </motion.div>

      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              backgroundColor: darkMode ? "#374151" : "#f9fafb",
              borderRadius: "0.5rem",
              fontSize: "0.85rem"
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <div>
                <strong>Total Days:</strong> {data.completedDates?.length || 0}
              </div>
              <div>
                <strong>Weekly Rate:</strong> {weeklyCompletion}%
              </div>
            </div>
            <div style={{ 
              fontSize: "0.8rem", 
              fontStyle: "italic", 
              color: info.color,
              textAlign: "center",
              marginTop: "0.5rem"
            }}>
              "{getMotivationalQuote(data.growthStage)}"
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        style={{ marginBottom: "1rem" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            fontSize: "0.9rem",
            marginBottom: "0.5rem" 
          }}
        >
          <span>
            <strong>Current:</strong> {data.currentStreak} days
          </span>
          <span>
            <strong>Best:</strong> {data.bestStreak} days
          </span>
        </div>
        
        <p 
          style={{ 
            fontSize: "0.85rem", 
            color: info.color,
            fontStyle: "italic",
            marginBottom: "1rem" 
          }}
        >
          {info.message}
        </p>

        {info.nextStage && (
          <p 
            style={{ 
              fontSize: "0.8rem", 
              color: darkMode ? "#9ca3af" : "#6b7280",
              marginBottom: "1rem" 
            }}
          >
            Next: {info.requirement}
          </p>
        )}
      </motion.div>

      <div
        style={{
          height: "0.6rem",
          width: "100%",
          backgroundColor: darkMode ? "#374151" : "#e5e7eb",
          borderRadius: "9999px",
          overflow: "hidden",
          marginTop: "1rem",
        }}
      >
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: getProgressPercentage(data.currentStreak, data.growthStage) }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          style={{
            height: "100%",
            background: `linear-gradient(90deg, ${info.color}, ${info.color}aa)`,
            borderRadius: "9999px",
          }}
        />
      </div>

      {/* Achievement Badge for high streaks */}
      {data.currentStreak >= 100 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            fontSize: "1.5rem",
            background: "linear-gradient(45deg, #ffd700, #ffed4a)",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(255, 215, 0, 0.3)"
          }}
          title="Century Club!"
        >
          👑
        </motion.div>
      )}
    </motion.div>
    
    {showJourney && (
      <TreeGrowthJourney 
        currentStage={data.growthStage}
        currentStreak={data.currentStreak}
        darkMode={darkMode}
      />
    )}
  </>
  );
}

function getProgressPercentage(streak, stage) {
  const ranges = {
    empty: { min: 0, max: 1 },
    seed: { min: 1, max: 3 },
    sprout: { min: 3, max: 7 },
    sapling: { min: 7, max: 14 },
    tree: { min: 14, max: 21 },
    mature_tree: { min: 21, max: 30 },
    flowering_tree: { min: 30, max: 50 },
    fruit_tree: { min: 50, max: 100 },
    ancient_tree: { min: 100, max: 100 }
  };
  
  const range = ranges[stage];
  if (!range) return "0%";
  
  if (stage === 'ancient_tree') return "100%";
  
  const progress = Math.min(((streak - range.min) / (range.max - range.min)) * 100, 100);
  return `${Math.max(progress, 0)}%`;
}

export default TreeGrowth;
