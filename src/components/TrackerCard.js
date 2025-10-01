import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./TrackerCard.css";

function computeStreaks(dates) {
  if (!dates || dates.length === 0)
    return { currentStreak: 0, bestStreak: 0, streakDates: new Set() };
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
  todayString
}) {
  const { t, ready } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(habit?.label || habit);

  const completedDates = Object.keys(completedDays || {}).filter(
    (d) => completedDays[d]
  );
  const { currentStreak, bestStreak, streakDates: streakDateSet } =
    computeStreaks(completedDates);

  if (!ready) return null;

  const getDayLabel = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    const adjusted = new Date(date.getTime() + offset);
    return adjusted.toLocaleDateString("en-US", { weekday: "short" });
  };

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
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-8px)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "translateY(0)")
      }
    >
      {/* Habit name with edit option */}
      <h3
        style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          marginBottom: "0.75rem",
        }}
      >
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
              <button
                className="edit-btn"
                onClick={() => setIsEditing(true)}
                style={{ marginLeft: "0.5rem" }}
              >
                Edit
              </button>
            )}
          </>
        )}
      </h3>

      {/* Streak badges */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <span className="streak-badge">
          🔥 {t("Current Streak")}: {currentStreak}
        </span>
        <span className="best-streak-badge">
          🏆 {t("Best Streak")}: {bestStreak}
        </span>
      </div>

      {/* Days checkboxes with streak highlight & today's highlight */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        {(weekDates || []).map((dateString) => {
          const label = getDayLabel(dateString);
          const isDone = !!completedDays[dateString];
          const inStreak = streakDateSet.has(dateString);
          const isToday = dateString === todayString;
          return (
            <label
              key={dateString}
              className={`card-day-label${isToday ? " today" : ""}${inStreak ? " streak" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                cursor: "pointer",
                fontWeight: isToday ? "bold" : "normal",
                color: isToday ? "#ff4081" : undefined,
                borderBottom: isToday ? "2px solid #ff4081" : "",
              }}
            >
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => onCheck(dateString)}
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  borderRadius: "0.25rem",
                  border: "1px solid",
                  borderColor: isDone ? "#22c55e" : "#d1d5db",
                  backgroundColor: isDone ? "#22c55e" : "#e5e7eb",
                  outline: inStreak ? "2px solid tomato" : "none",
                  transition: "all 0.2s",
                }}
              />
              <span style={{
                fontSize: "0.875rem",
                userSelect: "none",
                fontWeight: isToday ? "bold" : undefined,
                color: isToday ? "#ff4081" : undefined
              }}>
                {label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default TrackerCard;
