
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import TrackerCard from "./TrackerCard";
import TreeGrowth from "./TreeGrowth";
import NotificationSettings from "./NotificationSettings"; // NEW IMPORT
import notificationManager from "./NotificationManager"; // NEW IMPORT
import "../App.css";

function HabitTrackerApp() {
  const { t } = useTranslation();

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  // Habit completion state
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem("completedHabits");
    return saved ? JSON.parse(saved) : {};
  });

  // NEW: Generate current week dates
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    const generateWeekDates = () => {
      const today = new Date();
      const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ...
      const dates = [];
      
      // Calculate start of week (Sunday)
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - currentDay + i);
        dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD format
      }
      
      setWeekDates(dates);
    };

    generateWeekDates();
  }, []);

  // NEW: Initialize notifications on app load
  useEffect(() => {
    const initializeNotifications = async () => {
      // Load saved notification settings
      const savedSettings = localStorage.getItem('notificationSettings');
      if (savedSettings && notificationManager.getPermission() === 'granted') {
        const settings = JSON.parse(savedSettings);
        
        // Reschedule all enabled notifications
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

    if (weekDates.length > 0) {
      initializeNotifications();
    }
  }, [weekDates]);

  const habitList = [
    { key: "wakeUpTime", label: t("habits.wakeUpTime"), tooltip: t("tooltips.wakeUpTime"), emoji: "⏰" },
    { key: "waterIntake", label: t("habits.waterIntake"), tooltip: t("tooltips.waterIntake"), emoji: "💧" },
    { key: "sleep", label: t("habits.sleep"), tooltip: t("tooltips.sleep"), emoji: "😴" },
    { key: "meditation", label: t("habits.meditation"), tooltip: t("tooltips.meditation"), emoji: "🧘" },
    { key: "exercise", label: t("habits.exercise"), tooltip: t("tooltips.exercise"), emoji: "💪" },
    { key: "healthyEating", label: t("habits.healthyEating"), tooltip: t("tooltips.healthyEating"), emoji: "🥗" },
    { key: "gratitude", label: t("habits.gratitude"), tooltip: t("tooltips.gratitude"), emoji: "🙏" },
    { key: "journaling", label: t("habits.journaling"), tooltip: t("tooltips.journaling"), emoji: "📝" },
    { key: "screenTime", label: t("habits.screenTime"), tooltip: t("tooltips.screenTime"), emoji: "📱" },
    { key: "study", label: t("habits.study"), tooltip: t("tooltips.study"), emoji: "📚" },
    { key: "workout", label: t("habits.workout"), tooltip: t("tooltips.workout"), emoji: "🏋️" },
    { key: "steps", label: t("habits.steps"), tooltip: t("tooltips.steps"), emoji: "👟" },
    { key: "selfCare", label: t("habits.selfCare"), tooltip: t("tooltips.selfCare"), emoji: "🛁" },
    { key: "goalSetting", label: t("habits.goalSetting"), tooltip: t("tooltips.goalSetting"), emoji: "🎯" },
    { key: "skincare", label: t("habits.skincare"), tooltip: t("tooltips.skincare"), emoji: "✨" },
  ];

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("theme", !prev ? "dark" : "light");
      return !prev;
    });
  };

  // UPDATED: Handle completion with date-based tracking
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
      
      // NEW: Show encouraging notification when habit is completed
      if (updated[habitKey][dateString]) {
        const habit = habitList.find(h => h.key === habitKey);
        const habitName = habit?.label || habitKey;
        
        // Calculate current streak for this habit
        const completedDates = Object.keys(updated[habitKey] || {})
          .filter(date => updated[habitKey][date])
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
        
        // Send celebratory notification
        if (notificationManager.getPermission() === 'granted') {
          setTimeout(() => {
            notificationManager.sendNotification(
              `${habit?.emoji || '✅'} Habit Completed!`,
              {
                body: `Great job! You completed "${habitName}". Current streak: ${currentStreak} days!`,
                tag: `completion-${habitKey}`,
                silent: false
              }
            );
          }, 500); // Small delay to feel more natural
        }
      }
      
      return updated;
    });
  };

  const resetWeek = () => {
    if (window.confirm("Are you sure you want to reset all habits for this week?")) {
      setCompleted({});
      localStorage.removeItem("completedHabits");
      
      // NEW: Clear all notifications when resetting
      notificationManager.clearAllNotifications();
      localStorage.removeItem('notificationSettings');
    }
  };

  const totalCompleted = Object.values(completed).reduce(
    (sum, days) => sum + Object.values(days).filter(Boolean).length,
    0
  );

  const totalPossible = habitList.length * 7;

  // NEW: Calculate today's completion percentage
  const todayDate = new Date().toISOString().split('T')[0];
  const todayCompleted = habitList.filter(habit => 
    completed[habit.key]?.[todayDate]
  ).length;
  const todayPercent = Math.round((todayCompleted / habitList.length) * 100);

  return (
    <div
      className={`app-container min-h-screen p-6 ${
        darkMode ? "dark bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

      {/* NEW: Notification Settings Component */}
      <NotificationSettings 
        habitList={habitList} 
        darkMode={darkMode} 
      />

      {/* Enhanced Weekly Summary */}
      <div className="summary flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="summary-stats">
          <h2 className="text-xl font-semibold mb-2 sm:mb-0">
            Weekly Progress: {totalCompleted}/{totalPossible} completed
          </h2>
          {/* NEW: Today's progress */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Today's Progress: {todayCompleted}/{habitList.length} habits ({todayPercent}%)
          </p>
        </div>
        <button
          onClick={resetWeek}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          Reset Week
        </button>
      </div>

      {/* NEW: Week dates display */}
      <div className="week-header mb-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Week of {new Date(weekDates[0]).toLocaleDateString()} - {new Date(weekDates[6]).toLocaleDateString()}
        </p>
      </div>

      {/* Habit Tracker Cards */}
      <main className="trackers grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {habitList.map((habit) => (
          <TrackerCard
            key={habit.key}
            habitKey={habit.key}
            habit={habit}
            completedDays={completed[habit.key] || {}}
            onCheck={handleCompletion}
            weekDates={weekDates}
            emoji={habit.emoji}
            darkMode={darkMode}
          />
        ))}
      </main>

      {/* Tree Growth visualization */}
      <div className="mt-10">
        <TreeGrowth 
          completedHabits={completed} 
          habitKeys={habits.map(h => h.key)}
          darkMode={darkMode} 
        />
      </div>
    </div>
  );
}

export default HabitTrackerApp;