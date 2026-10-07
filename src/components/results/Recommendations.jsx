import React from 'react';
import { Lightbulb, CheckCircle2, Shield, Users, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const Recommendations = ({ recommendations = [] }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Team Staffing':
        return <Users className="w-4 h-4 text-brand-500 shrink-0" />;
      case 'Scope Optimization':
        return <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'Security & Compliance':
        return <Shield className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'Delivery Schedule':
        return <Clock className="w-4 h-4 text-purple-500 shrink-0" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
    }
  };

  const getImpactBadge = (impact) => {
    switch (impact) {
      case 'Critical':
        return 'danger';
      case 'High':
        return 'warning';
      default:
        return 'brand';
    }
  };

  return (
    <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Decision-Support Strategic Recommendations
          </h3>
          <p className="text-xs text-slate-400">
            Actionable optimization advice to minimize delivery variance, cut unnecessary costs, and prevent launch blockers.
          </p>
        </div>

        <Badge variant="brand" size="md">
          {recommendations.length} Recommendations
        </Badge>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-2 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {getCategoryIcon(rec.category)}
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  {rec.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="neutral" size="sm">
                  {rec.category}
                </Badge>
                <Badge variant={getImpactBadge(rec.impact)} size="sm">
                  {rec.impact} Impact
                </Badge>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
              {rec.description}
            </p>

            {/* Why and Benefit if available (Section 28) */}
            {(rec.why || rec.benefit) && (
              <div className="pl-6 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {rec.why && (
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-900 dark:text-slate-200 block mb-0.5">Rationale:</strong>
                    {rec.why}
                  </div>
                )}
                {rec.benefit && (
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                    <strong className="block mb-0.5 font-bold">Potential Benefit:</strong>
                    {rec.benefit}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
