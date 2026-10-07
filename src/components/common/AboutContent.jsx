import React from 'react';
import { 
  ArrowRight, 
  Target, 
  Layers, 
  Users, 
  Sparkles, 
  GraduationCap, 
  Rocket, 
  Code, 
  Briefcase, 
  Building2, 
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { Badge } from './Badge';

export const AboutContent = () => {
  const pipeline = [
    { label: 'Software Idea', desc: 'Raw concept & goals' },
    { label: 'Requirements', desc: 'Functional scoping' },
    { label: 'Complexity', desc: 'Technical debt & load' },
    { label: 'Resources', desc: 'Engineers & roles' },
    { label: 'Timeline', desc: 'Sprints & milestones' },
    { label: 'Cost', desc: 'Defensible budget' },
  ];

  const analysisItems = [
    'Project requirements & scope boundaries',
    'Software features & technical dependencies',
    'Architectural complexity & risk factors',
    'Specialized engineering resources needed',
    'Realistic sprint delivery timelines',
    'End-to-end development cost estimations',
  ];

  const userPersonas = [
    { title: 'Students', desc: 'Plan academic capstone projects with realistic scopes', icon: GraduationCap },
    { title: 'Startups', desc: 'Pitch realistic budgets to investors & plan MVP roadmaps', icon: Rocket },
    { title: 'Developers', desc: 'Break down tickets and understand technical complexity', icon: Code },
    { title: 'Project Managers', desc: 'Formulate accurate sprint capacities and team sizing', icon: Briefcase },
    { title: 'Software Companies', desc: 'Generate rapid client proposals with transparent costs', icon: Building2 },
    { title: 'Clients', desc: 'Evaluate vendor quotes with independent AI cost benchmarks', icon: UserCheck },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Intro Mission Statement */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 text-xs font-semibold text-brand-700 dark:text-brand-300">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>About EstimateAI</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          Intelligent Software Project Planning Before Writing A Single Line Of Code
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          EstimateAI is an AI-assisted software project estimation platform designed to help users understand what is required to build a software product before development begins.
        </p>
      </div>

      {/* The Transformation Pipeline */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Core Transformation Model
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {pipeline.map((step, idx) => (
            <div
              key={step.label}
              className="relative p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-center"
            >
              <span className="text-[10px] font-mono font-bold text-brand-500 block mb-0.5">
                0{idx + 1}
              </span>
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {step.label}
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Purpose & What We Analyze */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Purpose */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Our Purpose
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Help users make better software planning decisions. Over 65% of software initiatives run over budget or miss deadlines due to improper upfront scoping. EstimateAI bridges this gap with structured analysis.
          </p>
        </div>

        {/* What We Analyze */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            What We Analyze
          </h4>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {analysisItems.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Who Can Use It */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-brand-500" />
          <span>Who Can Use It</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {userPersonas.map((persona) => {
            const Icon = persona.icon;
            return (
              <div
                key={persona.title}
                className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                    {persona.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {persona.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
