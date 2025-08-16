import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./TrackerCard.css";

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

  if (!ready) return null;

  // Helper: get day abbreviation from a date string
  const getDayLabel = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    const adjusted = new Date(date.getTime() + offset);
    return adjusted.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div className="tracker-card">
      <h3>


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
                  borderColor: completedDays[dateString] ? "#22c55e" : "#d1d5db",
                  backgroundColor: completedDays[dateString] ? "#22c55e" : "#e5e7eb",
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

