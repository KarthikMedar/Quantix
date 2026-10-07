import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ExplainButton } from './ExplainButton';

export const ConfidencePanel = ({ confidenceData, onOpenExplain }) => {
  if (!confidenceData) return null;

  const { score, level, positiveDrivers = [], riskDrivers = [], summaryExplanation } = confidenceData;

  return (
    <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              Algorithmic Confidence Rating & Audit
            </h3>
            <ExplainButton onClick={() => onOpenExplain('confidence')} />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Objective reliability index derived from requirement precision and architectural constraints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="brand" size="md">
            {score}% Certainty ({level})
          </Badge>
        </div>
      </div>

      {/* Primary Score & Narrative */}
      <div className="p-4 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-brand-950 dark:text-brand-200 text-sm">
            Deterministic Confidence: {score}%
          </span>
          <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
            Never 100% (Realist Engineering Standards)
          </span>
        </div>
        <p className="text-xs text-brand-900 dark:text-brand-300 leading-relaxed font-medium">
          {summaryExplanation}
        </p>
      </div>

      {/* Factor Drivers: Positive (+) vs Risk (-) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Positive Drivers (+) */}
        <div className="space-y-2.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            + Confidence Anchors ({positiveDrivers.length})
          </span>

          <ul className="space-y-2 text-xs">
            {positiveDrivers.map((item, idx) => (
              <li key={idx} className="flex items-start justify-between gap-2 text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold leading-none mt-0.5">+</span>
                  <div>
                    <strong className="block text-[11px] text-slate-900 dark:text-white">{item.factor}</strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{item.detail}</span>
                  </div>
                </div>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-[11px] shrink-0">
                  {item.impact}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risk / Variance Drivers (-) */}
        <div className="space-y-2.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
            - Variance Drivers ({riskDrivers.length})
          </span>

          <ul className="space-y-2 text-xs">
            {riskDrivers.map((item, idx) => (
              <li key={idx} className="flex items-start justify-between gap-2 text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold leading-none mt-0.5">-</span>
                  <div>
                    <strong className="block text-[11px] text-slate-900 dark:text-white">{item.factor}</strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{item.detail}</span>
                  </div>
                </div>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold text-[11px] shrink-0">
                  {item.impact}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};
