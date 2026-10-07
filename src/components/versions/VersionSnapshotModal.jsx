import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Copy, 
  Calendar, 
  Clock, 
  IndianRupee, 
  Users, 
  Layers, 
  FileText,
  AlertTriangle 
} from 'lucide-react';
import { Button } from '../common/Button';
import { formatCurrencyINR } from '../../utils/formatters';

export const VersionSnapshotModal = ({
  isOpen,
  onClose,
  version,
  onUseAsStartingPoint,
}) => {
  if (!isOpen || !version) return null;

  const output = version.outputSnapshot || {};
  const summary = version.summary || output.summary || {};
  const features = version.inputSnapshot?.features || output.features || [];
  const resources = output.resources || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-navy-700 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-800/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Historical Snapshot: Version {version.versionNumber} ({version.versionTag || `v${version.versionNumber}`})
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  Immutable Record
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Created {new Date(version.createdAt).toLocaleString()}</span>
                {version.createdBy && <span>• by {version.createdBy}</span>}
                <span>• Engine v{version.engineVersion || '1.0.0'}</span>
                <span>• Rate v{version.rateVersion || '1.0.0'}</span>
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
          {/* Notes Banner */}
          {version.notes && (
            <div className="p-3.5 bg-slate-50 dark:bg-navy-950/60 rounded-xl border border-slate-200 dark:border-navy-800 text-xs text-slate-700 dark:text-slate-300">
              <span className="font-semibold mr-1.5">Scope Notes:</span>
              {version.notes}
            </div>
          )}

          {/* 6 Executive KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-navy-950/60 rounded-xl border border-slate-200 dark:border-navy-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Cost</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {formatCurrencyINR(summary.expectedCost || 0)}
              </p>
              <span className="text-[10px] text-slate-400">
                {formatCurrencyINR(summary.lowCost || 0)} – {formatCurrencyINR(summary.highCost || 0)}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-navy-950/60 rounded-xl border border-slate-200 dark:border-navy-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Effort</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {summary.expectedEffortHours || 0} hrs
              </p>
              <span className="text-[10px] text-slate-400">
                {summary.lowEffortHours || 0}h – {summary.highEffortHours || 0}h
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-navy-950/60 rounded-xl border border-slate-200 dark:border-navy-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Timeline</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {summary.timelineWeeks || 0} weeks
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                Feasible
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-navy-950/60 rounded-xl border border-slate-200 dark:border-navy-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Team Size</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {summary.totalTeamFTE || 0} FTE
              </p>
              <span className="text-[10px] text-slate-400">
                {features.length} features
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-navy-950/60 rounded-xl border border-slate-200 dark:border-navy-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Risk Level</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {summary.riskLevel || 'Medium'}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">
                {summary.riskScore || 0}/100
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-navy-950/60 rounded-xl border border-slate-200 dark:border-navy-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Confidence</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {summary.confidence || 0}%
              </p>
              <span className="text-[10px] text-slate-400">
                Deterministic
              </span>
            </div>
          </div>

          {/* Features Stored in Snapshot */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Features Snapshot ({features.length} Modules)
            </h4>
            <div className="border border-slate-200 dark:border-navy-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-navy-800">
              {features.map((feat, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white dark:bg-navy-900 hover:bg-slate-50 dark:hover:bg-navy-850">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white mr-2">
                      {feat.name}
                    </span>
                    <span className="text-slate-400 text-[11px] mr-2">
                      ({feat.category})
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
                      {feat.priority || 'Must Have'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {feat.estimatedHours || feat.estimatedEffortHours || (feat.threePoint?.expected) || '--'}h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role Allocations Stored in Snapshot */}
          {resources.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Team Role Allocations
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {resources.map((res, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 dark:bg-navy-950/60 rounded-xl border border-slate-200 dark:border-navy-800 text-xs">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{res.role}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{res.headcountFTE} FTE • {res.allocatedHours}h</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-800/50 shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Exact historical snapshot — never recalculates automatically</span>
          </div>

          <div className="flex items-center gap-3">
            {onUseAsStartingPoint && (
              <Button
                variant="outline"
                onClick={() => {
                  onUseAsStartingPoint(version);
                  onClose();
                }}
              >
                <Copy className="w-4 h-4 mr-1.5 text-slate-400" />
                Use as Starting Point
              </Button>
            )}
            <Button variant="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
