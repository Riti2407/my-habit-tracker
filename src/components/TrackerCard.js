import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./TrackerCard.css";

function computeStreaks(dates) {
  if (!dates || dates.length === 0) return { currentStreak: 0, bestStreak: 0, streakDates: new Set() };

  const sorted = [...dates].sort();
  let currentStreak = 1;
  let bestStreak = 1;
  let streakDates = [sorted[0]];

  let bestStreakDates = [...streakDates];

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      currentStreak++;
      streakDates.push(sorted[i]);
    } else {
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
        bestStreakDates = [...streakDates];
      }
      currentStreak = 1;
      streakDates = [sorted[i]];
    }
  }

  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
    bestStreakDates = [...streakDates];
  }

  return { currentStreak, bestStreak, streakDates: new Set(bestStreakDates) };
}

function TrackerCard({
  habit,
  habitKey,
  completedDays,
  onCheck,
  weekDates,
  emoji,
  onEdit,
  darkMode,
}) {
  const { t, ready } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(habit?.label || habit);
  const completedDates = Object.keys(completedDays || {}).filter(
    (d) => completedDays[d]
  );
  const { currentStreak, bestStreak, streakDates: streakDateSet } = 
    computeStreaks(completedDates);

  // Completion progress
  const completedCount = Object.values(completedDays).filter(Boolean).length;
  const totalDays = weekDates ? weekDates.length : 7;
  const progressPercent = Math.round((completedCount / totalDays) * 100);

  if (!ready) return null;

  // Helper: get day abbreviation from a date string
  const getDayLabel = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    const adjusted = new Date(date.getTime() + offset);
    return adjusted.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div className={`TrackerCard ${darkMode ? "dark" : ""}`}>
      {/* Habit name with edit option */}
      <h3>
        {emoji}{" "}
        {isEditing ? (
          <>
            <input
              className="edit-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="edit-buttons">
              <button
                onClick={() => {
                  onEdit(inputValue);
                  setIsEditing(false);
                }}
              >
                Save
              </button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            {habit?.label || habit}{" "}
            {onEdit && (
              <button 
                onClick={() => setIsEditing(true)} 
                style={{ marginLeft: "0.5rem", fontSize: "0.8rem", padding: "2px 6px" }}
              >
                Edit
              </button>
            )}
          </>
        )}
      </h3>

      {/* Streak badges */}
      <div className="streak-badges">
        <span className={`streak-badge ${currentStreak > 0 ? "current" : ""}`}>
          🔥 {t("Current Streak")}: {currentStreak}
        </span>
        <span className="streak-badge">
          🏆 {t("Best Streak")}: {bestStreak}
        </span>
      </div>

      {/* Days checkboxes */}
      <div className="days-row">
        {(weekDates || []).map((dateString) => {
          const label = getDayLabel(dateString);
          const isDone = !!completedDays[dateString];
          const inStreak = streakDateSet.has(dateString);
          return (
            <label key={dateString}>
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => onCheck(habitKey, dateString)}
                style={inStreak ? { outline: "2px solid tomato" } : {}}
              />
              <span>{label}</span>
            </label>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="progress">
        <div style={{ width: `${progressPercent}%` }} />
      </div>
    </div>
  );
}

export default TrackerCard;