import React from 'react';
import { 
  FileText, 
  ListPlus, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Card } from '../common/Card';

export const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Describe Your Project',
      description: 'Enter your project details, business objectives, target platforms, and high-level software requirements.',
      icon: FileText,
      tag: 'Input Phase',
    },
    {
      number: '02',
      title: 'Add Features',
      description: 'List the specific software capabilities, authentication modules, database models, and integrations you want to build.',
      icon: ListPlus,
      tag: 'Scoping Phase',
    },
    {
      number: '03',
      title: 'Analyze',
      description: 'Estimate technical complexity, developer requirements, sprint allocations, and development cost factors.',
      icon: Cpu,
      tag: 'AI Intelligence Phase',
    },
    {
      number: '04',
      title: 'Get Your Estimate',
      description: 'View, customize, and export a comprehensive project estimation report complete with timeline milestones and resource plans.',
      icon: CheckCircle2,
      tag: 'Delivery Phase',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50/50 dark:bg-navy-950/60 border-y border-slate-200/80 dark:border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/60 border border-violet-200/60 dark:border-violet-800/60 text-xs font-semibold text-violet-700 dark:text-violet-300 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-violet-500" />
            <span>Structured Process</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How EstimateAI Works
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            A frictionless four-step methodology turning rough thoughts into structured, defensible engineering specifications.
          </p>
        </div>

        {/* Process Diagram: Horizontal on desktop, Vertical on mobile */}
        <div className="relative">
          {/* Connecting Track Line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-brand-500/20 via-brand-500 to-accent-violet/30 -translate-y-8 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative group">
                  <Card
                    hoverEffect={true}
                    className="h-full flex flex-col justify-between p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800"
                  >
                    <div>
                      {/* Step Number & Icon Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-accent-violet text-white flex items-center justify-center font-bold text-base shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform">
                            <Icon className="w-6 h-6" />
                          </div>
                        </div>

                        <span className="font-mono text-2xl font-black text-slate-300 dark:text-slate-700 group-hover:text-brand-500 transition-colors">
                          {step.number}
                        </span>
                      </div>

                      {/* Phase Tag */}
                      <div className="text-[11px] font-semibold tracking-wider uppercase text-brand-600 dark:text-brand-400 mb-2">
                        {step.tag}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Step bottom indicator */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span>Step {idx + 1} of 4</span>
                      {idx < 3 && (
                        <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                      )}
                      {idx === 3 && (
                        <span className="text-emerald-500 font-semibold">Final Output</span>
                      )}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
