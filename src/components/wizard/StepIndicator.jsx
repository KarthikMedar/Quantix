import React from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { useProjectEstimation } from '../../context/ProjectEstimationContext';
import { useToast } from '../../context/ToastContext';

export const StepIndicator = ({ currentStep, onStepClick }) => {
  const { saveStatus, resetDraft, features } = useProjectEstimation();
  const { showToast } = useToast();

  const steps = [
    { number: 1, label: 'Project', title: 'Project Information' },
    { number: 2, label: 'Features', title: 'Feature Scoping' },
    { number: 3, label: 'Review', title: 'Review Scope' },
    { number: 4, label: 'Analysis', title: 'AI Estimation' },
  ];

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear your current estimation draft? This cannot be undone.')) {
      resetDraft();
      showToast('Estimation draft cleared.', 'info');
    }
  };

  return (
    <div className="w-full bg-white dark:bg-navy-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Step Progression Bar */}
        <nav aria-label="Estimation Progress" className="w-full sm:w-auto flex-1">
          <ol className="flex items-center justify-between sm:justify-start gap-2 sm:gap-6">
            {steps.map((s, idx) => {
              const isCompleted = currentStep > s.number;
              const isCurrent = currentStep === s.number;
              const isUpcoming = currentStep < s.number;
              const isClickable = onStepClick && s.number < 4 && (isCompleted || isCurrent);

              return (
                <li key={s.number} className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial">
                  {/* Step Bubble */}
                  <button
                    type="button"
                    disabled={!isClickable}
                    onClick={() => isClickable && onStepClick(s.number)}
                    className={`group flex items-center gap-2 focus:outline-none ${
                      isClickable ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200
                        ${
                          isCompleted
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : isCurrent
                            ? 'bg-brand-600 text-white ring-4 ring-brand-500/20 shadow-md font-extrabold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                        }
                      `}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : `0${s.number}`}
                    </span>

                    <span
                      className={`text-xs sm:text-sm font-semibold transition-colors
                        ${
                          isCurrent
                            ? 'text-slate-900 dark:text-white font-bold'
                            : isCompleted
                            ? 'text-slate-700 dark:text-slate-300'
                            : 'text-slate-400 dark:text-slate-500 hidden md:inline'
                        }
                      `}
                    >
                      {s.label}
                    </span>
                  </button>

                  {/* Connecting Line */}
                  {idx < steps.length - 1 && (
                    <div
                      className={`hidden sm:block h-0.5 w-6 lg:w-12 rounded transition-colors
                        ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}
                      `}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Right side: Autosave status & Reset */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-500 dark:text-slate-400">
            <span
              className={`w-2 h-2 rounded-full ${
                saveStatus === 'saving' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'
              }`}
            />
            <span>{saveStatus === 'saving' ? 'Saving...' : '✓ Draft saved'}</span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-1"
            title="Clear current draft"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Clear Draft</span>
          </button>
        </div>
      </div>
    </div>
  );
};
