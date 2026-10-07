import React from 'react';
import { 
  GitCommit, 
  Calendar, 
  Clock, 
  Users, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle, 
  ExternalLink, 
  Copy, 
  GitCompare, 
  Layers 
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrencyINR } from '../../utils/formatters';

export const VersionCard = ({
  version,
  isLatest = false,
  isSelectedForCompare = false,
  onToggleCompare = null,
  onViewSnapshot = null,
  onUseAsStartingPoint = null,
}) => {
  if (!version) return null;

  const summary = version.summary || {};
  const formattedDate = new Date(version.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`group relative bg-white dark:bg-navy-900 rounded-2xl border transition-all duration-200 p-5 shadow-sm hover:shadow-md ${
        isLatest
          ? 'border-brand-500/40 ring-1 ring-brand-500/20 bg-brand-50/10'
          : isSelectedForCompare
          ? 'border-amber-500 ring-2 ring-amber-500/30'
          : 'border-slate-200 dark:border-navy-700 hover:border-slate-300 dark:hover:border-navy-600'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
              isLatest
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-navy-700'
            }`}
          >
            {version.versionTag || `v${version.versionNumber}`}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-900 dark:text-white">
                Version {version.versionNumber}
              </span>
              {isLatest && (
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Latest
                </span>
              )}
              <span className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-slate-100 dark:bg-navy-800 text-slate-500 dark:text-slate-400">
                Engine v{version.engineVersion || '1.0.0'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
              {version.createdBy && (
                <span>• by {version.createdBy}</span>
              )}
            </div>
          </div>
        </div>

        {/* Compare Checkbox / Quick Toggle */}
        {onToggleCompare && (
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer select-none bg-slate-50 dark:bg-navy-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-navy-700 hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors">
            <input
              type="checkbox"
              checked={isSelectedForCompare}
              onChange={() => onToggleCompare(version)}
              className="rounded text-brand-600 focus:ring-brand-500 h-3.5 w-3.5"
            />
            <span className="flex items-center gap-1">
              <GitCompare className="w-3.5 h-3.5 text-slate-400" />
              Compare
            </span>
          </label>
        )}
      </div>

      {/* Notes / Changelog */}
      {version.notes && (
        <div className="mb-4 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/70 dark:bg-navy-950/60 p-3 rounded-xl border border-slate-100 dark:border-navy-800 leading-relaxed">
          <span className="font-semibold text-slate-700 dark:text-slate-200 mr-1.5">Scope Notes:</span>
          {version.notes}
        </div>
      )}

      {/* Key Metric Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 p-3 bg-slate-50/50 dark:bg-navy-950/40 rounded-xl border border-slate-100 dark:border-navy-800 mb-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Cost</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {formatCurrencyINR(summary.expectedCost || 0)}
          </p>
          <span className="text-[10px] text-slate-400">
            {formatCurrencyINR(summary.lowCost || 0)} – {formatCurrencyINR(summary.highCost || 0)}
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Effort</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {summary.expectedEffortHours || 0}h
          </p>
          <span className="text-[10px] text-slate-400">
            {summary.lowEffortHours || 0}h – {summary.highEffortHours || 0}h
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Timeline</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {summary.timelineWeeks || 0} wks
          </p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            Feasible
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Team Size</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {summary.totalTeamFTE || 0} FTE
          </p>
          <span className="text-[10px] text-slate-400">
            {summary.featureCount || 0} features
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Project Risk</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {summary.riskLevel || 'Medium'}
          </p>
          <span className="text-[10px] text-slate-400 font-mono">
            {summary.riskScore || 0}/100
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Confidence</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            {summary.confidence || 0}%
          </p>
          <span className="text-[10px] text-slate-400">
            Deterministic
          </span>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-navy-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Locked Historical Record</span>
        </div>

        <div className="flex items-center gap-2">
          {onUseAsStartingPoint && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onUseAsStartingPoint(version)}
              className="text-xs"
            >
              <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Use as Starting Point
            </Button>
          )}

          {onViewSnapshot && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onViewSnapshot(version)}
              className="text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1" />
              View Snapshot
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
