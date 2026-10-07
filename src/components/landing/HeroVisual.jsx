import React from 'react';
import { 
  Cpu, 
  Clock, 
  IndianRupee, 
  Users, 
  ShieldCheck, 
  Layers, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp,
  Code2,
  Palette,
  CheckCheck
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const HeroVisual = () => {
  // Configured preview data structure ready to bind to future API / state engines
  const previewProject = {
    title: 'Cloud SaaS Migration & AI Assistant',
    status: 'AI Analysis Complete',
    confidence: '94.8% accuracy',
    complexity: 'HIGH',
    cost: '₹12,50,000',
    timeline: '6 Months',
    resources: {
      developers: 4,
      designers: 2,
      testers: 2,
    },
    modules: [
      { name: 'Auth & Multi-tenancy', effort: '85 hrs', status: 'Calculated' },
      { name: 'AI Reasoning Pipeline', effort: '140 hrs', status: 'Calculated' },
      { name: 'Billing & Analytics', effort: '60 hrs', status: 'Calculated' },
    ],
  };

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
      {/* Decorative Outer Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 via-brand-600 to-accent-violet rounded-3xl blur-xl opacity-30 dark:opacity-40 animate-pulse-slow" />

      {/* Main Container Card */}
      <div className="relative rounded-2xl glass-panel bg-white/90 dark:bg-navy-900/90 border border-slate-200/90 dark:border-slate-800 shadow-2xl p-5 sm:p-6 backdrop-blur-xl">
        {/* Mock Window Titlebar */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs font-mono text-slate-400 dark:text-slate-500">
              estimate_matrix.preview.ai
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-spin" />
            <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
              AI Estimation Engine
            </span>
          </div>
        </div>

        {/* Project Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">ID: PRJ-8429</span>
              <Badge variant="purple" size="sm" dot>
                {previewProject.status}
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {previewProject.title}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {previewProject.confidence}
            </span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {/* Project Complexity */}
          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 hover:border-amber-500/40 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Project Complexity</span>
              <Activity className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-extrabold text-amber-500 tracking-tight">
              {previewProject.complexity}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">High Architectural Load</div>
          </div>

          {/* Estimated Cost */}
          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 hover:border-brand-500/40 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Estimated Cost</span>
              <IndianRupee className="w-4 h-4 text-brand-500" />
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {previewProject.cost}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> ±8% variance range
            </div>
          </div>

          {/* Timeline */}
          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 hover:border-violet-500/40 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Timeline</span>
              <Clock className="w-4 h-4 text-violet-500" />
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {previewProject.timeline}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">24 Sprints Planned</div>
          </div>
        </div>

        {/* Resource Allocation Breakdown */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-brand-50/50 via-slate-50/50 to-purple-50/30 dark:from-navy-950/70 dark:via-slate-900/60 dark:to-slate-900/40 border border-slate-200/70 dark:border-slate-800 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-brand-500" />
              Recommended Team Composition
            </span>
            <span className="text-[11px] font-semibold text-slate-500">8 Specialists</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-center">
              <div className="flex items-center justify-center text-brand-500 mb-1">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {previewProject.resources.developers}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Developers
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-center">
              <div className="flex items-center justify-center text-accent-violet mb-1">
                <Palette className="w-4 h-4" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {previewProject.resources.designers}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Designers
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-center">
              <div className="flex items-center justify-center text-emerald-500 mb-1">
                <CheckCheck className="w-4 h-4" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {previewProject.resources.testers}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Testers
              </div>
            </div>
          </div>
        </div>

        {/* Feature Breakdown Progress Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Core Feature Modules</span>
            <span>Est. Effort</span>
          </div>
          {previewProject.modules.map((mod, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-50/60 dark:bg-slate-800/40 text-xs border border-slate-100 dark:border-slate-800/60"
            >
              <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                {mod.name}
              </span>
              <span className="font-mono text-slate-500 dark:text-slate-400 font-medium">
                {mod.effort}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Notice */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Simulation Preview — Ready for Phase 2 Engine</span>
          <span className="text-brand-500 font-medium">Live Dashboard Preview</span>
        </div>
      </div>
    </div>
  );
};
