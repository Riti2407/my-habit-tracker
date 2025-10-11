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
import NotificationSettings from "./components/NotificationSettings";
import notificationManager from "./components/NotificationManager";
import Home  from "./components/Home";
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
  console.log("Completed state:", completed);

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
        <Header 
          toggleDarkMode={toggleDarkMode} 
          darkMode={darkMode} 
          habitList={editableHabits}
        />
        <Navbar  darkMode={darkMode} />
        {/* <NotificationSettings habitList={editableHabits} darkMode={darkMode} /> */}

        <main>
          <Routes>
            <Route
                path="/"
                element={
                  <Home
                    editableHabits={editableHabits}
                    completed={completed}
                    handleCompletion={handleCompletion}
                    handleHabitEdit={handleHabitEdit}
                    habitEmojis={habitEmojis}
                    darkMode={darkMode}
                    totalCompleted={totalCompleted}
                    getWeekDates={getWeekDates}
                    todayCompleted={todayCompleted}
                    todayPercent={todayPercent}
                    handleReset={handleReset}
                    
                  />
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
            <Route path="/About" element={<About darkMode={darkMode} />} />
            <Route path="/contact" element={<Contact darkMode={darkMode} />} />
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
