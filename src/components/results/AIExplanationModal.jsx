import React, { useState, useEffect } from 'react';
import { Sparkles, X, ShieldCheck, AlertTriangle, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { aiApi } from '../../services/aiApi';

export const AIExplanationModal = ({
  isOpen,
  onClose,
  estimateResult,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && estimateResult) {
      fetchExplanation();
    } else {
      setExplanation(null);
      setError(null);
    }
  }, [isOpen, estimateResult]);

  const fetchExplanation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiApi.explainEstimate(estimateResult);
      setExplanation(result);
    } catch (err) {
      console.warn('AI explanation error:', err);
      setError(err.message || 'AI explanation service temporarily unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-navy-700 flex flex-col overflow-hidden max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-navy-800 bg-slate-50/60 dark:bg-navy-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-indigo-600 text-white rounded-xl">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  AI Estimate Explanation & Rationale
                </h3>
                <Badge variant="brand" size="sm">
                  Phase 8
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mathematical drivers translated into executive-level rationale.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-brand-500 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Compiling multi-factor estimate explanation referencing actual calculations...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : explanation ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Executive Summary */}
              <div className="p-4 rounded-2xl bg-brand-50/40 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-900/40 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {explanation.summary?.headline || 'Estimation Summary'}
                </h4>
                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-slate-900 dark:text-white">Timeline Rationale:</strong>{' '}
                    {explanation.summary?.timeline_explanation}
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-white">Team Sizing:</strong>{' '}
                    {explanation.summary?.team_explanation}
                  </p>
                </div>
              </div>

              {/* Major Cost Drivers */}
              {explanation.summary?.major_cost_drivers && (
                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Primary Financial & Engineering Drivers
                  </h5>
                  <ul className="space-y-1.5">
                    {explanation.summary.major_cost_drivers.map((driver, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-100 dark:border-navy-800"
                      >
                        <span className="w-4 h-4 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Feature-Level Explanations */}
              {explanation.feature_explanations && explanation.feature_explanations.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Feature-Specific Rationale
                  </h5>
                  <div className="space-y-2">
                    {explanation.feature_explanations.map((f, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-navy-800 space-y-1"
                      >
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          {f.feature_name}
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {f.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI-Identified Risks & Assumptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* AI Risks */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    AI-Identified Qualitative Risks
                  </span>
                  <div className="space-y-1.5">
                    {(explanation.ai_risks || []).map((risk, idx) => (
                      <div key={idx} className="text-[11px] text-slate-600 dark:text-slate-400">
                        <strong className="text-slate-800 dark:text-slate-200">[{risk.severity}] {risk.type}:</strong> {risk.description}
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Assumptions */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
                    AI-Identified Assumptions
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 list-disc list-inside">
                    {(explanation.assumptions || []).map((assump, idx) => (
                      <li key={idx}>{assump}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-navy-800 bg-slate-50/60 dark:bg-navy-800/60 shrink-0">
          <span className="text-[11px] text-slate-400">
            Backed by deterministic PERT calculations.
          </span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
