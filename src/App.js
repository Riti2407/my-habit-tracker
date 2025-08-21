import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Header from "./components/Header";
import TreeGrowth from "./components/TreeGrowth";
import Navbar from "./components/Navbar";
import MonthlySummary from "./components/MonthlySummary";
import Footer from './components/Footer';
import About from './components/About';
import Foot from './components/Foot';
import TrackerCard from './components/TrackerCard';
import Contact from "./components/Contact";
import BackToTop from "./components/BackToTop";
import "./App.css";

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

// --- RESET FUNCTION ---
// const handleReset = () => {
//   if (window.confirm("Are you sure you want to reset everything?")) {
//     window.location.reload();
//   }
// };

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

  // Track completion
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
      return updated;
    });
  };

  // Completed count
  const totalCompleted = Object.values(completed).reduce((sum, days) => {
    return sum + Object.values(days).filter(Boolean).length;
  }, 0);

  // Get week dates (Sun → Sat)
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

  return (
    <Router>
      <div className={`app-container ${darkMode ? "dark" : ""}`}>
        <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <Navbar />

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <div className="trackers">
                    {editableHabits.map((habit, idx) => (
                      <TrackerCard
                        key={idx}
                        habit={habit}
                        habitKey={habit.key}
                        completedDays={completed[habit.key] || {}}
                        onCheck={(date) => handleCompletion(habit.key, date)}
                        weekDates={getWeekDates()}
                        emoji={habitEmojis[habit.key]}
                        onEdit={(newLabel) =>
                          handleHabitEdit(habit.key, newLabel)
                        }
                        darkMode={darkMode}
                      />
                    ))}
                  </div>
                  <TreeGrowth completedCount={totalCompleted} />
                </div>
              }
            />
            <Route
              path="/summary"
              element={
                <MonthlySummary habitList={editableHabits} completedData={completed} />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Footer always visible */}
        <Footer />
        <Foot />
        <BackToTop />
      </div>
    </Router>
  );
}

export default App;