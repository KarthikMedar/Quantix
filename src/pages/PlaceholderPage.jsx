import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  Layers, 
  PlusCircle, 
  FolderKanban, 
  BarChart3, 
  Settings, 
  Clock, 
  Cpu,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const PlaceholderPage = () => {
  const location = useLocation();

  const getPageConfig = () => {
    switch (location.pathname) {
      case '/new-estimate':
        return {
          title: 'New Project Estimation Wizard',
          description: 'Interactive step-by-step wizard to input project details, break down modules, and configure technical stacks.',
          phase: 'Phase 2 Module',
          icon: PlusCircle,
          plannedFeatures: [
            'Project Scope & Objective Input',
            'Feature Tagging & Granular Difficulty Weights',
            'Tech Stack Sizing (Frontend, Backend, Cloud)',
            'Real-Time AI Complexity Estimation Engine',
          ],
        };
      case '/projects':
        return {
          title: 'Project Portfolio Management',
          description: 'Comprehensive repository to manage, filter, archive, and export completed software estimations.',
          phase: 'Phase 2 Module',
          icon: FolderKanban,
          plannedFeatures: [
            'Search & Tag-based Project Categorization',
            'Version History & Scenario Comparison',
            'PDF & Markdown Executive Scope Export',
            'Client Proposal Formatter',
          ],
        };
      case '/analytics':
        return {
          title: 'Estimation Analytics & Benchmarks',
          description: 'Cross-project historical analytics, developer velocity trends, and variance metrics.',
          phase: 'Phase 3 Module',
          icon: BarChart3,
          plannedFeatures: [
            'Cost vs Actual Variance Tracking',
            'Sprint Velocity Modeling',
            'Resource Utilization Curves',
            'AI Model Calibration & Accuracy Metrics',
          ],
        };
      case '/settings':
        return {
          title: 'Workspace & Regional Settings',
          description: 'Configure regional currency rates, developer hourly tiers, and AI model preferences.',
          phase: 'Phase 2 Module',
          icon: Settings,
          plannedFeatures: [
            'Regional Currency & Exchange Rate Configuration',
            'Developer Tier Base Rates (Junior, Mid, Senior, Lead)',
            'AI Reasoning Depth & Temperature Controls',
            'Team Collaboration & Role Access Management',
          ],
        };
      default:
        return {
          title: 'Module Under Construction',
          description: 'This platform module is scheduled for implementation in upcoming phases.',
          phase: 'Upcoming Phase',
          icon: Cpu,
          plannedFeatures: ['Under active development'],
        };
    }
  };

  const config = getPageConfig();
  const Icon = config.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn py-6">
      {/* Back button */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Main Preview Card */}
      <Card className="p-8 sm:p-12 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-72 h-72 bg-brand-500/10 dark:bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60 shadow-inner">
            <Icon className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="brand" size="md">
              {config.phase}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {config.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {config.description}
            </p>
          </div>

          {/* Planned Features List */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-left space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Planned Engine Capabilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {config.plannedFeatures.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="pt-2 flex justify-center gap-3">
            <Button to="/dashboard" variant="primary" size="md">
              Return to Dashboard
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
