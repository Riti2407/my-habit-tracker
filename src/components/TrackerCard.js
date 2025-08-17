import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function TrackerCard({
  habit,
  habitKey,
  completedDays,
  onCheck,
  weekDates,
  emoji,
  onEdit,
  onDelete,
  isCustom,
  darkMode,
}) {
  const { t, ready } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(habit?.label || habit);

  if (!ready) return null;

  // Day label helper (avoid UTC shift)
  const getDayLabel = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    const adjusted = new Date(date.getTime() + offset);
    return adjusted.toLocaleDateString("en-US", { weekday: "short" });
  };

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
      {/* Header: name + actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.75rem",
        }}
      >
        <h3 style={{ fontSize: "1.125rem", fontWeight: 600, margin: 0 }}>
          {emoji}{" "}
          {isEditing ? (
            <>
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{
                  padding: "0.25rem 0.4rem",
                  borderRadius: "0.5rem",
                  border: "1px solid",
                  borderColor: darkMode ? "#374151" : "#d1d5db",
                  background: darkMode ? "#111827" : "#fff",
                  color: darkMode ? "#f9fafb" : "#111827",
                }}
              />
            </>
          ) : (
            <>{habit?.label || habit}</>
          )}
        </h3>

        {/* Actions: only for custom habits */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.4rem" }}>
          {isCustom && !isEditing && (
            <>
              {onEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: "0.25rem 0.6rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #d1d5db",
                    background: darkMode ? "#111827" : "#fff",
                    color: darkMode ? "#f9fafb" : "#111827",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure? This will delete all tracked data for this habit."
                      )
                    ) {
                      onDelete();
                    }
                  }}
                  style={{
                    padding: "0.25rem 0.6rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #ef4444",
                    background: "#ef4444",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              )}
            </>
          )}
          {isCustom && isEditing && (
            <>
              <button
                onClick={() => {
                  const trimmed = (inputValue || "").trim();
                  if (!trimmed) return;
                  onEdit(trimmed);
                  setIsEditing(false);
                }}
                style={{
                  padding: "0.25rem 0.6rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  background: "#22c55e",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  padding: "0.25rem 0.6rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #d1d5db",
                  background: darkMode ? "#111827" : "#fff",
                  color: darkMode ? "#f9fafb" : "#111827",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Days */}
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

      {/* Progress */}
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
