import React from 'react';
import { 
  X, 
  HelpCircle, 
  Layers, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Globe, 
  Zap, 
  Link2, 
  Palette 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

export const EstimationReasoning = ({ isOpen, onClose, featureEstimate }) => {
  if (!featureEstimate) return null;

  const {
    name,
    description,
    category,
    priority,
    complexityLevel,
    complexityScore,
    maxScore,
    factors,
    reasons,
    effortHours,
    breakdown,
    formattedCost,
    dependencies,
  } = featureEstimate;

  const FACTOR_METADATA = [
    { key: 'technical', label: 'Technical Difficulty', icon: Cpu, desc: 'Algorithmic load & asynchronous processing' },
    { key: 'database', label: 'Database Complexity', icon: Database, desc: 'Schema depth, ACID transactions & cache' },
    { key: 'integration', label: 'API & Integrations', icon: Globe, desc: 'Third-party webhooks, REST/GraphQL APIs' },
    { key: 'security', label: 'Security & Compliance', icon: ShieldCheck, desc: 'Credentials, RBAC, encryption & audit' },
    { key: 'uiUx', label: 'UI/UX Complexity', icon: Palette, desc: 'Multi-state views, data tables & animations' },
    { key: 'realTime', label: 'Real-Time Processing', icon: Zap, desc: 'WebSockets, live tracking & event streams' },
    { key: 'aiMl', label: 'AI/ML Intelligence', icon: HelpCircle, desc: 'Vector embeddings, RAG & model inference' },
    { key: 'platform', label: 'Platform Adaptation', icon: Layers, desc: 'Cross-platform mobile/web variations' },
    { key: 'dependencies', label: 'Dependency Load', icon: Link2, desc: 'Coupling with other system components' },
  ];

  const getLevelBadgeVariant = (lvl) => {
    switch (lvl) {
      case 'VERY HIGH':
        return 'danger';
      case 'HIGH':
        return 'purple';
      case 'MEDIUM':
        return 'warning';
      default:
        return 'success';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Feature Architecture: ${name}`}
      description="Algorithmic complexity factor breakdown and effort reasoning"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 text-left">
        {/* Header Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant={getLevelBadgeVariant(complexityLevel)} size="md">
                {complexityLevel} COMPLEXITY
              </Badge>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                Score: {complexityScore} / {maxScore}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5 text-brand-500" />
                {effortHours} hrs
              </span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono">
                <IndianRupee className="w-3.5 h-3.5" />
                {formattedCost}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {description || 'Standard software feature specification.'}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
            <span>Category: <strong>{category}</strong></span>
            <span>•</span>
            <span>Priority: <strong>{priority}</strong></span>
            {dependencies && dependencies.length > 0 && (
              <>
                <span>•</span>
                <span>Depends on: <strong>{dependencies.join(', ')}</strong></span>
              </>
            )}
          </div>
        </div>

        {/* 9 Factor Breakdown Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            9 Architectural Complexity Factors (0 – 5 Scale)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {FACTOR_METADATA.map((meta) => {
              const val = factors?.[meta.key] || 0;
              const Icon = meta.icon;
              return (
                <div
                  key={meta.key}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                      <Icon className="w-3.5 h-3.5 text-brand-500" />
                      {meta.label}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {val} <span className="text-[10px] text-slate-400 font-normal">/ 5</span>
                    </span>
                  </div>

                  {/* Visual Bar */}
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(val / 5) * 100}%` }}
                      className={`h-full rounded-full transition-all ${
                        val >= 4 ? 'bg-rose-500' : val >= 3 ? 'bg-amber-500' : val >= 2 ? 'bg-brand-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight truncate">
                    {meta.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explanatory Reasoning Bullets */}
        <div className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/40 border border-brand-200/50 dark:border-brand-800/50 space-y-2">
          <h4 className="text-xs font-bold text-brand-900 dark:text-brand-300">
            Why did EstimateAI assign this score?
          </h4>
          <ul className="space-y-1 text-xs text-brand-800 dark:text-brand-300">
            {reasons?.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Effort Role Distribution */}
        {breakdown && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Discipline Effort Distribution ({effortHours} hrs)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Frontend</span>
                <span className="font-bold text-slate-900 dark:text-white">{breakdown.frontendHours}h</span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Backend</span>
                <span className="font-bold text-slate-900 dark:text-white">{breakdown.backendHours}h</span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">UI/UX</span>
                <span className="font-bold text-slate-900 dark:text-white">{breakdown.uiUxHours}h</span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">QA Test</span>
                <span className="font-bold text-slate-900 dark:text-white">{breakdown.qaHours}h</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
