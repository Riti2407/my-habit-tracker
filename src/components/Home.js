import React, { useEffect } from "react";
import "./Home.css";
import TrackerCard from "./TrackerCard";
import TreeGrowth from "./TreeGrowth";

// Utility: YYYY-MM-DD for today
function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

// Compute streak of days where all habits were completed, ending today
function getAllTrackedDates(completed) {
  if (!completed) return [];
  const datesSet = new Set();
  Object.values(completed).forEach(daysObj => {
    if (daysObj) {
      Object.keys(daysObj).forEach(date => datesSet.add(date));
    }
  });
  return Array.from(datesSet).sort();
}

// completed - habits data: { habitKey: { dateString: true/false, ... }, ... }
// editableHabits - [{key: ...}, ...]
// weekDates - ["YYYY-MM-DD", ...] or any array of date strings (should cover all actual days tracked)
function getOverallStreak(completed, editableHabits) {
  // Collect all tracked dates from completed data
  const datesSet = new Set();
  Object.values(completed).forEach(daysObj => {
    if (daysObj) {
      Object.keys(daysObj).forEach(date => datesSet.add(date));
    }
  });

  if (datesSet.size === 0) return 0;

  const sortedTrackedDates = Array.from(datesSet).sort();
  const startDate = new Date(sortedTrackedDates[0]);
  const today = new Date();

  // Generate all dates from startDate till today
  const sortedDates = [];
  let current = new Date(startDate);
  while (current <= today) {
    sortedDates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  console.log("All tracked dates:", sortedDates);

  // Traverse from last date backwards, increase streak if all habits done on that day
  let streak = 0;
  for (let i = sortedDates.length - 1; i >= 0; i--) {
    const date = sortedDates[i];
    const allDone = editableHabits.every(habit => completed[habit.key]?.[date]);
    console.log(allDone, date);

    if (allDone) streak++;
    else break; // streak broken
  }

  return streak;
}


const Home = ({
  totalCompleted,
  editableHabits,
  handleReset,
  getWeekDates,
  completed,
  handleCompletion,
  habitEmojis,
  handleHabitEdit,
  darkMode,
}) => {
  const weekDates = getWeekDates();
  const todayString = getTodayString();
  const todayCompletedCount = editableHabits.filter(h => completed[h.key]?.[todayString]).length;
  const todayPercent = Math.round((todayCompletedCount / editableHabits.length) * 100) || 0;
  const allDates = getAllTrackedDates(completed); // ["YYYY-MM-DD", ...] covering all history
  const overallStreak = getOverallStreak(completed, editableHabits, allDates);

  // Show encouragement/notification when all or no habits done today
  useEffect(() => {
    const todayKey = new Date().toISOString().split("T")[0];

    // Keys for today's alerts
    const startedKey = `startedAlert-${todayKey}`;
    const finishedKey = `finishedAlert-${todayKey}`;

    if (
      todayCompletedCount === editableHabits.length &&
      editableHabits.length > 0 &&
      !localStorage.getItem(finishedKey)
    ) {
      alert("Awesome! You finished all habits today! 🎉");
      localStorage.setItem(finishedKey, "true");
    } else if (
      todayCompletedCount === 0 &&
      editableHabits.length > 0 &&
      !localStorage.getItem(startedKey)
    ) {
      alert("Let's start a habit today! 🚀");
      localStorage.setItem(startedKey, "true");
    }
  }, [todayCompletedCount, editableHabits.length]);

  return (
    <div className="home-container">
      {/* Hero Section with Daily Progress */}
      <div className={`hero-section ${darkMode ? "dark" : ""}`}>
        <div className="hero-content">
          <div className="progress-circle-container">
            <svg className="progress-ring" width="180" height="180">
              <circle
                className="progress-ring-bg"
                cx="90"
                cy="90"
                r="75"
              />
              <circle
                className="progress-ring-fill"
                cx="90"
                cy="90"
                r="75"
                style={{
                  strokeDasharray: `${2 * Math.PI * 75}`,
                  strokeDashoffset: `${2 * Math.PI * 75 * (1 - todayPercent / 100)}`
                }}
              />
              <text x="90" y="85" className="progress-text-number">
                {todayPercent}%
              </text>
              <text x="90" y="105" className="progress-text-label">
                Today
              </text>
            </svg>
          </div>
          
          <div className="hero-info">
            <h1 className="hero-title">
              {todayCompletedCount === editableHabits.length && editableHabits.length > 0 
                ? "🎉 Perfect Day!" 
                : todayCompletedCount === 0 && editableHabits.length > 0
                ? "🚀 Let's Begin!"
                : "Keep Going!"}
            </h1>
            <p className="hero-subtitle">
              {todayCompletedCount} of {editableHabits.length} habits completed
            </p>
            
            {/* Streak Badge */}
            {overallStreak > 0 && (
              <div className="hero-streak">
                <span className="streak-number">{overallStreak}</span>
                <span className="streak-label">Day Streak</span>
                <span className="streak-flame">🔥</span>
              </div>
            )}
          </div>
        </div>

        {/* Week Stats Bar */}
        <div className="week-stats-bar">
          <div className="week-stat-item">
            <span className="stat-label">Week Progress</span>
            <span className="stat-value">
              {Math.round((totalCompleted / (editableHabits.length * 7)) * 100)}%
            </span>
          </div>
          <div className="week-stat-divider"></div>
          <div className="week-stat-item">
            <span className="stat-label">Week Range</span>
            <span className="stat-value week-dates">
              {new Date(weekDates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(weekDates[6]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <button className="reset-week-btn" onClick={handleReset}>
            <span className="reset-icon">↻</span>
            Reset Week
          </button>
        </div>
      </div>

      {/* Habits Grid */}
      <div className="habits-section">
        <h2 className="section-title">
          <span className="title-icon">📋</span>
          Your Habits
        </h2>
        <div className="trackers">
          {editableHabits.map((habit, idx) => (
            <TrackerCard
              key={idx}
              habit={habit}
              habitKey={habit.key}
              completedDays={completed[habit.key] || {}}
              onCheck={dateString => handleCompletion(habit.key, dateString)}
              weekDates={weekDates}
              emoji={habitEmojis[habit.key]}
              onEdit={newLabel => handleHabitEdit(habit.key, newLabel)}
              darkMode={darkMode}
              todayString={todayString}
            />
          ))}
        </div>
      </div>

      {/* Tree Growth Section */}
      <TreeGrowth completedCount={totalCompleted} darkMode={darkMode} />
    </div>
  );
};

export default Home;