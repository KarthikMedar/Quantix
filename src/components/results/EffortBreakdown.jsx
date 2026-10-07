import React from 'react';
import { Clock, TrendingUp, ShieldCheck, Layers } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const EffortBreakdown = ({ totalEffort }) => {
  if (!totalEffort) return null;

  const {
    totalEffortHours,
    lowEffortHours,
    highEffortHours,
    effortRange,
    standardDeviation,
    correlationFactor,
    disciplineHours = {},
  } = totalEffort;

  const disciplines = [
    { label: 'Frontend Client Engineering', hours: disciplineHours.frontend || 0, color: 'bg-blue-500' },
    { label: 'Backend APIs & Core Logic', hours: disciplineHours.backend || 0, color: 'bg-indigo-500' },
    { label: 'UI/UX Interactive Design', hours: disciplineHours.uiUx || 0, color: 'bg-purple-500' },
    { label: 'QA Verification & Automated Tests', hours: disciplineHours.qa || 0, color: 'bg-emerald-500' },
    { label: 'Project Management & Agile Sprints', hours: disciplineHours.projectManagement || 0, color: 'bg-amber-500' },
    { label: 'DevOps, CI/CD & Cloud Infrastructure', hours: disciplineHours.devops || 0, color: 'bg-cyan-500' },
  ].filter((d) => d.hours > 0);

  return (
    <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            Total Effort & PERT Uncertainty Bounds
          </h3>
          <p className="text-xs text-slate-400">
            Work effort across all disciplines including correlation factor ({correlationFactor || 1.10}x) widening.
          </p>
        </div>

        <Badge variant="brand" size="md">
          Expected: {totalEffortHours} hrs
        </Badge>
      </div>

      {/* Uncertainty Bounds Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-center">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Lower Bound (-1.64σ)</span>
          <span className="text-xl font-black text-slate-900 dark:text-white font-mono block mt-1">
            {lowEffortHours} hrs
          </span>
          <span className="text-[10px] text-slate-400">Optimistic velocity</span>
        </div>

        <div className="p-4 rounded-xl bg-brand-50/80 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800">
          <span className="text-[10px] text-brand-600 dark:text-brand-400 uppercase font-bold block">Most Likely Expected</span>
          <span className="text-xl font-black text-brand-700 dark:text-brand-300 font-mono block mt-1">
            {totalEffortHours} hrs
          </span>
          <span className="text-[10px] text-brand-500">PERT weighted mean</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Upper Bound (+1.64σ)</span>
          <span className="text-xl font-black text-slate-900 dark:text-white font-mono block mt-1">
            {highEffortHours} hrs
          </span>
          <span className="text-[10px] text-slate-400">Buffer with scope friction</span>
        </div>
      </div>

      {/* Discipline Distribution Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold">Workload Distribution by Discipline</span>
          <span className="font-mono">{effortRange}</span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full flex overflow-hidden p-0.5 gap-0.5">
          {disciplines.map((d, i) => {
            const pct = Math.round((d.hours / totalEffortHours) * 100);
            return (
              <div
                key={i}
                style={{ width: `${pct}%` }}
                className={`h-full rounded-sm ${d.color}`}
                title={`${d.label}: ${d.hours} hrs (${pct}%)`}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
          {disciplines.map((d, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${d.color} shrink-0`} />
              <span className="text-slate-600 dark:text-slate-400 truncate">{d.label}:</span>
              <strong className="text-slate-900 dark:text-white font-mono">{d.hours}h</strong>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
