import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  FolderKanban, 
  FileSpreadsheet, 
  IndianRupee, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  Activity,
  Lightbulb,
  Cpu,
  Eye
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { projectService } from '../services/projectService';
import { formatCurrencyINR } from '../utils/formatters';

export const DashboardPage = () => {
  const { currentUser } = useAuth();
  const userName = currentUser?.name ? currentUser.name.split(' ')[0] : 'there';

  const [workspaceStats, setWorkspaceStats] = useState({
    totalProjects: 0,
    totalEstimates: 0,
    averageCost: '--',
    averageTimeline: '--',
    recentProjects: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await projectService.getWorkspaceStats();
        setWorkspaceStats(stats);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statsCards = [
    {
      title: 'Total Projects',
      value: workspaceStats.totalProjects.toString(),
      description: workspaceStats.totalProjects > 0 ? 'Active in workspace' : 'No projects created yet',
      icon: FolderKanban,
      color: 'text-brand-500',
      bgColor: 'bg-brand-50 dark:bg-brand-950/60',
    },
    {
      title: 'Total Estimates',
      value: workspaceStats.totalEstimates.toString(),
      description: workspaceStats.totalEstimates > 0 ? 'AI estimates generated' : 'Zero estimations run',
      icon: FileSpreadsheet,
      color: 'text-violet-500',
      bgColor: 'bg-violet-50 dark:bg-violet-950/60',
    },
    {
      title: 'Average Cost',
      value: workspaceStats.averageCost,
      description: workspaceStats.averageCost !== '--' ? 'Across estimated projects' : 'Awaiting estimation data',
      icon: IndianRupee,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/60',
    },
    {
      title: 'Average Timeline',
      value: workspaceStats.averageTimeline,
      description: workspaceStats.averageTimeline !== '--' ? 'Average delivery cycle' : 'Awaiting sprint calculations',
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/60',
    },
  ];

  const activePlatformModules = [
    { id: '1', name: 'Deterministic PERT Engine', status: 'Operational', desc: '3-Point PERT work-item effort distribution' },
    { id: '2', name: 'Transparent Cost Modeling', status: 'Operational', desc: 'Zero double counting role allocation' },
    { id: '3', name: 'Critical Path & Team Sizing', status: 'Operational', desc: 'DAG analysis & timeline-driven FTE' },
    { id: '4', name: 'Immutable Version History', status: 'Operational', desc: 'Audit-ready snapshots & side-by-side diffs' },
    { id: '5', name: 'AI Decision & NLP Assistant', status: 'Operational', desc: 'Requirement analysis with resilient fallback' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-brand-600 via-brand-700 to-navy-900 text-white shadow-xl border border-brand-400/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-violet/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-sm border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>EstimateAI Workspace Shell</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back{userName ? `, ${userName}` : ''}!
            </h2>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Ready to turn your next software idea into an estimate?
            </p>
          </div>

          <div className="shrink-0">
            <Button
              to="/new-estimate"
              variant="secondary"
              size="lg"
              leftIcon={<PlusCircle className="w-5 h-5 text-brand-600" />}
              className="text-brand-700 font-bold hover:bg-white shadow-lg w-full sm:w-auto"
            >
              Create New Estimate
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="p-5 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl ${stat.bgColor} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {stat.value}
              </div>

              <div className="mt-1 text-xs text-slate-400 font-medium">
                {stat.description}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Grid: Recent Projects + Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Projects */}
        <div className="lg:col-span-7">
          <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Recent Estimates & Projects
                  </h3>
                  <p className="text-xs text-slate-400">
                    Latest software estimation specifications in your repository
                  </p>
                </div>
                <Link
                  to="/projects"
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  View All ({workspaceStats.totalProjects})
                </Link>
              </div>

              {workspaceStats.recentProjects.length === 0 ? (
                <div className="py-12 px-4 text-center max-w-sm mx-auto space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-500 mx-auto flex items-center justify-center border border-brand-200/40 dark:border-brand-800/40">
                    <FolderKanban className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      No Project Estimates Yet
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Start by describing your first software product or client application requirement.
                    </p>
                  </div>
                  <Button
                    to="/new-estimate"
                    variant="primary"
                    size="sm"
                    leftIcon={<PlusCircle className="w-4 h-4" />}
                  >
                    Create First Estimate
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {workspaceStats.recentProjects.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between hover:border-brand-500/40 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                            {p.title}
                          </h4>
                          <Badge variant="brand" size="sm">
                            {p.domain}
                          </Badge>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-3">
                          <span>{p.features?.length || 0} Modules</span>
                          <span>•</span>
                          <span>Timeline: {p.metrics?.timelineMonths || '--'} Mos</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            {p.metrics?.totalCost ? formatCurrencyINR(p.metrics.totalCost) : '--'}
                          </span>
                          <span className="text-[10px] text-amber-500 font-semibold">
                            {p.metrics?.complexityScore}
                          </span>
                        </div>
                        <Button to="/projects" variant="ghost" size="sm" className="p-1.5">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Database Sync: LocalStorage & REST API Active</span>
              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Production Engine v1.0.0 Active
              </span>
            </div>
          </Card>
        </div>

        {/* Right Column: Architectural Modules */}
        <div className="lg:col-span-5">
          <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-brand-500" />
                    <span>Engine Pipeline Status</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    All core calculation and intelligence systems operational
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {activePlatformModules.map((phase) => (
                  <div
                    key={phase.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-brand-500/10 text-brand-500 dark:text-brand-400 font-mono text-[11px] font-bold flex items-center justify-center">
                        {phase.id}
                      </span>
                      <div>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                          {phase.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {phase.desc}
                        </span>
                      </div>
                    </div>
                    <Badge variant="success" size="sm">
                      {phase.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-3.5 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200/50 dark:border-brand-800/50 text-xs text-brand-800 dark:text-brand-300">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  You can now create new project estimations with custom software features, pick presets, and review defensible engineering costs.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
