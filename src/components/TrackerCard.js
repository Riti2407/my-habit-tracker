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
  const { currentStreak, bestStreak, streakDates: streakDateSet} = 
  computeStreaks(completedDates);

  if (!ready) return null;

  // Helper: get day abbreviation from a date string
  const getDayLabel = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    const adjusted = new Date(date.getTime() + offset);
    return adjusted.toLocaleDateString("en-US", { weekday: "short" });
  };

  // Completion progress
  const completedCount = Object.values(completedDays).filter(Boolean).length;
  const totalDays = weekDates ? weekDates.length : 7;
  const progressPercent = Math.round((completedCount / totalDays) * 100);

  return (
    <div
      style={{
        padding: "1.25rem",
        borderRadius: "1rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transition: "transform 0.3s",
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        color: darkMode ? "#f9fafb" : "#111827",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    > 

      {/* Habit name with edit option */}
      <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.75rem" }}>
        {emoji}{" "}
        {isEditing ? (
          <>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              onClick={() => {
                onEdit(inputValue);
                setIsEditing(false);
              }}
            >
              Save
            </button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            {habit?.label || habit}{" "}
            {onEdit && (
              <button onClick={() => setIsEditing(true)} style={{ marginLeft: "0.5rem" }}>
                Edit
              </button>
            )}
          </>
        )}
      </h3>

            {/*  NEW: Streak badges */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <span
          style={{
            fontSize: "0.85rem",
            padding: "2px 6px",
            borderRadius: "12px",
            backgroundColor: currentStreak > 0 ? "rgba(255,100,100,0.2)" : "#e5e7eb",
            fontWeight: currentStreak > 0 ? "600" : "400",
          }}
        >
          🔥 {t("Current Streak")}: {currentStreak}
        </span>
        <span
          style={{
            fontSize: "0.85rem",
            padding: "2px 6px",
            borderRadius: "12px",
            backgroundColor: "#e5e7eb",
          }}
        >
          🏆 {t("Best Streak")}: {bestStreak}
        </span>
      </div>


      <div className="days-row">
        {/* Map over the weekDates array passed in as a prop */}
        {weekDates.map((dateString) => (
          <label key={dateString} className="day-label">
            <input
              type="checkbox"
              // Check for completion using the full date string
              checked={!!completedDays[dateString]}
              // Pass the habit's key and the full date string to the onCheck handler
              onChange={() => onCheck(habitKey, dateString)}
            />
            {/* Display the short day name (e.g., Mon, Tue) */}
            <span>{getDayLabel(dateString)}</span>
          </label>
        ))}
      </div>


      {/* Days checkboxes */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
        {(weekDates || []).map((dateString) => {
          const label = getDayLabel(dateString);
          const isDone = !!completedDays[dateString];
          const inStreak = streakDateSet.has(dateString);
          return (
            <label
              key={dateString}
              style={{ display: "flex", alignItems: "center", gap: "0.25rem", cursor: "pointer" }}
            >
              <input
                type="checkbox"
                checked={!!completedDays[dateString]}
                onChange={() => onCheck(dateString)}
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  borderRadius: "0.25rem",
                  border: "1px solid",
                  borderColor: isDone ? "#22c55e" : "#d1d5db",          //  CHANGED
                  backgroundColor: isDone ? "#22c55e" : "#e5e7eb",      //  CHANGED
                  outline: inStreak ? "2px solid tomato" : "none", 
                  transition: "all 0.2s",
                }}
              />
              <span style={{ fontSize: "0.875rem", userSelect: "none" }}>{label}</span>
            </label>
          );
        })}
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: "0.5rem",
          width: "100%",
          backgroundColor: "#d1d5db",
          borderRadius: "9999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressPercent}%`,
            backgroundColor: "#22c55e",
            transition: "width 0.3s",
          }}
        />
      </div>
    </div>
  );
}

export default TrackerCard;

