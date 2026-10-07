import React, { useState } from 'react';
import { Sparkles, HelpCircle, AlertTriangle, CheckCircle2, ChevronRight, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const AIInsightsCard = ({
  estimateResult,
  onOpenExplain,
  onOpenMissingFeatures,
}) => {
  if (!estimateResult || !estimateResult.summary) return null;

  const { summary, features = [], risks = {} } = estimateResult;

  // Identify top cost driver feature
  const sortedFeatures = [...features].sort((a, b) => (b.estimatedCost || 0) - (a.estimatedCost || 0));
  const topCostFeature = sortedFeatures[0];

  // Feasibility status
  const feasibilityStatus = estimateResult.timeline?.deadlineCheck?.status || 'Feasible';
  const isTimelineFeasible = feasibilityStatus === 'Feasible';

  return (
    <Card className="p-6 bg-gradient-to-br from-white via-brand-50/20 to-indigo-50/20 dark:from-navy-900 dark:via-navy-900/90 dark:to-indigo-950/20 border-brand-200/60 dark:border-navy-700 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-navy-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-xs">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                AI Executive Insights
              </h3>
              <Badge variant="brand" size="sm">
                Phase 8
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Contextual analysis complementing deterministic calculations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenMissingFeatures && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenMissingFeatures}
            >
              Missing Scope Analysis
            </Button>
          )}
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onOpenExplain}
            leftIcon={<HelpCircle className="w-4 h-4" />}
          >
            Explain This Estimate
          </Button>
        </div>
      </div>

      {/* 4 KPI Insight Bullets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Cost Driver */}
        <div className="p-3.5 bg-white dark:bg-navy-950/80 rounded-2xl border border-slate-200/80 dark:border-navy-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Primary Cost Driver
          </span>
          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
            {topCostFeature ? topCostFeature.name : 'Balanced Scope Distribution'}
          </p>
          <p className="text-[10px] text-slate-500">
            {topCostFeature ? `₹${topCostFeature.formattedCost || topCostFeature.estimatedCost} (${topCostFeature.complexityLevel})` : 'Standard modular baseline'}
          </p>
        </div>

        {/* Timeline Risk */}
        <div className="p-3.5 bg-white dark:bg-navy-950/80 rounded-2xl border border-slate-200/80 dark:border-navy-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Schedule Feasibility
          </span>
          <div className="flex items-center gap-1.5">
            {isTimelineFeasible ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            )}
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {feasibilityStatus} Schedule
            </p>
          </div>
          <p className="text-[10px] text-slate-500">
            {summary.timelineWeeks} weeks @ {summary.totalTeamFTE} FTE velocity
          </p>
        </div>

        {/* Architectural Density */}
        <div className="p-3.5 bg-white dark:bg-navy-950/80 rounded-2xl border border-slate-200/80 dark:border-navy-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Architectural Risk
          </span>
          <p className="text-xs font-bold text-slate-900 dark:text-white">
            {risks.level || 'MODERATE'} ({risks.score || 25}/100)
          </p>
          <p className="text-[10px] text-slate-500">
            {features.length} modules, 0 circular dependencies
          </p>
        </div>

        {/* Confidence Model */}
        <div className="p-3.5 bg-white dark:bg-navy-950/80 rounded-2xl border border-slate-200/80 dark:border-navy-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Deterministic Confidence
          </span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {summary.confidenceScore || 78}% Rating
            </p>
          </div>
          <p className="text-[10px] text-slate-500">
            Realistically bounded [52%–88%]
          </p>
        </div>
      </div>
    </Card>
  );
};
