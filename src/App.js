import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Header from "./components/Header";
import TreeGrowth from "./components/TreeGrowth";
import Navbar from "./components/Navbar";
import MonthlySummary from "./components/MonthlySummary";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import About from "./components/About";
import Foot from "./components/Foot";
import TrackerCard from "./components/TrackerCard";
import Contact from "./components/Contact";
import BackToTop from "./components/BackToTop";

import Profile from "./components/Profile"; // Import the Profile component
=======
import NotificationSettings from "./components/NotificationSettings";
import notificationManager from "./components/NotificationManager";


import Signup from "./components/Signup";
import Login from "./components/login";

// --- HABIT KEYS + EMOJIS ---
const habitKeys = [
  "wakeUpTime",
  "waterIntake",
  "sleep",
  "meditation",
  "exercise",
  "healthyEating",
  "gratitude",
  "journaling",
  "screenTime",
  "study",
  "workout",
  "steps",
  "selfCare",
  "goalSetting",
  "skincare",
];

const habitEmojis = {
  wakeUpTime: "⏰",
  waterIntake: "💧",
  sleep: "🛌",
  meditation: "🧘‍♂️",
  exercise: "🏋️‍♀️",
  healthyEating: "🥗",
  gratitude: "🙏",
  journaling: "📝",
  screenTime: "📱",
  study: "📚",
  workout: "💪",
  steps: "🚶‍♂️",
  selfCare: "🛁",
  goalSetting: "🎯",
  skincare: "🧴",
};

function App() {
  const { t } = useTranslation();

  // Editable habit labels
  const [editableHabits, setEditableHabits] = useState(
    habitKeys.map((key) => ({ key, label: t(`habits.${key}`) }))
  );

  const handleHabitEdit = (habitKey, newLabel) => {
    setEditableHabits((prev) =>
      prev.map((habit) =>
        habit.key === habitKey ? { ...habit, label: newLabel } : habit
      )
    );
  };

  // --- STATE MANAGEMENT ---
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem("completedHabits");
    return saved ? JSON.parse(saved) : {};
  });

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Initialize notifications on app load
  useEffect(() => {
    const initializeNotifications = async () => {
      const savedSettings = localStorage.getItem("notificationSettings");
      if (savedSettings && notificationManager.getPermission() === "granted") {
        const settings = JSON.parse(savedSettings);

        Object.entries(settings).forEach(([habitKey, setting]) => {
          if (setting.enabled && setting.time && setting.habitLabel) {
            notificationManager.scheduleNotification(
              habitKey,
              setting.habitLabel,
              setting.time
            );
          }
        });
      }
    };

    initializeNotifications();
  }, []);

  // Track completion with notification feedback
  const handleCompletion = (habitKey, dateString) => {
    setCompleted((prev) => {
      const updated = {
        ...prev,
        [habitKey]: {
          ...prev[habitKey],
          [dateString]: !prev[habitKey]?.[dateString],
        },
      };
      localStorage.setItem("completedHabits", JSON.stringify(updated));

      if (updated[habitKey][dateString]) {
        const habit = editableHabits.find((h) => h.key === habitKey);
        const habitName = habit?.label || habitKey;
        const emoji = habitEmojis[habitKey] || "✅";

        const completedDates = Object.keys(updated[habitKey] || {})
          .filter((date) => updated[habitKey][date])
          .sort();

        let currentStreak = 0;
        if (completedDates.includes(dateString)) {
          currentStreak = 1;
          for (let i = completedDates.length - 2; i >= 0; i--) {
            const prevDate = new Date(completedDates[i]);
            const nextDate = new Date(completedDates[i + 1]);
            const diffTime = Math.abs(nextDate - prevDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
              currentStreak++;
            } else {
              break;
            }
          }
        }

        if (notificationManager.getPermission() === "granted") {
          setTimeout(() => {
            notificationManager.sendNotification(`${emoji} Habit Completed!`, {
              body: `Great job! You completed "${habitName}". Current streak: ${currentStreak} days!`,
              tag: `completion-${habitKey}`,
              silent: false,
            });
          }, 500);
        }
      }

      return updated;
    });
  };

  // Completed count
  const totalCompleted = Object.values(completed).reduce((sum, days) => {
    return sum + Object.values(days).filter(Boolean).length;
  }, 0);

  const getWeekDates = () => {
    const today = new Date();
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - today.getDay() + i);
      week.push(d.toISOString().split("T")[0]);
    }
    return week;
  };

  // Reset function
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset everything?")) {
      notificationManager.clearAllNotifications();
      localStorage.removeItem("notificationSettings");
      localStorage.removeItem("completedHabits");
      setCompleted({});
      window.location.reload();
    }
  };

  const todayDate = new Date().toISOString().split("T")[0];
  const todayCompleted = editableHabits.filter(
    (habit) => completed[habit.key]?.[todayDate]
  ).length;
  const todayPercent = Math.round(
    (todayCompleted / editableHabits.length) * 100
  );

  return (
    <Router>
      <div className={`app-container ${darkMode ? "dark" : ""}`}>
        <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <Navbar />

        <NotificationSettings habitList={editableHabits} darkMode={darkMode} />

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <div
                    className="summary-section"
                    style={{
                      padding: "1rem",
                      marginBottom: "2rem",
                      textAlign: "center",
                      backgroundColor: darkMode ? "#1f2937" : "#f9fafb",
                      borderRadius: "1rem",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    <h2
                      style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}
                    >
                      Weekly Progress: {totalCompleted}/
                      {editableHabits.length * 7} completed
                    </h2>
                    <p
                      style={{
                        color: darkMode ? "#d1d5db" : "#6b7280",
                        fontSize: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      Today: {todayCompleted}/{editableHabits.length} habits (
                      {todayPercent}%)
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: darkMode ? "#065f46" : "#ecfdf5",
                          borderRadius: "0.5rem",
                          fontSize: "0.875rem",
                        }}
                      >
                        Week:{" "}
                        {Math.round(
                          (totalCompleted / (editableHabits.length * 7)) * 100
                        )}
                        %
                      </div>
                      <button
                        onClick={handleReset}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "0.5rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        Reset Week
                      </button>
                    </div>
                  </div>

                  <div className="week-header mb-4 text-center">
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: darkMode ? "#d1d5db" : "#6b7280",
                      }}
                    >
                      Week of{" "}
                      {new Date(getWeekDates()[0]).toLocaleDateString()} -{" "}
                      {new Date(getWeekDates()[6]).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="trackers">
                    {editableHabits.map((habit, idx) => (
                      <TrackerCard
                        key={idx}
                        habit={habit}
                        habitKey={habit.key}
                        completedDays={completed[habit.key] || {}}
                        onCheck={(dateString) =>
                          handleCompletion(habit.key, dateString)
                        }
                        weekDates={getWeekDates()}
                        emoji={habitEmojis[habit.key]}
                        onEdit={(newLabel) =>
                          handleHabitEdit(habit.key, newLabel)
                        }
                        darkMode={darkMode}
                      />
                    ))}
                  </div>
                  <TreeGrowth
                    completedCount={totalCompleted}
                    darkMode={darkMode}
                  />
                </div>
              }
            />
            <Route
              path="/summary"
              element={
                <MonthlySummary
                  habitList={editableHabits}
                  completedData={completed}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  habitList={editableHabits}
                  completedData={completed}
                  habitEmojis={habitEmojis}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/profile" element={<Profile />} />
=======


              <Route path="/contact" element={<Contact darkMode={darkMode} />} />

            <Route path="/login" element={<Login /> } />

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />


          </Routes>
        </main>

        <Foot />
        <BackToTop />
      </div>
    </Router>
  );
}

export default App;
