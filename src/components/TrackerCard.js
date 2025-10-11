import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./TrackerCard.css";

function computeStreaks(dates) {
  if (!dates || dates.length === 0)
    return { currentStreak: 0, bestStreak: 0, bestStreakDates: new Set() };
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
  return { currentStreak, bestStreak, bestStreakDates: new Set(bestStreakDates) };
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
  todayString
}) {
  const { t, ready } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(habit?.label || habit);

  const completedDates = Object.keys(completedDays || {}).filter(
    (d) => completedDays[d]
  );
 const { currentStreak, bestStreak, bestStreakDates } = computeStreaks(completedDates);


  if (!ready) return null;

  const getDayLabel = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    const adjusted = new Date(date.getTime() + offset);
    return adjusted.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div className={`tracker-card ${darkMode ? "dark" : ""}`}>
      {/* Card Header */}
      <div className="card-header">
        <div className="habit-name-section">
          <span className="habit-emoji">{emoji}</span>
          {isEditing ? (
            <div className="edit-mode">
              <input
                className="habit-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
              />
              <div className="edit-buttons">
                <button
                  className="save-btn"
                  onClick={() => {
                    onEdit(inputValue);
                    setIsEditing(false);
                  }}
                >
                  ✓
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="habit-name">{habit?.label || habit}</h3>
              {onEdit && (
                <button
                  className="edit-icon-btn"
                  onClick={() => setIsEditing(true)}
                  title="Edit habit name"
                >
                  ✏️
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Streak Badges */}
      <div className="streak-container">
        <div className="streak-badge current">
          <span className="badge-icon">🔥</span>
          <div className="badge-content">
            <span className="badge-label">{t("Current Streak")}</span>
            <span className="badge-value">{currentStreak}</span>
          </div>
        </div>
        <div className="streak-badge best">
          <span className="badge-icon">🏆</span>
          <div className="badge-content">
            <span className="badge-label">{t("Best Streak")}</span>
            <span className="badge-value">{bestStreak}</span>
          </div>
        </div>
      </div>

      {/* Days Grid */}
      <div className="days-grid">
        {(weekDates || []).map((dateString) => {
          const label = getDayLabel(dateString);
          const isDone = !!completedDays[dateString];
     const inStreak = bestStreakDates?.has(dateString);

          const isToday = dateString === todayString;
          
          return (
            <label
              key={dateString}
              className={`day-checkbox ${isDone ? "checked" : ""} ${isToday ? "today" : ""} ${inStreak ? "in-streak" : ""}`}
            >
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => onCheck(dateString)}
              />
              <div className="checkbox-custom">
                {isDone && <span className="checkmark">✓</span>}
              </div>
              <span className="day-label">{label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default TrackerCard;