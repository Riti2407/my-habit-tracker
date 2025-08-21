import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Header from "./components/Header";
import TreeGrowth from "./components/TreeGrowth";
import Navbar from "./components/Navbar";
import MonthlySummary from "./components/MonthlySummary";
import Footer from './components/Footer';
import About from './components/About';
import Foot from './components/Foot';
// import withI18nReady from "./components/withI18nReady";
import TrackerCard from './components/TrackerCard';
import "./App.css";
import Contact from "./components/Contact";
import BackToTop from "./components/BackToTop";
import AddHabitForm from "./components/AddHabitForm";

import "./App.css";

// ---- DEFAULT HABITS (stay intact) ----
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

  // Default (translated) habits are computed, not stored
  const defaultHabits = useMemo(
    () => habitKeys.map((key) => ({ key, label: t(`habits.${key}`), emoji: habitEmojis[key] })),
    [t]
  );

  // ---- Custom Habits (CRUD + persistence) ----
  const [customHabits, setCustomHabits] = useState(() => {
    const saved = localStorage.getItem("customHabits");
    return saved ? JSON.parse(saved) : []; // [{key,label,emoji?}]
  });

  // ---- Theme ----
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // ---- Completions ----
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem("completedHabits");
    return saved ? JSON.parse(saved) : {};
  });

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

  const totalCompleted = Object.values(completed).reduce((sum, days) => {
    return sum + Object.values(days || {}).filter(Boolean).length;
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

  // ---- CRUD for custom habits ----
  const persistCustomHabits = (next) => {
    setCustomHabits(next);
    localStorage.setItem("customHabits", JSON.stringify(next));
  };

  const addHabit = (label) => {
    const key = `custom_${Date.now()}`; // unique key
    const newHabit = { key, label, emoji: "✨" };
    // unshift to keep newest on top
    const next = [newHabit, ...customHabits];
    persistCustomHabits(next);
    // ensure a container exists for completion map (not required, but neat)
    setCompleted((prev) => {
      const updated = { ...prev, [key]: prev[key] || {} };
      localStorage.setItem("completedHabits", JSON.stringify(updated));
      return updated;
    });
  };

  const editHabit = (key, newLabel) => {
    const next = customHabits.map((h) => (h.key === key ? { ...h, label: newLabel } : h));
    persistCustomHabits(next);
  };

  const deleteHabit = (key) => {
    const next = customHabits.filter((h) => h.key !== key);
    persistCustomHabits(next);
    // Remove its history as well
    setCompleted((prev) => {
      if (!prev[key]) return prev;
      const updated = { ...prev };
      delete updated[key];
      localStorage.setItem("completedHabits", JSON.stringify(updated));
      return updated;
    });
  };

  // ---- Render list: custom on top, then defaults ----
  const combinedHabits = [...customHabits, ...defaultHabits];

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
                  {/* Add Habit (custom only, non-destructive) */}
                  <AddHabitForm onAdd={addHabit} darkMode={darkMode} />

                  <div className="trackers">
                    {combinedHabits.map((habit, idx) => (
                      <TrackerCard
                        key={habit.key || idx}
                        habit={habit}
                        habitKey={habit.key}
                        completedDays={completed[habit.key] || {}}
                        onCheck={(date) => handleCompletion(habit.key, date)}
                        weekDates={getWeekDates()}
                        emoji={habit.emoji || "✨"}
                        darkMode={darkMode}
                        isCustom={String(habit.key).startsWith("custom_")}
                        onEdit={
                          String(habit.key).startsWith("custom_")
                            ? (newLabel) => editHabit(habit.key, newLabel)
                            : undefined
                        }
                        onDelete={
                          String(habit.key).startsWith("custom_")
                            ? () => deleteHabit(habit.key)
                            : undefined
                        }
                      />
                    ))}
                  </div>

                  <TreeGrowth completedCount={totalCompleted} />
                </div>
              }
            />
            <Route
              path="/summary"
              element={<MonthlySummary habitList={combinedHabits} completedData={completed} />}
            />
            <Route path="/About" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />
        <Foot />
        <BackToTop />
      </div>
    </Router>
  );
}

export default App;

