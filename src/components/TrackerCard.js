import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./TrackerCard.css"; // Assumes you have some styles here

function TrackerCard({
  habit,
  habitKey,
  completedDays,
  onCheck,
  weekDates = [], // Default to an empty array to prevent errors
  emoji,
  onEdit,
  darkMode,
}) {
  const { t, ready } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(habit?.label || habit);

  // --- All logic should be placed before the final return statement ---

  // 1. Helper function for displaying day labels
  const getDayLabel = (dateString) => {
    const date = new Date(dateString);
    // Note: Manual timezone adjustments can be tricky. A library like date-fns is more robust.
    const offset = date.getTimezoneOffset() * 60000;
    const adjusted = new Date(date.getTime() + offset);
    return adjusted.toLocaleDateString("en-US", { weekday: "short" });
  };

  // 2. Derived state: Calculate completion progress
  const completedCount = Object.values(completedDays).filter(Boolean).length;
  const totalDays = weekDates.length || 7; // Avoid division by zero
  const progressPercent = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;

  // Early return for when translation is not ready
  if (!ready) {
    return null;
  }

  // --- The single, final return statement for the component ---
  return (
    <div
      style={{
        padding: "1.25rem",
        borderRadius: "1rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transition: "transform 0.3s",
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        color: darkMode ? "#f9fafb" : "#111827",
      }}
      className="tracker-card-hover" // Use a class for hover effects for cleaner JSX
    >
      {/* Habit name with edit functionality */}
      <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem" }}>
        {emoji}{" "}
        {isEditing ? (
          <>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              // Add some basic styling
              style={{ marginRight: '8px' }}
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
            <span>{habit?.label || habit}</span>
            {onEdit && (
              <button onClick={() => setIsEditing(true)} style={{ marginLeft: "0.5rem" }}>
                Edit
              </button>
            )}
          </>
        )}
      </h3>

      {/* Days of the week checkboxes (using only one map) */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
        {weekDates.map((dateString) => (
          <label
            key={dateString}
            style={{ display: "flex", alignItems: "center", gap: "0.25rem", cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={!!completedDays[dateString]}
              onChange={() => onCheck(habitKey, dateString)}
              className="day-checkbox" // Use CSS for styling checkboxes
            />
            <span style={{ fontSize: "0.875rem", userSelect: "none" }}>{getDayLabel(dateString)}</span>
          </label>
        ))}
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: "0.5rem",
          width: "100%",
          backgroundColor: darkMode ? "#4b5563" : "#d1d5db",
          borderRadius: "9999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressPercent}%`,
            backgroundColor: "#22c55e",
            transition: "width 0.3s ease-in-out",
          }}
        />
      </div>
    </div>
  );
}

export default TrackerCard;