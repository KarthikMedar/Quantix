import React from 'react';
import { Clock, Calendar, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ExplainButton } from './ExplainButton';

export const Timeline = ({ timelineData, onOpenExplain }) => {
  if (!timelineData) return null;

  const {
    totalWeeks,
    totalMonths,
    totalWorkingDays,
    totalSprints,
    effectiveTeamHoursPerWeek,
    phases = [],
    deadlineCheck,
  } = timelineData;

  const maxEndWeek = Math.max(...phases.map((p) => p.endWeek), totalWeeks);

  return (
    <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Delivery Timeline & Gantt Schedule
            </h3>
            <ExplainButton onClick={() => onOpenExplain('timeline')} />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Phase pacing calculated based on {effectiveTeamHoursPerWeek} productive hrs/week team capacity at 75% parallel efficiency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="brand" size="md">
            ~{totalWeeks} Weeks ({totalMonths} Mos • {totalSprints} Sprints)
          </Badge>
        </div>
      </div>

      {/* Key Timeline Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Calendar Duration</span>
          <span className="text-base font-black text-slate-900 dark:text-white block mt-0.5">
            {totalWeeks} Weeks
          </span>
          <span className="text-[11px] text-slate-500">{totalMonths} calendar months</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Working Days</span>
          <span className="text-base font-black text-slate-900 dark:text-white block mt-0.5">
            {totalWorkingDays} Days
          </span>
          <span className="text-[11px] text-slate-500">5 business days / wk</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Agile Sprints</span>
          <span className="text-base font-black text-brand-600 dark:text-brand-400 block mt-0.5">
            {totalSprints} Sprints
          </span>
          <span className="text-[11px] text-slate-500">2-week release cadence</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Feasibility</span>
          <span className="text-base font-black text-emerald-600 dark:text-emerald-400 block mt-0.5">
            {deadlineCheck?.status || 'Feasible'}
          </span>
          <span className="text-[11px] text-slate-500">
            {deadlineCheck?.requestedWeeks ? `Req: ${deadlineCheck.requestedWeeks}w` : 'Flexible target'}
          </span>
        </div>
      </div>

      {/* Visual Gantt Phase Schedule */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider pb-1">
          <span>Delivery Phases & Sprint Flow</span>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>W1</span>
            <span>W{Math.round(totalWeeks / 2)}</span>
            <span>W{totalWeeks}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {phases.map((ph, idx) => {
            const startPct = Math.max(0, (ph.startWeek / maxEndWeek) * 100);
            const durationPct = Math.max(5, (ph.durationWeeks / maxEndWeek) * 100);

            const colors = [
              'bg-blue-500',
              'bg-indigo-500',
              'bg-purple-500',
              'bg-violet-500',
              'bg-emerald-500',
              'bg-teal-500',
              'bg-amber-500',
              'bg-cyan-500',
              'bg-slate-500',
            ];
            const color = colors[idx % colors.length];

            return (
              <div key={ph.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {ph.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({ph.hours}h)
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    W{ph.startWeek} – W{ph.endWeek} ({ph.durationWeeks}w)
                  </span>
                </div>

                {/* Progress bar container */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full relative overflow-hidden">
                  <div
                    style={{
                      left: `${startPct}%`,
                      width: `${durationPct}%`,
                    }}
                    className={`absolute top-0 bottom-0 rounded-full ${color} transition-all duration-500 shadow-xs`}
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
