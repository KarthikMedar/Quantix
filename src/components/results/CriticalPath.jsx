import React from 'react';
import { GitCommit, ArrowRight, Clock, ShieldAlert, CheckCircle2, Layers } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const CriticalPath = ({ criticalPath, dependencies }) => {
  if (!criticalPath) return null;

  const hasCycle = dependencies?.hasCircularDependency;

  if (hasCycle) {
    return (
      <Card className="p-6 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 space-y-3">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
          <ShieldAlert className="w-5 h-5" />
          <span>Invalid Dependency Topology: Circular Dependency Detected</span>
        </div>
        <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed font-mono">
          {dependencies.circularDependencyError}
        </p>
        <p className="text-xs text-rose-700 dark:text-rose-400">
          The critical path and timeline cannot be reliably computed until cyclical prerequisites are resolved in the feature builder.
        </p>
      </Card>
    );
  }

  const { features = [], totalHours, totalWeeks, chain, explanation } = criticalPath;

  return (
    <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-purple-500" />
            Engineering Critical Path Analysis
          </h3>
          <p className="text-xs text-slate-400">
            The longest dependency sequence governing the minimum feasible delivery timeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple" size="md">
            Critical Path: {totalHours} hrs (~{totalWeeks} wks)
          </Badge>
        </div>
      </div>

      {/* Visual Critical Chain Flow */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Sequential Delivery Dependency Chain:</span>
        </div>

        {features.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            {features.map((feat, idx) => (
              <React.Fragment key={feat.id || idx}>
                <div className="px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 font-bold text-xs flex items-center gap-2 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-[10px] flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <span>{feat.name}</span>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-normal">
                    ({feat.hours}h)
                  </span>
                </div>

                {idx < features.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-purple-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No sequential feature dependencies defined.</p>
        )}
      </div>

      {/* Narrative Explanation */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
        <span className="font-bold text-slate-900 dark:text-white block">
          Architectural Impact:
        </span>
        <p className="leading-relaxed">
          {explanation || 'The critical path is the longest dependency chain and is a major driver of the minimum feasible timeline. Delays in critical features immediately impact the launch date.'}
        </p>
      </div>
    </Card>
  );
};
