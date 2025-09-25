import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { calculateStreaks, getCongrats } from "../utils/streakCalculator";

function TreeGrowth({ completedHabits, habitKeys, darkMode }) {
  const { t, ready } = useTranslation();
  const [data, setData] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (ready && completedHabits && habitKeys) {
      const newData = calculateStreaks(completedHabits, habitKeys);
      
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
    const levels = { empty: 0, seed: 1, sprout: 2, tree: 3, blossom: 4 };
    return levels[stage] || 0;
  };

  if (!ready || !data) {
    return null;
  }

  const info = data.stageInfo;

  return (
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
        maxWidth: "350px",
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

      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
        {t("treeGrowth.title")}
      </h2>

      <motion.div
        key={data.growthStage}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 20,
          duration: 0.6 
        }}
        style={{
          fontSize: "4rem",
          marginBottom: "1rem",
          filter: data.growthStage === 'blossom' ? 'drop-shadow(0 0 10px #ec489950)' : 'none',
        }}
      >
        {info.emoji}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
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

      <div style={{ marginBottom: "1rem" }}>
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            fontSize: "0.9rem",
            marginBottom: "0.5rem" 
          }}
        >
          <span>
            <strong>Current Streak:</strong> {data.currentStreak} days
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
      </div>
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
          initial={{ width: 0 }}
          animate={{ width: getProgressPercentage(data.currentStreak, data.growthStage) }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            height: "100%",
            background: `linear-gradient(90deg, ${info.color}, ${info.color}aa)`,
            borderRadius: "9999px",
          }}
        />
      </div>
    </motion.div>
  );
}

function getProgressPercentage(streak, stage) {
  const ranges = {
    empty: { min: 0, max: 1 },
    seed: { min: 1, max: 3 },
    sprout: { min: 3, max: 5 },
    tree: { min: 5, max: 7 },
    blossom: { min: 7, max: 7 }
  };
  
  const range = ranges[stage];
  if (!range) return "0%";
  
  if (stage === 'blossom') return "100%";
  
  const progress = Math.min(((streak - range.min) / (range.max - range.min)) * 100, 100);
  return `${Math.max(progress, 0)}%`;
}

export default TreeGrowth;
