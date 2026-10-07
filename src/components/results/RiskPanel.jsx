import React from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ExplainButton } from './ExplainButton';

export const RiskPanel = ({ riskAnalysis, onOpenExplain }) => {
  if (!riskAnalysis) return null;

  const { score, level, specificReasons = [], drivers = {}, items = [] } = riskAnalysis;

  const getDriverColor = (lvl) => {
    switch (lvl?.toLowerCase()) {
      case 'high':
        return 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900';
      case 'medium':
        return 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900';
      default:
        return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900';
    }
  };

  return (
    <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              Delivery & Architectural Risk Dashboard
            </h3>
            <ExplainButton onClick={() => onOpenExplain('risk')} />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Objective evaluation of delivery pressure, integration contracts, and architectural density.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={
              level === 'CRITICAL' || level === 'HIGH'
                ? 'danger'
                : level === 'MEDIUM'
                ? 'warning'
                : 'success'
            }
            size="md"
          >
            {level} RISK ({score} / 100)
          </Badge>
        </div>
      </div>

      {/* 5 Main Risk Drivers Grid (Section 23) */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Primary Risk Drivers
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {Object.entries(drivers).map(([key, drv]) => (
            <div
              key={key}
              className={`p-3 rounded-xl border text-center ${getDriverColor(drv.level)}`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-500 dark:text-slate-400">
                {drv.label}
              </span>
              <span className="text-sm font-black block mt-0.5 font-mono">
                {drv.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Specific Root Cause Bullets (Section 24) */}
      <div className="space-y-2.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
        <span className="text-xs font-bold text-slate-900 dark:text-white block">
          Why is risk rated at this level?
        </span>

        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
          {specificReasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-rose-500 font-bold text-sm leading-none mt-0.5">•</span>
              <span className="leading-relaxed">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Detailed Risk Item Cards */}
      {items.length > 0 && (
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Identified Risk Dimensions & Mitigations ({items.length})
          </span>

          <div className="space-y-2.5">
            {items.map((risk) => (
              <div
                key={risk.id}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">
                    {risk.title}
                  </span>
                  <Badge variant={risk.level === 'HIGH' || risk.level === 'CRITICAL' ? 'danger' : 'warning'} size="sm">
                    {risk.level}
                  </Badge>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {risk.reason}
                </p>

                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                  <span><strong>Mitigation:</strong> {risk.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
