import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

function LanguageSwitcher() {
  const { i18n, t, ready } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Return null if translations aren't ready

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsDropdownOpen(false); // Close dropdown after selection
  };
  // Effect to handle language change
  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n, i18n.language]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Language options with flags and names
  const languages = [
    { code: "en", name: t("languageSwitcher.english"), flag: "🇺🇸" },
    { code: "hi", name: t("languageSwitcher.hindi"), flag: "🇮🇳" },
    { code: "ar", name: t("languageSwitcher.arabic"), flag: "🇸🇦" },
  ];

  if (!ready) return null;


  return (
    <div className="language-switcher" ref={dropdownRef}>
      {/* Globe icon trigger button */}
      <button
        className="globe-btn"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-label="Change language"
        title="Change language"
      >
        🌐
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="language-dropdown">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`dropdown-item ${
                i18n.language === language.code ? "active" : ""
              }`}
              onClick={() => changeLanguage(language.code)}
            >
              <span className="flag">{language.flag}</span>
              <span className="language-name">{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
