import React, { useState } from 'react';
import { Sparkles, Check, AlertCircle, HelpCircle, Shield, Layers } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { aiApi } from '../../services/aiApi';
import { useToast } from '../../context/ToastContext';

export const AIComplexitySuggestion = ({
  feature,
  project,
  currentFactors = {},
  onApplyFactors,
}) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [error, setError] = useState(null);

  const handleFetchSuggestion = async () => {
    if (!feature?.name) {
      showToast('Please enter a feature name first.', 'warning');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await aiApi.suggestComplexity(feature, project);
      setSuggestion(result);
      showToast('AI complexity analysis complete!', 'success');
    } catch (err) {
      console.warn('AI suggestion error:', err);
      setError(err.message || 'AI service temporarily unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!suggestion?.complexity?.factors) return;
    onApplyFactors(suggestion.complexity.factors, 'ai');
    showToast('Applied AI complexity factors!', 'success');
  };

  const factorLabels = {
    functional_complexity: 'Functional Complexity',
    integration_complexity: 'API & Integration',
    data_complexity: 'Data & Database',
    security_complexity: 'Security & Auth',
    ui_complexity: 'UI / UX Interaction',
    technical_complexity: 'Technical & Concurrency',
    dependency_complexity: 'Inter-Dependency',
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200/80 dark:border-navy-800 space-y-3">
      {/* Header & Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              AI Complexity Factor Assistant
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Evaluates 7 architectural factors (0 to 5) to inform the deterministic estimation engine.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading || !feature?.name}
          onClick={handleFetchSuggestion}
          leftIcon={<Sparkles className={`w-3.5 h-3.5 text-brand-500 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          {isLoading ? 'Analyzing...' : '✨ Suggest Factors'}
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error} (Using deterministic baselines)</span>
        </div>
      )}

      {/* Suggestions Display Tray */}
      {suggestion && (
        <div className="pt-3 border-t border-slate-200/60 dark:border-navy-800 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Suggested Rating:
              </span>
              <Badge variant="brand" size="sm">
                Score: {suggestion.complexity.overall_score} / 5
              </Badge>
              <span className="text-[10px] text-slate-400">
                (AI Confidence: {Math.round(suggestion.complexity.confidence * 100)}%)
              </span>
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleApply}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              Apply Suggestion
            </Button>
          </div>

          {/* 7 Factor Mini-Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(suggestion.complexity.factors).map(([key, val]) => (
              <div
                key={key}
                className="p-2 bg-white dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-navy-800 text-left"
              >
                <span className="text-[10px] text-slate-400 block truncate">
                  {factorLabels[key] || key}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {val} / 5
                </span>
              </div>
            ))}
          </div>

          {/* Reasoning */}
          {suggestion.complexity.reasoning && Object.keys(suggestion.complexity.reasoning).length > 0 && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 bg-white/60 dark:bg-navy-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-navy-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                Why these ratings?
              </span>
              {Object.entries(suggestion.complexity.reasoning).map(([factor, reason]) => (
                <div key={factor}>
                  <strong className="text-slate-700 dark:text-slate-300">{factorLabels[factor] || factor}:</strong> {reason}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
