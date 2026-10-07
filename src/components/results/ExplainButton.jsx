import React from 'react';
import { HelpCircle } from 'lucide-react';

export const ExplainButton = ({ onClick, label = 'Why?', title = 'Explain calculation rationale' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 hover:underline px-1.5 py-0.5 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500"
      aria-label={title}
    >
      <HelpCircle className="w-3 h-3 shrink-0" />
      <span>{label}</span>
    </button>
  );
};
