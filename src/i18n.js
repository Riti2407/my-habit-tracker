import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Translation files - import them directly to avoid async loading issues
import enTranslations from "./locales/en.json";
import hiTranslations from "./locales/hi.json";
import arabicTranslation from "./locales/ar.json";

// Define resources object with translations
const resources = {
  en: {
    translation: enTranslations,
  },
  hi: {
    translation: hiTranslations,
  },
  ar: {
    translation: arabicTranslation,
  },
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: process.env.NODE_ENV === 'development', // Only debug in development
    supportedLngs: ["en", "hi", "ar"], // Explicitly define supported languages

    // Detection settings
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // React i18next settings
    react: {
      useSuspense: false,
      bindI18n: "languageChanged loaded",
      bindI18nStore: "added removed",
    },

    // Performance optimizations
    saveMissing: false,
    parseMissingKeyHandler: (key) => {
      console.warn(`Missing translation: ${key}`);
      return key;
    }
  });

// Add error handling
i18n.on('failedLoading', (lng, ns, msg) => {
  console.error(`Failed to load language ${lng}:`, msg);
});

export default i18n;