import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'default', showTagline = false, clickable = true, className = '' }) => {
  const iconSizes = {
    small: 'w-7 h-7',
    default: 'w-9 h-9',
    large: 'w-11 h-11',
  };

  const textSizes = {
    small: 'text-lg',
    default: 'text-xl',
    large: 'text-2xl',
  };

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* SVG Icon Brand Mark */}
      <div className={`relative ${iconSizes[size] || iconSizes.default} shrink-0 group`}>
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-violet rounded-xl blur-[6px] opacity-60 group-hover:opacity-90 transition-opacity" />
        
        {/* Core Shield */}
        <div className="relative w-full h-full bg-slate-900 border border-brand-500/40 rounded-xl flex items-center justify-center p-1.5 shadow-md">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Outer Code Brackets (Software) */}
            <path d="M10 10L6 16L10 22" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 10L26 16L22 22" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Analytics Pulse Line (Estimation & Analytics) */}
            <path d="M11 18L14 14L18 19L21 15" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Central AI Spark Core (AI) */}
            <circle cx="16" cy="11" r="2" fill="#38BDF8" />
            <circle cx="16" cy="11" r="3.5" stroke="#60A5FA" strokeWidth="0.8" strokeOpacity="0.8" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight font-extrabold leading-none">
          <span className={`${textSizes[size] || textSizes.default} text-slate-900 dark:text-white font-bold`}>
            Estimate
          </span>
          <span className={`${textSizes[size] || textSizes.default} bg-gradient-to-r from-brand-500 to-accent-violet bg-clip-text text-transparent font-black ml-0.5`}>
            AI
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 ml-1 mb-2 animate-pulse" />
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-normal mt-0.5">
            Turn ideas into estimates
          </span>
        )}
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link to="/" className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};
