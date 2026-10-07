import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

export const LanguageSelector = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, languages, changeLanguage, selectedLang } = useLanguage();
  const { showToast } = useToast();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang) => {
    if (!lang.active) {
      showToast(`${lang.name} localization will be available in Phase 2.`, 'info');
      setIsOpen(false);
      return;
    }
    changeLanguage(lang.code);
    setIsOpen(false);
    showToast(`Language set to ${lang.name}`, 'success', 2000);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/80 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
      >
        <Globe className="w-3.5 h-3.5 text-brand-500" />
        <span className="hidden sm:inline">{selectedLang.name}</span>
        <span className="sm:hidden">{selectedLang.code.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-xl glass-dropdown shadow-xl py-1.5 z-50 animate-scaleUp text-left"
          role="menu"
        >
          <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Select Language
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                currentLanguage === lang.code
                  ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
              role="menuitem"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {lang.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                    {lang.badge}
                  </span>
                )}
                {currentLanguage === lang.code && <Check className="w-3.5 h-3.5 text-brand-500" />}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
