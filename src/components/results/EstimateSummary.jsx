import React from 'react';
import { 
  IndianRupee, 
  Clock, 
  Users, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  HelpCircle, 
  Layers,
  ArrowRight,
  RefreshCw,
  Edit3,
  Download,
  FolderPlus,
  Check,
  CheckCircle2,
  Calendar,
  History
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ExplainButton } from './ExplainButton';

export const EstimateSummary = ({
  projectSummary,
  summary,
  engineVersion = '1.0.0',
  rateVersion = '1.0.0',
  generatedAt,
  versionNumber = 1,
  hasUnsavedChanges = false,
  onRecalculate,
  onEditEstimate,
  onSaveToPortfolio,
  onOpenVersionHistory,
  onExportJSON,
  isSaved,
  onOpenExplain,
}) => {
  const {
    expectedCost,
    formattedExpectedCost,
    formattedCostRange,
    expectedEffortHours,
    formattedEffortRange,
    timelineWeeks,
    timelineMonths,
    requestedTimelineWeeks,
    feasibilityStatus,
    riskScore,
    riskLevel,
    confidence,
    confidenceLevel,
    totalTeamFTE,
    roleCount,
    featureCount,
  } = summary;

  const formattedDate = generatedAt
    ? new Date(generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Just now';

  return (
    <div className="space-y-6">
      {/* SECTION 1: HEADER & ACTIONS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand" size="sm">
              {projectSummary.type || 'Custom Software'}
            </Badge>
            <Badge variant="neutral" size="sm">
              {projectSummary.domain || 'Technology'}
            </Badge>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              Engine v{engineVersion}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              Rate v{rateVersion}
            </span>
          </div>

          {/* Project Title & Version Badge */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex flex-wrap items-center gap-3">
            <span>{projectSummary.name}</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
              hasUnsavedChanges
                ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Version {versionNumber} (v{versionNumber})</span>
              {hasUnsavedChanges && <span className="font-normal text-[10px] ml-1 bg-amber-200/50 dark:bg-amber-800/50 px-1.5 py-0.2 rounded">Draft Edits</span>}
            </span>
          </h1>

          {/* Subtitle & timestamp */}
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Calculated {formattedDate}</span>
            <span>•</span>
            <span>{featureCount} scoped work items</span>
            <span>•</span>
            <span>Based on current assumptions</span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenVersionHistory && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenVersionHistory}
              leftIcon={<History className="w-3.5 h-3.5" />}
            >
              Version History
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onRecalculate}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Recalculate
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onEditEstimate}
            leftIcon={<Edit3 className="w-3.5 h-3.5" />}
          >
            Edit Estimate
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExportJSON}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export JSON
          </Button>

          <Button
            variant={hasUnsavedChanges ? 'primary' : 'secondary'}
            size="sm"
            onClick={onSaveToPortfolio}
            leftIcon={hasUnsavedChanges ? <FolderPlus className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5 text-emerald-500" />}
          >
            {hasUnsavedChanges ? 'Save Version' : `Saved (v${versionNumber})`}
          </Button>
        </div>
      </div>

      {/* SECTION 2: EXECUTIVE SUMMARY CARDS (6 METRICS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Card 1: Estimated Cost */}
        <Card className="p-4 bg-gradient-to-br from-brand-600 to-indigo-700 text-white shadow-lg shadow-brand-500/10 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-brand-100">
            <span className="text-[11px] font-bold uppercase tracking-wider">Estimated Cost</span>
            <button
              onClick={() => onOpenExplain('cost')}
              className="text-xs text-brand-200 hover:text-white underline hover:no-underline flex items-center gap-0.5"
              aria-label="Explain cost calculation"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Why?</span>
            </button>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formattedExpectedCost}
          </div>
          <div className="text-[11px] text-brand-100 pt-0.5 font-medium truncate">
            Range: {formattedCostRange}
          </div>
        </Card>

        {/* Card 2: Estimated Effort */}
        <Card className="p-4 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Estimated Effort</span>
            <ExplainButton onClick={() => onOpenExplain('cost')} />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {expectedEffortHours} <span className="text-xs font-normal text-slate-400">hrs</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5 font-medium truncate">
            Range: {formattedEffortRange}
          </div>
        </Card>

        {/* Card 3: Timeline & Feasibility */}
        <Card className="p-4 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Timeline</span>
            <ExplainButton onClick={() => onOpenExplain('timeline')} />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            ~{timelineWeeks} <span className="text-xs font-normal text-slate-400">wks</span>
          </div>
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {timelineMonths} months
            </span>
            <Badge
              variant={
                feasibilityStatus === 'Infeasible'
                  ? 'danger'
                  : feasibilityStatus === 'Tight'
                  ? 'warning'
                  : 'success'
              }
              size="sm"
            >
              {feasibilityStatus}
            </Badge>
          </div>
        </Card>

        {/* Card 4: Team Composition */}
        <Card className="p-4 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Team Required</span>
            <ExplainButton onClick={() => onOpenExplain('team')} />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalTeamFTE} <span className="text-xs font-normal text-slate-400">FTE</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5 truncate">
            {roleCount} specialized roles
          </div>
        </Card>

        {/* Card 5: Risk Score */}
        <Card className="p-4 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Risk Level</span>
            <ExplainButton onClick={() => onOpenExplain('risk')} />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {riskScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <div className="pt-0.5">
            <Badge
              variant={
                riskLevel === 'CRITICAL'
                  ? 'danger'
                  : riskLevel === 'HIGH'
                  ? 'danger'
                  : riskLevel === 'MEDIUM'
                  ? 'warning'
                  : 'success'
              }
              size="sm"
            >
              {riskLevel} RISK
            </Badge>
          </div>
        </Card>

        {/* Card 6: Confidence Rating */}
        <Card className="p-4 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Confidence</span>
            <ExplainButton onClick={() => onOpenExplain('confidence')} />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {confidence}%
          </div>
          <div className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold pt-0.5 truncate">
            {confidenceLevel} certainty (Never 100%)
          </div>
        </Card>
      </div>
    </div>
  );
};
