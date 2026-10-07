import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', active: true },
  { code: 'es', name: 'Español', flag: '🇪🇸', active: false, badge: 'Soon' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', active: false, badge: 'Soon' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', active: false, badge: 'Soon' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳', active: false, badge: 'Soon' },
];

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const selectedLangObj = AVAILABLE_LANGUAGES.find((l) => l.code === currentLanguage) || AVAILABLE_LANGUAGES[0];

  const changeLanguage = (code) => {
    setCurrentLanguage(code);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        selectedLang: selectedLangObj,
        languages: AVAILABLE_LANGUAGES,
        changeLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
