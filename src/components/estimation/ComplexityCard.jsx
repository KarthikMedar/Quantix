import React from 'react';
import { Activity, ShieldAlert, Layers, CheckCircle2, Info } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const ComplexityCard = ({ projectComplexity, featureEstimates = [] }) => {
  const { level, score, averageFeatureScore, highComplexityFeatureCount, reasons } = projectComplexity;

  // Count by level
  const counts = {
    'LOW': 0,
    'MEDIUM': 0,
    'HIGH': 0,
    'VERY HIGH': 0,
  };

  featureEstimates.forEach((f) => {
    if (counts[f.complexityLevel] !== undefined) {
      counts[f.complexityLevel]++;
    }
  });

  const getLevelColor = (lvl) => {
    switch (lvl?.toLowerCase()) {
      case 'very high':
        return 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900';
      case 'high':
        return 'text-purple-500 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900';
      case 'medium':
        return 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900';
      default:
        return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900';
    }
  };

  const getBadgeVariant = (lvl) => {
    switch (lvl?.toLowerCase()) {
      case 'very high':
        return 'danger';
      case 'high':
        return 'purple';
      case 'medium':
        return 'warning';
      default:
        return 'success';
    }
  };

  return (
    <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Algorithmic Assessment
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
            <Activity className="w-5 h-5 text-brand-500" />
            Project Complexity Architecture
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-mono">Calculated Score</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </span>
          </div>
          <div className={`px-4 py-2 rounded-xl border text-sm font-black uppercase tracking-wider ${getLevelColor(level)}`}>
            {level} Complexity
          </div>
        </div>
      </div>

      {/* Feature Distribution Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
          <span>Feature Complexity Breakdown ({featureEstimates.length} Total)</span>
          <span className="font-mono text-slate-400">Avg Feature Score: {averageFeatureScore} / 45</span>
        </div>

        <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex p-0.5 gap-0.5">
          {counts['LOW'] > 0 && (
            <div
              style={{ width: `${(counts['LOW'] / featureEstimates.length) * 100}%` }}
              className="bg-emerald-500 rounded-full h-full"
              title={`Low: ${counts['LOW']}`}
            />
          )}
          {counts['MEDIUM'] > 0 && (
            <div
              style={{ width: `${(counts['MEDIUM'] / featureEstimates.length) * 100}%` }}
              className="bg-amber-500 rounded-full h-full"
              title={`Medium: ${counts['MEDIUM']}`}
            />
          )}
          {counts['HIGH'] > 0 && (
            <div
              style={{ width: `${(counts['HIGH'] / featureEstimates.length) * 100}%` }}
              className="bg-purple-500 rounded-full h-full"
              title={`High: ${counts['HIGH']}`}
            />
          )}
          {counts['VERY HIGH'] > 0 && (
            <div
              style={{ width: `${(counts['VERY HIGH'] / featureEstimates.length) * 100}%` }}
              className="bg-rose-500 rounded-full h-full"
              title={`Very High: ${counts['VERY HIGH']}`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">Low: <strong>{counts['LOW']}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-400">Medium: <strong>{counts['MEDIUM']}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-slate-600 dark:text-slate-400">High: <strong>{counts['HIGH']}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600 dark:text-slate-400">Very High: <strong>{counts['VERY HIGH']}</strong></span>
          </div>
        </div>
      </div>

      {/* Primary Complexity Drivers */}
      {reasons && reasons.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Primary Complexity Drivers:
          </span>
          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
            {reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
