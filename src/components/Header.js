import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import "./Header.css";
import NotificationSettings from "./NotificationSettings";

function Header({ toggleDarkMode, darkMode, habitList: editableHabits }) {
  const { t, ready } = useTranslation();
  const [display, setDisplay] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (!ready) return;
    
    const translated = t("header.title");
    const cleanedText = translated.trim();
    
    if (!cleanedText) return;
    
    setDisplay("");
    setIsTypingComplete(false);
    
    const chars = Array.from(cleanedText);
    let i = 0;
    let currentDisplay = "";

    const interval = setInterval(() => {
      if (i < chars.length) {
        currentDisplay += chars[i];
        setDisplay(currentDisplay);
        i++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [ready, t]);

  if (!ready) return null;

  return (
    <header className={`header ${darkMode ? "dark" : ""}`}>
      <div className="headerDisplay">
        {/* Enhanced Title with Typing Effect */}
        <h1 className={isTypingComplete ? "typing-complete" : ""}>
          {display}
        </h1>

        {/* Enhanced Controls */}
        <div className="header-controls">
          <NotificationSettings 
            habitList={editableHabits} 
            darkMode={darkMode} 
          />
          
          <LanguageSwitcher />
          
          <button
            className="mode-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? "☀️ " : "🌙 "}
            {darkMode ? t("header.lightMode") : t("header.darkMode")}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;