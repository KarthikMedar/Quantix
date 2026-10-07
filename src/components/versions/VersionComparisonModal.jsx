import React from 'react';
import { 
  GitCompare, 
  X, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  PlusCircle, 
  MinusCircle, 
  Layers, 
  Calendar, 
  Clock, 
  Users, 
  ShieldCheck 
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { formatCurrencyINR } from '../../utils/formatters';
import { Button } from '../common/Button';

export const VersionComparisonModal = ({
  isOpen,
  onClose,
  versionA,
  versionB,
}) => {
  if (!isOpen || !versionA || !versionB) return null;

  // Use comparison engine
  const comparison = projectService.compareVersions(versionA, versionB);
  const { deltas, featureDiff } = comparison;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-navy-700 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-800/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/10 text-brand-500 rounded-lg">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Version Comparison</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-navy-700 text-slate-700 dark:text-slate-300 font-mono">
                  {versionA.versionTag || `v${versionA.versionNumber}`} vs {versionB.versionTag || `v${versionB.versionNumber}`}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed scope delta and estimation variance between historical snapshots
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Version Headers Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-navy-950/60 rounded-xl border border-slate-200 dark:border-navy-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Baseline (Earlier)</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-50 dark:bg-navy-800 text-brand-600 dark:text-brand-400">
                  {versionA.versionTag || `v${versionA.versionNumber}`}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-2">
                "{versionA.notes || 'Baseline snapshot'}"
              </p>
              <div className="text-[11px] text-slate-400">
                Created: {new Date(versionA.createdAt).toLocaleDateString()} by {versionA.createdBy || 'User'}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-navy-950/60 rounded-xl border border-slate-200 dark:border-navy-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Comparison (Later)</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-500 text-white">
                  {versionB.versionTag || `v${versionB.versionNumber}`}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-2">
                "{versionB.notes || 'Subsequent snapshot'}"
              </p>
              <div className="text-[11px] text-slate-400">
                Created: {new Date(versionB.createdAt).toLocaleDateString()} by {versionB.createdBy || 'User'}
              </div>
            </div>
          </div>

          {/* Key Metric Deltas Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Executive Metrics Comparison
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Cost Delta */}
              <div className="p-4 bg-white dark:bg-navy-800/80 rounded-xl border border-slate-200 dark:border-navy-700">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Estimated Cost</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {formatCurrencyINR(versionA.summary?.expectedCost || 0)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {formatCurrencyINR(versionB.summary?.expectedCost || 0)}
                  </span>
                </div>
                <div className={`text-xs font-semibold flex items-center gap-1 ${
                  deltas.cost.isIncrease ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {deltas.cost.isIncrease ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>
                    {deltas.cost.diff >= 0 ? '+' : ''}{formatCurrencyINR(deltas.cost.diff)} ({deltas.cost.percent}%)
                  </span>
                </div>
              </div>

              {/* Effort Delta */}
              <div className="p-4 bg-white dark:bg-navy-800/80 rounded-xl border border-slate-200 dark:border-navy-700">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Effort</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {versionA.summary?.expectedEffortHours || 0}h
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {versionB.summary?.expectedEffortHours || 0}h
                  </span>
                </div>
                <div className={`text-xs font-semibold flex items-center gap-1 ${
                  deltas.effort.isIncrease ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {deltas.effort.isIncrease ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>
                    {deltas.effort.diff >= 0 ? '+' : ''}{deltas.effort.diff}h ({deltas.effort.percent}%)
                  </span>
                </div>
              </div>

              {/* Timeline Delta */}
              <div className="p-4 bg-white dark:bg-navy-800/80 rounded-xl border border-slate-200 dark:border-navy-700">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Estimated Timeline</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {versionA.summary?.timelineWeeks || 0} wks
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {versionB.summary?.timelineWeeks || 0} wks
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {deltas.timelineWeeks.diff === 0 ? 'No schedule shift' : `${deltas.timelineWeeks.diff > 0 ? '+' : ''}${deltas.timelineWeeks.diff} weeks`}
                </div>
              </div>

              {/* Team FTE Delta */}
              <div className="p-4 bg-white dark:bg-navy-800/80 rounded-xl border border-slate-200 dark:border-navy-700">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Team Size</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {versionA.summary?.totalTeamFTE || 0} FTE
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {versionB.summary?.totalTeamFTE || 0} FTE
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {deltas.teamFTE.diff === 0 ? 'Identical team size' : `${deltas.teamFTE.diff > 0 ? '+' : ''}${deltas.teamFTE.diff} FTE`}
                </div>
              </div>

              {/* Risk Delta */}
              <div className="p-4 bg-white dark:bg-navy-800/80 rounded-xl border border-slate-200 dark:border-navy-700">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Project Risk</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {versionA.summary?.riskLevel || 'Med'} ({versionA.summary?.riskScore || 0})
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {versionB.summary?.riskLevel || 'Med'} ({versionB.summary?.riskScore || 0})
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {deltas.riskScore.diff === 0 ? 'Risk unchanged' : `Risk Score delta: ${deltas.riskScore.diff > 0 ? '+' : ''}${deltas.riskScore.diff}`}
                </div>
              </div>

              {/* Confidence Delta */}
              <div className="p-4 bg-white dark:bg-navy-800/80 rounded-xl border border-slate-200 dark:border-navy-700">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Confidence</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {versionA.summary?.confidence || 0}%
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {versionB.summary?.confidence || 0}%
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {deltas.confidence.diff === 0 ? 'Confidence constant' : `Confidence shift: ${deltas.confidence.diff > 0 ? '+' : ''}${deltas.confidence.diff}%`}
                </div>
              </div>
            </div>
          </div>

          {/* Feature Scope Differences */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Feature Scope Delta ({featureDiff.added.length} added, {featureDiff.removed.length} removed, {featureDiff.retainedCount} unchanged)
            </h4>

            {featureDiff.added.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4" />
                  <span>Features Introduced in {versionB.versionTag || `v${versionB.versionNumber}`}:</span>
                </div>
                <div className="space-y-1.5">
                  {featureDiff.added.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white mr-2">{f.name}</span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">{f.category}</span>
                      </div>
                      <span className="font-mono text-emerald-700 dark:text-emerald-300 font-medium">
                        {f.priority || 'Must Have'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {featureDiff.removed.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1.5 flex items-center gap-1.5">
                  <MinusCircle className="w-4 h-4" />
                  <span>Features Removed in {versionB.versionTag || `v${versionB.versionNumber}`}:</span>
                </div>
                <div className="space-y-1.5">
                  {featureDiff.removed.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-xl text-xs line-through text-slate-500"
                    >
                      <span>{f.name}</span>
                      <span>{f.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {featureDiff.added.length === 0 && featureDiff.removed.length === 0 && (
              <div className="p-3 bg-slate-50 dark:bg-navy-950/40 border border-slate-200 dark:border-navy-800 rounded-xl text-xs text-slate-500 text-center">
                All features remained identical across both snapshots. Differences stem from platform/rate/complexity settings.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-800/50 shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Deterministic Delta Engine (Engine v1.0.0)</span>
          </div>
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
