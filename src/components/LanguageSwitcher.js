import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

function LanguageSwitcher() {
  const { i18n, t, ready } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get base language code (e.g., "ar-SA" → "ar")
  const getBaseLanguageCode = (code) => {
    return code.split('-')[0];
  };

  const changeLanguage = (lng) => {
    console.log("Changing language to:", lng);
    i18n.changeLanguage(lng)
      .then(() => {
        console.log("Language changed successfully to:", lng);
        setIsDropdownOpen(false);
      })
      .catch((error) => {
        console.error("Error changing language:", error);
      });
  };

  // Effect to handle language change and RTL layout
  useEffect(() => {
    const currentLang = getBaseLanguageCode(i18n.language);
    console.log("Current language:", currentLang);
    
    // Set document direction based on language
    const isRTL = currentLang === 'ar' || currentLang === 'he' || currentLang === 'fa';
    document.body.dir = isRTL ? 'rtl' : 'ltr';
    
    // Also update html lang attribute
    document.documentElement.lang = currentLang;
  }, [i18n.language]);

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

  // Get current language using base code comparison
  const currentLanguageCode = getBaseLanguageCode(i18n.language);
  const currentLanguage = languages.find(lang => lang.code === currentLanguageCode) || languages[0];

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
                currentLanguageCode === language.code ? "active" : ""
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