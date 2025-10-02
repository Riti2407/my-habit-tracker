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

  //const dailyStreak = getDailyStreak(completed, weekDates, editableHabits);

  // Show encouragement/notification when all or no habits done today
useEffect(() => {
  const todayKey = new Date().toISOString().split("T")[0];

  // Keys for today’s alerts
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
    <div>
      {/* Daily Completed Habits + Progress Bar */}
      <div className={`summary-section ${darkMode ? " dark" : ""}`}>
        <h2 className="summary-title">
          You completed {todayCompletedCount}/{editableHabits.length} habits today!
        </h2>
        <div className="summary-progress-bar">
          <div
            className="summary-progress"
            style={{ width: `${todayPercent}%` }}
          ></div>
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          {todayCompletedCount === editableHabits.length && editableHabits.length > 0 ? (
            <span className="motivation-message">
              Awesome! You finished all habits today! 🎉
            </span>
          ) : todayCompletedCount === 0 && editableHabits.length > 0 ? (
            <span className="motivation-message">
              Let's start a habit today! 🚀
            </span>
          ) : null}
        </div>
        <div >
          <span className="daily-streak-badge">
            <b>Streak:</b> {overallStreak}
            { overallStreak > 0 && <span className="flame">🔥</span>}
          </span>
        </div>
        <div className="summary-stats">
          <div className="summary-week-box">
            Week: {Math.round((totalCompleted / (editableHabits.length * 7)) * 100)}%
          </div>
          <button className="reset-week-btn" onClick={handleReset}>
            Reset Week
          </button>
        </div>
      </div>

      {/* Week range */}
      <div className="week-header mb-4 text-center">
        <p className="week-range">
          Week of {new Date(weekDates[0]).toLocaleDateString()} -{" "}
          {new Date(weekDates[6]).toLocaleDateString()}
        </p>
      </div>

      {/* Tracker cards, pass todayString for highlight */}
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
      <TreeGrowth 
        completedHabits={completed} 
        habitKeys={editableHabits.map(h => h.key)}
        darkMode={darkMode} 
      />
    </div>
  );
};

export default Home;
