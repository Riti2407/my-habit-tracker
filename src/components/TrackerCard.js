import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./TrackerCard.css";

// NoteModal component for editing notes
const NoteModal = ({ note, onSave, onCancel, darkMode }) => {
  const [text, setText] = useState(note);

  const modalStyle = {
    ...modalStyles.modal,
    backgroundColor: darkMode ? '#2d3748' : 'white',
    color: darkMode ? '#f9fafb' : '#111827',
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyle}>
        <h3>Edit Note</h3>
        <textarea
          style={{...modalStyles.textarea, backgroundColor: darkMode ? '#4a5568' : '#f9fafb', color: darkMode ? 'white' : 'black'}}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a note..."
        />
        <div style={modalStyles.buttons}>
          <button onClick={() => onSave(text)} style={modalStyles.saveButton}>Save</button>
          <button onClick={onCancel} style={modalStyles.cancelButton}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Styles for the modal
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    padding: '20px',
    borderRadius: '8px',
    width: '300px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  textarea: {
    width: '100%',
    height: '100px',
    marginBottom: '10px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  saveButton: {
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    background: '#f44336',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

function computeStreaks(completedDays) {
    const completedDates = Object.keys(completedDays || {}).filter(
        (d) => completedDays[d] && completedDays[d].completed
    );

  if (!completedDates || completedDates.length === 0) return { currentStreak: 0, bestStreak: 0 };

  const sorted = [...completedDates].sort();
  let currentStreak = 0;
  let bestStreak = 0;

  // Calculate best streak
  if (sorted.length > 0) {
      let currentBest = 0;
      let lastDate = null;
      for (const dateStr of sorted) {
          const date = new Date(dateStr);
          if (lastDate) {
              const diff = (date - lastDate) / (1000 * 60 * 60 * 24);
              if (diff === 1) {
                  currentBest++;
              } else {
                  currentBest = 1;
              }
          } else {
              currentBest = 1;
          }
          if (currentBest > bestStreak) {
              bestStreak = currentBest;
          }
          lastDate = date;
      }
  }

  // Calculate current streak
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  if (completedDays[todayStr]?.completed) {
    currentStreak = 1;
    let d = new Date(today);
    while (true) {
      d.setDate(d.getDate() - 1);
      const dStr = d.toISOString().split('T')[0];
      if (completedDays[dStr]?.completed) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else {
      // Check if streak ended yesterday
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      if(completedDays[yesterdayStr]?.completed) {
        currentStreak = 1;
        let d = new Date(yesterday);
        while (true) {
          d.setDate(d.getDate() - 1);
          const dStr = d.toISOString().split('T')[0];
          if (completedDays[dStr]?.completed) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
  }


  return { currentStreak, bestStreak };
}

function TrackerCard({
  habit,
  habitKey,
  completedDays,
  onCheck,
  onNoteSave,
  weekDates,
  emoji,
  onEdit,
  darkMode,
}) {
  const { t, ready } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(habit?.label || habit);
  const [noteModal, setNoteModal] = useState({ isOpen: false, date: null, note: '' });

  const { currentStreak, bestStreak } = computeStreaks(completedDays);

  if (!ready) return null;

  const getDayLabel = (dateString) => {
    const date = new Date(dateString);
    // Adjust for timezone to get the correct day
    const offset = date.getTimezoneOffset() * 60000;
    const adjusted = new Date(date.getTime() + offset);
    return adjusted.toLocaleDateString("en-US", { weekday: "short" });
  };

  const handleNoteClick = (dateString) => {
    const note = completedDays[dateString]?.note || '';
    setNoteModal({ isOpen: true, date: dateString, note });
  };

  const handleSaveNote = (noteText) => {
    onNoteSave(habitKey, noteModal.date, noteText);
    setNoteModal({ isOpen: false, date: null, note: '' });
  };

  const completedCount = Object.values(completedDays).filter(day => day && day.completed).length;
  const totalDays = weekDates ? weekDates.length : 7;
  const progressPercent = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;

  return (
    <div
      className="tracker-card-container"
      style={{
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        color: darkMode ? "#f9fafb" : "#111827",
      }}
    >
      {noteModal.isOpen && (
        <NoteModal
          note={noteModal.note}
          onSave={handleSaveNote}
          onCancel={() => setNoteModal({ isOpen: false, date: null, note: '' })}
          darkMode={darkMode}
        />
      )}

      <h3 className="habit-title">
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
                onClick={() => setIsEditing(true)}
                className="edit-button"
              >
                ✏️
              </button>
            )}
          </>
        )}
      </h3>

      <div className="streaks-container">
        <span className={`streak-badge ${currentStreak > 0 ? 'active' : ''}`}>
          � {t("Current Streak")}: {currentStreak}
        </span>
        <span className="streak-badge">
          🏆 {t("Best Streak")}: {bestStreak}
        </span>
      </div>

      <div className="days-row">
        {weekDates.map((dateString) => {
          const dayData = completedDays[dateString] || { completed: false, note: "" };
          const hasNote = dayData.note && dayData.note.trim() !== '';
          return (
            <div key={dateString} className="day-container">
              <label className="day-label">
                <span>{getDayLabel(dateString)}</span>
                <input
                  type="checkbox"
                  checked={!!dayData.completed}
                  onChange={() => onCheck(dateString)}
                />
              </label>
              <button className="note-button" onClick={() => handleNoteClick(dateString)} title={hasNote ? "Edit Note" : "Add Note"}>
                {hasNote ? '📝' : '🗒️'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

export default TrackerCard;
