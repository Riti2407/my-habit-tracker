import React, { useEffect, useState } from "react";
import "./Home.css";
import TrackerCard from "./TrackerCard";
import TreeGrowth from "./TreeGrowth";

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

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

function getOverallStreak(completed, editableHabits) {
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

  const sortedDates = [];
  let current = new Date(startDate);
  while (current <= today) {
    sortedDates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  let streak = 0;
  for (let i = sortedDates.length - 1; i >= 0; i--) {
    const date = sortedDates[i];
    const allDone = editableHabits.every(habit => completed[habit.key]?.[date]);
    if (allDone) streak++;
    else break;
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
  const todayCompletedCount = editableHabits.filter(
    h => completed[h.key]?.[todayString]
  ).length;

  const todayPercent =
    Math.round((todayCompletedCount / editableHabits.length) * 100) || 0;

  const allDates = getAllTrackedDates(completed);
  const overallStreak = getOverallStreak(completed, editableHabits, allDates);

  const [showMessage, setShowMessage] = useState("");

  useEffect(() => {
    const todayKey = new Date().toISOString().split("T")[0];
    const startedKey = `startedAlert-${todayKey}`;
    const finishedKey = `finishedAlert-${todayKey}`;

    if (
      todayCompletedCount === editableHabits.length &&
      editableHabits.length > 0 &&
      !sessionStorage.getItem(finishedKey)
    ) {
      setShowMessage("🔥 Amazing! You crushed all your habits today!");
      sessionStorage.setItem(finishedKey, "true");
    } else if (
      todayCompletedCount === 0 &&
      editableHabits.length > 0 &&
      !sessionStorage.getItem(startedKey)
    ) {
      setShowMessage("⚡ Let's start strong! Pick one habit now!");
      sessionStorage.setItem(startedKey, "true");
    }

    const timer = setTimeout(() => setShowMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [todayCompletedCount, editableHabits.length]);

  return (
    <div className={`home-container ${darkMode ? "dark" : ""}`}>
      {/* Enhanced Landing Header */}
      <header className="hero">
        <h1 className="hero-title">✨ Habit Tracker</h1>
        <p className="hero-subtitle">
          Transform your life, one habit at a time 🌱
        </p>
      </header>

      {/* Notification */}
      {showMessage && <div className="floating-alert">{showMessage}</div>}

      {/* Enhanced Daily Progress Section */}
      <section className={`summary-section ${darkMode ? "dark" : ""}`}>
        <h2 className="summary-title">
          Today's Progress
        </h2>
        
        <p className="summary-desc">
          {todayCompletedCount}/{editableHabits.length} habits completed
        </p>

        <div className="summary-progress-bar">
          <div
            className="summary-progress"
            style={{ width: `${todayPercent}%` }}
          ></div>
        </div>
        <p className="progress-label">{todayPercent}% Complete</p>

        <div className="daily-stats">
          <span className="daily-streak-badge">
            <span className="flame">🔥</span> {overallStreak} Day Streak
          </span>
          <span className="best-streak-badge">
            📊 Weekly: {Math.round((totalCompleted / (editableHabits.length * 7)) * 100)}%
          </span>
        </div>

        <button className="reset-week-btn" onClick={handleReset}>
          🔄 Reset Week
        </button>
      </section>

      {/* Tracker Cards */}
      <section className="trackers">
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
      </section>

      {/* Enhanced Growth Section */}
      <section className="growth-section">
        <h3 className="growth-title">🌳 Your Progress Tree</h3>
        <TreeGrowth completedCount={totalCompleted} darkMode={darkMode} />
      </section>
    </div>
  );
};

export default Home;