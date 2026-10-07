import React from 'react';
import { IndianRupee, PieChart, ShieldCheck, TrendingUp, Info } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatCurrencyINR } from '../../utils/formatters';

export const CostBreakdown = ({ costData }) => {
  if (!costData) return null;

  const {
    totalProjectCost,
    formattedTotalCost,
    breakdown,
    formattedBreakdown,
  } = costData;

  const costCategories = [
    { label: 'Software Development', amount: breakdown.development, formatted: formattedBreakdown.development, color: '#3B82F6', textClass: 'text-blue-500' },
    { label: 'UI/UX Design', amount: breakdown.design, formatted: formattedBreakdown.design, color: '#8B5CF6', textClass: 'text-violet-500' },
    { label: 'QA & Verification', amount: breakdown.testing, formatted: formattedBreakdown.testing, color: '#10B981', textClass: 'text-emerald-500' },
    { label: 'Project Management', amount: breakdown.management, formatted: formattedBreakdown.management, color: '#F59E0B', textClass: 'text-amber-500' },
    { label: 'DevOps & Cloud Infra', amount: breakdown.infrastructure, formatted: formattedBreakdown.infrastructure, color: '#06B6D4', textClass: 'text-cyan-500' },
    { label: 'Specialized (Security / AI)', amount: breakdown.specialized, formatted: formattedBreakdown.specialized, color: '#EC4899', textClass: 'text-pink-500' },
    { label: 'Contingency & Reserve (8%)', amount: breakdown.additionalBuffer, formatted: formattedBreakdown.additionalBuffer, color: '#64748B', textClass: 'text-slate-400' },
  ].filter((c) => c.amount > 0);

  // Calculate SVG Donut chart segments
  let cumulativePercentage = 0;
  const donutSegments = costCategories.map((cat) => {
    const percentage = (cat.amount / totalProjectCost) * 100;
    const strokeDasharray = `${percentage} ${100 - percentage}`;
    const strokeDashoffset = -cumulativePercentage;
    cumulativePercentage += percentage;
    return {
      ...cat,
      percentage: Math.round(percentage * 10) / 10,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-500" />
            Transparent Financial Cost Breakdown
          </h3>
          <p className="text-xs text-slate-400">
            Computed directly from engineering hours, discipline allocations, and standardized hourly rates.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
            Total Project Investment
          </span>
          <span className="text-2xl font-black text-brand-600 dark:text-brand-400 tracking-tight">
            {formattedTotalCost}
          </span>
        </div>
      </div>

      {/* Main Grid: Visual SVG Donut + Category Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: SVG Donut Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56">
            <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
              <circle
                cx="21"
                cy="21"
                r="15.91549430918954"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="4.5"
                className="text-slate-100 dark:text-slate-800"
              />
              {donutSegments.map((seg, idx) => (
                <circle
                  key={idx}
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="4.5"
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  className="transition-all duration-500"
                />
              ))}
            </svg>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Budget</span>
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono leading-tight">
                {formattedTotalCost}
              </span>
              <span className="text-[10px] text-emerald-500 font-medium">100% Calibrated</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 text-center">
            Budget distribution across technical disciplines
          </p>
        </div>

        {/* Right: Category List */}
        <div className="lg:col-span-7 space-y-2.5">
          {donutSegments.map((cat, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span
                  style={{ backgroundColor: cat.color }}
                  className="w-3 h-3 rounded-full shrink-0"
                />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    {cat.label}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {cat.percentage}% of overall budget
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono font-bold text-slate-900 dark:text-white block">
                  {cat.formatted}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
