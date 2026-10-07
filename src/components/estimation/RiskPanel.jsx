import React from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const RiskPanel = ({ risks = [] }) => {
  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
        return 'danger';
      case 'HIGH':
        return 'danger';
      case 'MEDIUM':
        return 'warning';
      default:
        return 'success';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'MEDIUM':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
    }
  };

  return (
    <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Architectural & Delivery Risk Analysis
          </h3>
          <p className="text-xs text-slate-400">
            Automated detection of technical bottlenecks, regulatory risks, and delivery vulnerabilities.
          </p>
        </div>
        <span className="text-xs text-slate-500 font-semibold">
          {risks.length} Risk Factors Identified
        </span>
      </div>

      <div className="space-y-3">
        {risks.map((risk) => (
          <div
            key={risk.id}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {getRiskIcon(risk.level)}
                <h4 className="font-bold text-slate-900 dark:text-white">
                  {risk.title}
                </h4>
              </div>
              <Badge variant={getRiskBadge(risk.level)} size="sm">
                {risk.level} RISK
              </Badge>
            </div>

            <p className="text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
              <strong>Root Cause:</strong> {risk.reason}
            </p>

            <div className="pl-6 pt-1 text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-brand-600 dark:text-brand-400">Mitigation Strategy: </span>
              <span>{risk.recommendation}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
