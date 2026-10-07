import React from 'react';
import { GitBranch, ArrowRight, Link2, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const DependencyGraph = ({ dependencies }) => {
  if (!dependencies) return null;

  const { edges = [], nodes = [], hasCircularDependency } = dependencies;

  if (hasCircularDependency) return null; // Handled in CriticalPath

  return (
    <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-brand-500" />
            Feature Dependency Relationships
          </h3>
          <p className="text-xs text-slate-400">
            Explicit prerequisite links governing development sequence.
          </p>
        </div>

        <Badge variant="neutral" size="sm">
          {edges.length} Active Link{edges.length === 1 ? '' : 's'}
        </Badge>
      </div>

      {edges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {edges.map((edge, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-2 text-xs"
            >
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Prerequisite</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {edge.fromName}
                </span>
              </div>

              <ArrowRight className="w-4 h-4 text-brand-500 shrink-0" />

              <div className="truncate text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Dependent</span>
                <span className="font-bold text-brand-600 dark:text-brand-400 truncate block">
                  {edge.toName}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 text-center">
          No explicit dependencies defined between features. All scoped work items can technically initiate in parallel.
        </div>
      )}
    </Card>
  );
};
