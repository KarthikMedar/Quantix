import React from 'react';
import { 
  AlertTriangle, 
  Cpu, 
  Database, 
  Layers, 
  ShieldCheck, 
  Clock, 
  IndianRupee, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Link2, 
  Palette 
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const FeatureEstimateDetails = ({ feature }) => {
  if (!feature) return null;

  const {
    name,
    description,
    category,
    priority,
    complexityLevel,
    complexityScore,
    factors = {},
    reasons = [],
    threePoint = {},
    effortHours,
    lowEffortHours,
    highEffortHours,
    estimatedCost,
    formattedCost,
    dependencies = [],
    source = 'AI Suggested',
    isLargeFeature,
    largeFeatureWarning,
  } = feature;

  const FACTOR_METADATA = [
    { key: 'technical', label: 'Technical Difficulty', icon: Cpu, desc: 'Algorithmic load & asynchronous processing' },
    { key: 'database', label: 'Database Complexity', icon: Database, desc: 'Schema models, relationships & query indexes' },
    { key: 'integration', label: 'Integration Complexity', icon: Link2, desc: 'External API contracts & gateway webhooks' },
    { key: 'security', label: 'Security & Auth', icon: ShieldCheck, desc: 'Encryption, token management & role auditing' },
    { key: 'uiUx', label: 'UI/UX Intricacy', icon: Palette, desc: 'Responsive pages, states & micro-interactions' },
    { key: 'realTime', label: 'Real-Time / Sync', icon: Zap, desc: 'WebSockets, concurrency & pub/sub streaming' },
    { key: 'aiMl', label: 'AI / Data Intelligence', icon: Sparkles, desc: 'Vector search, embedding models & prompts' },
    { key: 'platform', label: 'Platform Scope', icon: Layers, desc: 'Client platforms & form factor variations' },
    { key: 'dependencies', label: 'Dependency Chain', icon: Link2, desc: 'Prerequisites & architectural coupling' },
  ];

  return (
    <div className="p-5 bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-6 text-xs animate-fadeIn">
      {/* 1. Large Feature Warning Banner (Section 29) */}
      {isLargeFeature && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-extrabold block text-xs">⚠ Large Feature Advisory</span>
            <p className="text-[11px] leading-relaxed">
              {largeFeatureWarning || 'This feature exceeds 250 hours and may be too large to estimate reliably as a single unit. Consider splitting it into smaller features.'}
            </p>
          </div>
        </div>
      )}

      {/* 2. Overview & Source Metadata (Section 16) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Functional Description
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
            {description || 'Standard software module definition with established architectural parameters.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={source === 'User Edited' ? 'brand' : 'purple'} size="sm">
            {source}
          </Badge>
          <Badge variant="neutral" size="sm">
            {category}
          </Badge>
        </div>
      </div>

      {/* 3. Three-Point PERT Estimate Details (Section 17) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Three-Point PERT Estimate Details
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">
            PERT Formula: (O + 4M + P) / 6
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase">
              Optimistic (O)
            </span>
            <span className="text-base font-black text-slate-900 dark:text-white font-mono">
              {threePoint.optimistic || Math.round(effortHours * 0.7)}h
            </span>
            <span className="text-[10px] text-slate-400 block">Best case scenario</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block uppercase">
              Most Likely (M)
            </span>
            <span className="text-base font-black text-slate-900 dark:text-white font-mono">
              {threePoint.mostLikely || effortHours}h
            </span>
            <span className="text-[10px] text-slate-400 block">Standard delivery</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block uppercase">
              Pessimistic (P)
            </span>
            <span className="text-base font-black text-slate-900 dark:text-white font-mono">
              {threePoint.pessimistic || Math.round(effortHours * 1.5)}h
            </span>
            <span className="text-[10px] text-slate-400 block">High friction case</span>
          </div>

          <div className="p-3 rounded-xl bg-brand-50/80 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800">
            <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 block uppercase">
              PERT Expected (E)
            </span>
            <span className="text-base font-black text-brand-700 dark:text-brand-300 font-mono">
              {threePoint.expected || effortHours}h
            </span>
            <span className="text-[10px] text-brand-500 block">σ = {threePoint.standardDeviation || '0.0'}h</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic">
          Expected effort uses the PERT weighted average of optimistic, most likely, and pessimistic estimates.
        </p>
      </div>

      {/* 4. 9 Complexity Factors Breakdown (Section 15) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Why this complexity? (9 Algorithmic Factors)
          </h4>
          <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-300">
            Score: {complexityScore} / 45 ({complexityLevel})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {FACTOR_METADATA.map((factor) => {
            const scoreVal = factors[factor.key] || 0;
            const Icon = factor.icon;
            return (
              <div
                key={factor.key}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px]">
                      {factor.label}
                    </span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">
                      {factor.desc}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-mono font-bold text-xs shrink-0">
                  <span className={scoreVal >= 3 ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300'}>
                    {scoreVal}
                  </span>
                  <span className="text-slate-400 font-normal">/ 5</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Dependencies and Reasons */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-800">
        <div>
          <span className="font-bold text-slate-700 dark:text-slate-300">Dependencies: </span>
          {dependencies.length > 0 ? (
            <span className="font-mono text-slate-600 dark:text-slate-400">
              {dependencies.join(' → ')}
            </span>
          ) : (
            <span className="text-slate-400">None (Standalone work item)</span>
          )}
        </div>

        <div>
          <span className="font-bold text-slate-700 dark:text-slate-300">Estimated Cost Share: </span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {formattedCost}
          </span>
        </div>
      </div>
    </div>
  );
};
