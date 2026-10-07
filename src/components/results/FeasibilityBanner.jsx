import React from 'react';
import { AlertTriangle, Clock, ArrowRight, ShieldAlert, CheckCircle2, Info } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const FeasibilityBanner = ({ deadlineCheck }) => {
  if (!deadlineCheck || !deadlineCheck.hasRequestedTimeline) return null;

  const { status, requestedWeeks, estimatedWeeks, minimumFeasibleWeeks, message, recommendations } = deadlineCheck;

  if (status === 'Feasible') {
    return (
      <Card className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Timeline Feasible
              </span>
              <Badge variant="success" size="sm">
                On Schedule
              </Badge>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
              Requested timeline of {requestedWeeks} weeks accommodates the estimated {estimatedWeeks}-week delivery path.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const isInfeasible = status === 'Infeasible';

  return (
    <Card
      className={`p-5 sm:p-6 border transition-all ${
        isInfeasible
          ? 'bg-rose-50/90 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 shadow-md shadow-rose-500/5'
          : 'bg-amber-50/90 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 shadow-md shadow-amber-500/5'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Left: Icon & Core Warning */}
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              isInfeasible
                ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400'
                : 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400'
            }`}
          >
            {isInfeasible ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={`text-sm sm:text-base font-extrabold ${
                  isInfeasible ? 'text-rose-900 dark:text-rose-200' : 'text-amber-900 dark:text-amber-200'
                }`}
              >
                {isInfeasible ? '⚠ Timeline May Not Be Feasible' : '⚠ Tight Delivery Window Warning'}
              </h3>
              <Badge variant={isInfeasible ? 'danger' : 'warning'} size="sm">
                {status.toUpperCase()}
              </Badge>
            </div>

            <p
              className={`text-xs sm:text-sm font-medium leading-relaxed ${
                isInfeasible ? 'text-rose-800 dark:text-rose-300' : 'text-amber-800 dark:text-amber-300'
              }`}
            >
              {message}
            </p>

            {/* Recommendations */}
            {recommendations && recommendations.length > 0 && (
              <div className="pt-1.5 space-y-1">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider block ${
                    isInfeasible ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'
                  }`}
                >
                  Recommended Adjustments:
                </span>
                <ul
                  className={`text-xs space-y-0.5 list-disc list-inside ${
                    isInfeasible ? 'text-rose-800 dark:text-rose-300' : 'text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right: Timeline Comparison Numbers */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white/80 dark:bg-navy-900/80 border border-slate-200 dark:border-slate-800 shrink-0 self-stretch md:self-auto text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Requested</span>
            <span className="text-base font-black text-slate-800 dark:text-slate-200">
              {requestedWeeks} <span className="text-[11px] font-normal">weeks</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-rose-500 block">Minimum Feasible</span>
            <span className="text-base font-black text-rose-600 dark:text-rose-400">
              {minimumFeasibleWeeks} <span className="text-[11px] font-normal">weeks</span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
