import React, { useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import "./Header.css";

function Header({ toggleDarkMode, darkMode }) {
const { t, ready } = useTranslation();
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!ready) return;
        const translated = t("header.title");
    const cleanedText = translated.trim();
        if (!cleanedText) return;
        setDisplay("");
  
    const chars = Array.from(cleanedText);
    let i = 0;
    let currentDisplay = "";

    const interval = setInterval(() => {
      if (i < chars.length) {
        currentDisplay += chars[i];
        setDisplay(currentDisplay);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [ready, t]);

  if (!ready) return null;

return (
  <header className="header headerDisplay">
    {/* Title */}
    <h1>{display}</h1>

    {/* Controls: Language switcher and dark mode toggle */}
    <div className="header-controls">
      <LanguageSwitcher />
      <button
        className="mode-toggle toggleTransition"
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
      >
        {darkMode ? t("header.lightMode") : t("header.darkMode")}
      </button>
    </div>
  </header>
);

}

export default Header;
