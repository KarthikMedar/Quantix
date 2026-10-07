import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Bookmark, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Users, 
  Clock, 
  IndianRupee, 
  Layers, 
  Sparkles 
} from 'lucide-react';
import { Button } from '../common/Button';
import { estimateProject } from '../../services/estimation/estimationEngine.js';
import { formatCurrencyINR } from '../../utils/formatters.js';

export const WhatIfScenarioPanel = ({
  project,
  features,
  baselineResult,
  onSaveScenarioAsVersion,
  onApplyScenarioToDraft,
}) => {
  // Scenario state initialized from baseline project
  const initialTimeline = project.requestedTimelineWeeks || baselineResult?.summary?.timelineWeeks || 14;
  const initialPlatforms = project.platforms || ['Web'];
  const initialContingency = 10;

  const [scenarioTimeline, setScenarioTimeline] = useState(initialTimeline);
  const [scenarioPlatforms, setScenarioPlatforms] = useState(initialPlatforms);
  const [scenarioContingency, setScenarioContingency] = useState(initialContingency);

  // Toggle platform selection (at least one platform required)
  const handleTogglePlatform = (platform) => {
    setScenarioPlatforms((prev) => {
      const exists = prev.includes(platform);
      if (exists && prev.length === 1) return prev; // Keep at least one
      if (exists) return prev.filter((p) => p !== platform);
      return [...prev, platform];
    });
  };

  // Run the REAL DETERMINISTIC ENGINE for this scenario (Section 172)
  const scenarioResult = useMemo(() => {
    try {
      const scenarioProject = {
        ...project,
        requestedTimeline: `${scenarioTimeline} weeks`,
        targetDeadline: `${scenarioTimeline} weeks`,
        requestedTimelineWeeks: scenarioTimeline,
        platforms: scenarioPlatforms,
      };
      return estimateProject(scenarioProject, features);
    } catch (err) {
      console.warn('What-if calculation error:', err);
      return null;
    }
  }, [project, features, scenarioTimeline, scenarioPlatforms]);

  // Compute real deltas against baseline
  const baseline = baselineResult?.summary || {};
  const scenario = scenarioResult?.summary || {};

  const costDiff = (scenario.expectedCost || 0) - (baseline.expectedCost || 0);
  const costPercent = baseline.expectedCost ? Math.round((costDiff / baseline.expectedCost) * 100) : 0;

  const effortDiff = (scenario.expectedEffortHours || 0) - (baseline.expectedEffortHours || 0);
  const effortPercent = baseline.expectedEffortHours ? Math.round((effortDiff / baseline.expectedEffortHours) * 100) : 0;

  const timelineDiff = (scenario.timelineWeeks || 0) - (baseline.timelineWeeks || 0);
  const teamDiff = Number(((scenario.totalTeamFTE || 0) - (baseline.totalTeamFTE || 0)).toFixed(1));
  const riskDiff = (scenario.riskScore || 0) - (baseline.riskScore || 0);

  const isTimelineFeasible = scenarioResult?.timeline?.deadlineCheck?.isAchievable ?? true;
  const feasibilityStatus = scenarioResult?.timeline?.deadlineCheck?.status || 'Feasible';

  const handleReset = () => {
    setScenarioTimeline(initialTimeline);
    setScenarioPlatforms(initialPlatforms);
    setScenarioContingency(initialContingency);
  };

  return (
    <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-navy-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>What-If Scenario Simulation</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                Pure Deterministic Engine
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Simulate timeline compression, platform expansion, and team allocation trade-offs in real time.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Baseline</span>
        </button>
      </div>

      {/* Safety Notice Banner (Section 63) */}
      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
        <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          <strong>Scenario isolation active:</strong> Adjusting controls computes a temporary model simulation. Your saved version snapshot is never modified.
        </span>
      </div>

      {/* Simulation Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50/70 dark:bg-navy-950/60 rounded-xl border border-slate-100 dark:border-navy-800">
        {/* Control 1: Requested Timeline Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300">Target Delivery Schedule:</span>
            <span className="text-brand-600 dark:text-brand-400 font-mono text-sm font-bold">
              {scenarioTimeline} Weeks
            </span>
          </div>
          <input
            type="range"
            min="4"
            max="26"
            step="1"
            value={scenarioTimeline}
            onChange={(e) => setScenarioTimeline(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-navy-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>4 wks (Compressed)</span>
            <span>14 wks (Baseline)</span>
            <span>26 wks (Relaxed)</span>
          </div>
        </div>

        {/* Control 2: Target Platform Multi-Selector */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Client Platform Scope:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {['Web', 'Android', 'iOS'].map((plat) => {
              const isSelected = scenarioPlatforms.includes(plat);
              return (
                <button
                  key={plat}
                  type="button"
                  onClick={() => handleTogglePlatform(plat)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all border ${
                    isSelected
                      ? 'bg-brand-500 text-white border-brand-500 shadow-xs'
                      : 'bg-white dark:bg-navy-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-navy-700 hover:border-slate-300'
                  }`}
                >
                  {plat}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400">
            Platform multipliers apply exclusively to client-side UI work; backend remains unified.
          </p>
        </div>
      </div>

      {/* Comparison Metrics Grid (Baseline vs Scenario) */}
      {scenarioResult && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Engine Variance Analysis (Baseline vs Scenario)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Cost Delta */}
            <div className="p-4 bg-white dark:bg-navy-850 rounded-xl border border-slate-200 dark:border-navy-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Cost</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrencyINR(baseline.expectedCost || 0)}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {formatCurrencyINR(scenario.expectedCost || 0)}
                </span>
              </div>
              <div className={`text-xs font-semibold mt-1 flex items-center gap-1 ${
                costDiff > 0 ? 'text-amber-600 dark:text-amber-400' : costDiff < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
              }`}>
                {costDiff > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : costDiff < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                <span>
                  {costDiff === 0 ? 'No change' : `${costDiff > 0 ? '+' : ''}${formatCurrencyINR(costDiff)} (${costPercent}%)`}
                </span>
              </div>
            </div>

            {/* Effort Delta */}
            <div className="p-4 bg-white dark:bg-navy-850 rounded-xl border border-slate-200 dark:border-navy-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Engineering Effort</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xs text-slate-400 line-through">
                  {baseline.expectedEffortHours || 0}h
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {scenario.expectedEffortHours || 0}h
                </span>
              </div>
              <div className={`text-xs font-semibold mt-1 flex items-center gap-1 ${
                effortDiff > 0 ? 'text-amber-600 dark:text-amber-400' : effortDiff < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
              }`}>
                {effortDiff > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : effortDiff < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                <span>
                  {effortDiff === 0 ? 'No change' : `${effortDiff > 0 ? '+' : ''}${effortDiff}h (${effortPercent}%)`}
                </span>
              </div>
            </div>

            {/* Team Size Delta */}
            <div className="p-4 bg-white dark:bg-navy-850 rounded-xl border border-slate-200 dark:border-navy-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Required Team (FTE)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xs text-slate-400 line-through">
                  {baseline.totalTeamFTE || 0} FTE
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {scenario.totalTeamFTE || 0} FTE
                </span>
              </div>
              <div className="text-xs font-semibold mt-1 text-slate-600 dark:text-slate-300">
                {teamDiff === 0 ? 'Same headcount' : `${teamDiff > 0 ? '+' : ''}${teamDiff} FTE needed`}
              </div>
            </div>

            {/* Schedule Feasibility */}
            <div className="p-4 bg-white dark:bg-navy-850 rounded-xl border border-slate-200 dark:border-navy-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Feasibility Status</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                  feasibilityStatus === 'Infeasible'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    : feasibilityStatus === 'Tight'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                }`}>
                  {feasibilityStatus}
                </span>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  {scenario.timelineWeeks} wks
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Risk Score: {scenario.riskScore}/100 ({scenario.riskLevel})
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-navy-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Calculated via deterministic PERT formulas with zero arbitrary multipliers</span>
        </div>

        <div className="flex items-center gap-2.5">
          {onApplyScenarioToDraft && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onApplyScenarioToDraft({ requestedTimelineWeeks: scenarioTimeline, platforms: scenarioPlatforms })}
              className="text-xs"
            >
              Apply to Working Draft
            </Button>
          )}

          {onSaveScenarioAsVersion && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onSaveScenarioAsVersion(scenarioResult, {
                notes: `What-If Scenario: ${scenarioTimeline} weeks timeline across ${scenarioPlatforms.join('+')} platform(s).`,
                scenarioProject: { ...project, requestedTimelineWeeks: scenarioTimeline, platforms: scenarioPlatforms },
              })}
              className="text-xs shadow-md"
            >
              <Bookmark className="w-3.5 h-3.5 mr-1" />
              Save Scenario as New Version
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
