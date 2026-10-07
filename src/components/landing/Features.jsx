import React from 'react';
import { 
  Cpu, 
  Layers, 
  Users, 
  IndianRupee, 
  CalendarRange, 
  GitCompare, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const Features = () => {
  const featureList = [
    {
      id: 'req-analysis',
      title: 'AI Requirement Analysis',
      description: 'Analyze software requirements and identify important project characteristics, technical constraints, and potential edge cases.',
      icon: Cpu,
      badge: 'AI Core',
      badgeVariant: 'brand',
      accentColor: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'complexity',
      title: 'Feature Complexity',
      description: 'Understand the complexity of individual software features with automated difficulty scoring and technical architectural load assessments.',
      icon: Layers,
      badge: 'Algorithmic',
      badgeVariant: 'warning',
      accentColor: 'from-amber-500 to-orange-500',
    },
    {
      id: 'team',
      title: 'Team Estimation',
      description: 'Estimate developers, designers, testers and other specialized resources required to build and deliver your product successfully.',
      icon: Users,
      badge: 'Resource Sizing',
      badgeVariant: 'purple',
      accentColor: 'from-violet-500 to-purple-500',
    },
    {
      id: 'cost',
      title: 'Cost Estimation',
      description: 'Calculate feature-wise and overall project cost with confidence intervals, overhead buffers, and regional currency standards.',
      icon: IndianRupee,
      badge: 'Financial Model',
      badgeVariant: 'success',
      accentColor: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'timeline',
      title: 'Timeline Planning',
      description: 'Estimate realistic development timelines, sprint milestones, buffer allocations, and delivery schedules based on historical engineering benchmarks.',
      icon: CalendarRange,
      badge: 'Sprint Roadmap',
      badgeVariant: 'brand',
      accentColor: 'from-sky-500 to-blue-600',
    },
    {
      id: 'comparison',
      title: 'Project Comparison',
      description: 'Compare different project scenarios, technology stacks, team allocations, and budgetary trade-offs side by side.',
      icon: GitCompare,
      badge: 'Decision Matrix',
      badgeVariant: 'neutral',
      accentColor: 'from-indigo-500 to-blue-500',
    },
  ];

  return (
    <section id="features-section" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 text-xs font-semibold text-brand-700 dark:text-brand-300 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Comprehensive Planning Suite</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything You Need to Plan a Software Project
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            From raw concept to engineering-ready scope. EstimateAI breaks down the ambiguity of custom software development with algorithmic precision.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featureList.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                hoverEffect={true}
                className="group relative flex flex-col justify-between p-7 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 hover:border-brand-500/40 transition-all duration-300"
              >
                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <Badge variant={feature.badgeVariant} size="sm">
                      {feature.badge}
                    </Badge>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex items-center justify-between">
                    <span>{feature.title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-brand-500" />
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle Accent Indicator */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono">Engine Module</span>
                  <span className="text-brand-500 font-semibold group-hover:underline">
                    Phase 2 Engine Ready
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
