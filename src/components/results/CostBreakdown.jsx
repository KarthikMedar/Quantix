import React from 'react';
import { IndianRupee, Server, ShieldCheck, Wrench, PieChart, Layers, HelpCircle, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ExplainButton } from './ExplainButton';
import { formatCurrencyINR } from '../../utils/formatters.js';

export const CostBreakdown = ({ costData, onOpenExplain }) => {
  if (!costData) return null;

  const {
    totalBuildCost,
    formattedBuildCost,
    buildBreakdown,
    formattedBuildBreakdown,
    infrastructure,
    maintenance,
    formattedCostRange,
  } = costData;

  const roleCategories = [
    { label: 'Software Engineering & APIs', amount: buildBreakdown.development, formatted: formattedBuildBreakdown.development, color: '#3B82F6', textClass: 'text-blue-500' },
    { label: 'UI/UX Design & Prototyping', amount: buildBreakdown.design, formatted: formattedBuildBreakdown.design, color: '#8B5CF6', textClass: 'text-violet-500' },
    { label: 'QA, Automation & Verification', amount: buildBreakdown.testing, formatted: formattedBuildBreakdown.testing, color: '#10B981', textClass: 'text-emerald-500' },
    { label: 'Project Management & Delivery', amount: buildBreakdown.management, formatted: formattedBuildBreakdown.management, color: '#F59E0B', textClass: 'text-amber-500' },
    { label: 'DevOps & Cloud Infrastructure', amount: buildBreakdown.devops, formatted: formattedBuildBreakdown.devops, color: '#06B6D4', textClass: 'text-cyan-500' },
    { label: 'Specialized (Security / AI)', amount: buildBreakdown.specialized, formatted: formattedBuildBreakdown.specialized, color: '#EC4899', textClass: 'text-pink-500' },
  ].filter((c) => c.amount > 0);

  // Pure SVG Donut Chart Calculation
  let cumulativePercentage = 0;
  const donutSegments = roleCategories.map((cat) => {
    const percentage = totalBuildCost > 0 ? (cat.amount / totalBuildCost) * 100 : 0;
    const startPercentage = cumulativePercentage;
    cumulativePercentage += percentage;
    return {
      ...cat,
      percentage: Math.round(percentage * 10) / 10,
      startPercentage,
      endPercentage: cumulativePercentage,
    };
  });

  return (
    <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-8">
      {/* 1. Header with Explain button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-brand-500" />
              Build Cost & Transparent Financial Model
            </h3>
            <ExplainButton onClick={() => onOpenExplain('cost')} />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Build Cost = Σ (Allocated Role Hours × Standard Role Rates). Zero feature double-counting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="brand" size="md">
            Total Build: {formattedBuildCost}
          </Badge>
        </div>
      </div>

      {/* 2. Primary Build Cost Section (Role-based) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: SVG Donut Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
              {donutSegments.map((seg, i) => {
                const strokeDasharray = `${seg.percentage} ${100 - seg.percentage}`;
                const strokeDashoffset = -seg.startPercentage;
                return (
                  <circle
                    key={i}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth="18"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    pathLength="100"
                    className="transition-all duration-500 hover:opacity-80"
                  />
                );
              })}
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Build Cost</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {formattedBuildCost}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                One-Time Build
              </span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Expected Range: <strong className="text-slate-900 dark:text-white">{formattedCostRange}</strong>
            </span>
          </div>
        </div>

        {/* Right: Detailed Role Cost Lines */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1">
            Build Cost Breakdown by Role
          </div>

          <div className="space-y-2">
            {roleCategories.map((cat, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-md shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {cat.label}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {cat.formatted}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 w-12 text-right">
                    {Math.round((cat.amount / totalBuildCost) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal line */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Total One-Time Build Cost
            </span>
            <span className="text-sm font-black text-brand-600 dark:text-brand-400 font-mono">
              {formattedBuildCost}
            </span>
          </div>
        </div>
      </div>

      {/* 3. ADDITIONAL COSTS (STRICTLY SEPARATE PER SECTION 5 & 12) */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-500" />
              Additional Ongoing Costs (Separated from Build Cost)
            </h4>
            <p className="text-xs text-slate-400">
              Recurring infrastructure and operational maintenance are kept distinct from the project build capital.
            </p>
          </div>
          <Badge variant="neutral" size="sm">
            Operational OPEX
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: Monthly Infrastructure */}
          <div className="p-4 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/30 border border-cyan-200/60 dark:border-cyan-800/60 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-900/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-cyan-950 dark:text-cyan-200">
                    Monthly Cloud Infrastructure
                  </h5>
                  <span className="text-[10px] text-cyan-700 dark:text-cyan-400">
                    Hosting, Database & CDN
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-cyan-900 dark:text-cyan-200 block font-mono">
                  {infrastructure.formattedMonthlyTotal}
                </span>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400">
                  / month ({infrastructure.formattedAnnualTotal}/yr)
                </span>
              </div>
            </div>

            <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
              {infrastructure.items.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>• {item.label}</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{item.formatted}/mo</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card B: Optional Year-1 Maintenance */}
          <div className="p-4 rounded-xl bg-violet-50/50 dark:bg-violet-950/30 border border-violet-200/60 dark:border-violet-800/60 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-violet-950 dark:text-violet-200">
                    Year-1 Support & Maintenance
                  </h5>
                  <span className="text-[10px] text-violet-700 dark:text-violet-400">
                    Optional Service Level Agreement
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-violet-900 dark:text-violet-200 block font-mono">
                  {maintenance.formattedAnnualCost}
                </span>
                <span className="text-[10px] text-violet-600 dark:text-violet-400">
                  / year (18% of Build Cost)
                </span>
              </div>
            </div>

            <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
              {maintenance.includedServices.map((svc, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-violet-500 font-bold">•</span>
                  <span>{svc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};
