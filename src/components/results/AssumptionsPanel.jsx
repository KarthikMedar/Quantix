import React from 'react';
import { Settings, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const AssumptionsPanel = ({ assumptions }) => {
  if (!assumptions) return null;

  return (
    <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-brand-500" />
            Engineering Estimation Assumptions & Parameters
          </h3>
          <p className="text-xs text-slate-400">
            System defaults and architectural calibration rules used to produce this reproducible estimate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="neutral" size="sm">
            Deterministic Standard
          </Badge>
        </div>
      </div>

      {/* Assumptions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Gross Working Day</span>
          <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
            {assumptions.workingHoursPerDay} Hours
          </span>
          <span className="text-[10px] text-slate-400">Standard business day</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Productive Hours / Day</span>
          <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
            {assumptions.productiveHoursPerDay} Hours
          </span>
          <span className="text-[10px] text-slate-400">Excludes context switching</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Working Week</span>
          <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
            {assumptions.workingDaysPerWeek} Days / Week
          </span>
          <span className="text-[10px] text-slate-400">Monday through Friday</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Team Efficiency</span>
          <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
            {assumptions.teamEfficiency}
          </span>
          <span className="text-[10px] text-slate-400">Code review & sync overhead</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Correlation Factor</span>
          <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
            {assumptions.correlationWideningFactor}x
          </span>
          <span className="text-[10px] text-slate-400">Cross-feature variance model</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Contingency Reserve</span>
          <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
            {assumptions.contingency}
          </span>
          <span className="text-[10px] text-slate-400">Unforeseen edge cases</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Hourly Rate Table</span>
          <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
            {assumptions.rateTable}
          </span>
          <span className="text-[10px] text-slate-400">₹500 – ₹1,000 / hr roles</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Configuration Version</span>
          <span className="font-mono font-bold text-brand-600 dark:text-brand-400 block mt-0.5">
            v{assumptions.configVersion} (Engine v{assumptions.engineVersion})
          </span>
          <span className="text-[10px] text-slate-400">Reproducible benchmark</span>
        </div>
      </div>

      {/* Platform Adjustment Explanation (Section 27) */}
      <div className="p-4 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200/80 dark:border-brand-800/80 space-y-1.5 text-xs">
        <div className="flex items-center gap-2 text-brand-900 dark:text-brand-200 font-bold">
          <Info className="w-4 h-4 text-brand-500" />
          <span>Platform Multiplier Architecture Adjustment</span>
        </div>
        <p className="text-brand-800 dark:text-brand-300 leading-relaxed">
          {assumptions.platformAdjustment}
        </p>
        <p className="text-[11px] text-brand-700/80 dark:text-brand-400 leading-relaxed">
          <strong>Why this matters:</strong> This prevents shared backend business logic, database tables, and API services from being incorrectly inflated for every additional client mobile app or web interface.
        </p>
      </div>
    </Card>
  );
};
