import React from 'react';
import { Clock, Calendar, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const TimelineView = ({ timelineData }) => {
  if (!timelineData) return null;

  const {
    totalWeeks,
    totalMonths,
    totalWorkingDays,
    totalSprints,
    effectiveTeamHoursPerWeek,
    phases,
    deadlineCheck,
  } = timelineData;

  return (
    <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-500" />
            Project Delivery Timeline & Gantt Schedule
          </h3>
          <p className="text-xs text-slate-400">
            Sprint milestones calculated assuming 40 hrs/week per engineer at 75% parallel efficiency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple" size="md">
            {totalMonths} Months ({totalWeeks} Weeks)
          </Badge>
          <Badge variant="brand" size="md">
            {totalSprints} Sprints (2-wk)
          </Badge>
        </div>
      </div>

      {/* Deadline Feasibility Alert (if user provided requested timeline) */}
      {deadlineCheck && (
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            deadlineCheck.isAchievable
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm">
              {deadlineCheck.isAchievable ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
              <span>{deadlineCheck.status === 'Achievable' ? 'Timeline Feasibility: Confirmed' : 'Timeline Feasibility: Schedule Risk'}</span>
            </div>
            <p className="text-xs leading-relaxed">
              {deadlineCheck.message}
            </p>
            {deadlineCheck.recommendations && (
              <ul className="text-xs list-disc list-inside mt-1 space-y-0.5 opacity-90">
                {deadlineCheck.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0 p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-current/20 text-xs font-mono">
            <div>
              <span className="text-[10px] opacity-75 block">Requested</span>
              <span className="font-bold">{deadlineCheck.requestedWeeks} wks</span>
            </div>
            <span>→</span>
            <div>
              <span className="text-[10px] opacity-75 block">Estimated</span>
              <span className="font-bold">{deadlineCheck.estimatedWeeks} wks</span>
            </div>
          </div>
        </div>
      )}

      {/* Key Metric Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block mb-0.5">Total Duration</span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
            {totalWeeks} Weeks
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block mb-0.5">Delivery Horizon</span>
          <span className="text-base font-extrabold text-brand-600 dark:text-brand-400 font-mono">
            {totalMonths} Months
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block mb-0.5">Agile Sprints</span>
          <span className="text-base font-extrabold text-violet-500 font-mono">
            {totalSprints} Sprints
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block mb-0.5">Effective Velocity</span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
            {effectiveTeamHoursPerWeek} hrs/wk
          </span>
        </div>
      </div>

      {/* Gantt Timeline Visualization */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
          <span>Delivery Phases & Sequential Schedule</span>
          <span className="font-mono text-slate-400">Week 0 to Week {totalWeeks}</span>
        </div>

        <div className="space-y-2.5">
          {phases.map((ph, idx) => {
            const startPct = (ph.startWeek / totalWeeks) * 100;
            const widthPct = Math.max(8, ((ph.endWeek - ph.startWeek) / totalWeeks) * 100);

            const colors = [
              'bg-blue-500',
              'bg-violet-500',
              'bg-cyan-500',
              'bg-indigo-500',
              'bg-brand-500',
              'bg-teal-500',
              'bg-emerald-500',
              'bg-amber-500',
              'bg-slate-500',
            ];
            const barColor = colors[idx % colors.length];

            return (
              <div
                key={ph.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-400">
                      0{idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {ph.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({ph.hours} hrs)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                    <span>W{ph.startWeek} – W{ph.endWeek}</span>
                    <span>•</span>
                    <span className="text-brand-600 dark:text-brand-400 font-semibold">{ph.durationWeeks} wks</span>
                  </div>
                </div>

                {/* Gantt Bar representation */}
                <div className="relative h-2 w-full bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                  <div
                    style={{
                      marginLeft: `${Math.min(90, startPct)}%`,
                      width: `${Math.min(100 - startPct, widthPct)}%`,
                    }}
                    className={`h-full rounded-full ${barColor} transition-all duration-300`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
