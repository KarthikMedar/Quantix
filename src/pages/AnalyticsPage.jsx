import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  Layers, 
  IndianRupee, 
  ShieldAlert, 
  FolderKanban, 
  ArrowRight,
  Sparkles,
  PieChart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { projectService } from '../services/projectService';
import { formatCurrencyINR } from '../utils/formatters';

export const AnalyticsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectService.getAllProjects().then((data) => {
      setProjects(data);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  // Aggregated calculations based strictly on real project data
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'Active');

  let totalPortfolioCost = 0;
  let totalEffortHours = 0;
  let totalFeatures = 0;
  let totalWeeks = 0;
  let totalFte = 0;
  let validSummaryCount = 0;

  const domainCounts = {};
  const riskCounts = { Low: 0, Medium: 0, High: 0 };

  projects.forEach((p) => {
    const s = p.summary || {};
    if (s.expectedCost) {
      totalPortfolioCost += s.expectedCost;
      validSummaryCount++;
    }
    if (s.expectedEffortHours) totalEffortHours += s.expectedEffortHours;
    if (s.featureCount) totalFeatures += s.featureCount;
    if (s.timelineWeeks) totalWeeks += s.timelineWeeks;
    if (s.totalTeamFTE) totalFte += s.totalTeamFTE;

    // Domain distribution
    const d = p.domain || 'Custom Software';
    domainCounts[d] = (domainCounts[d] || 0) + 1;

    // Risk distribution
    const r = s.riskLevel || 'Medium';
    if (riskCounts[r] !== undefined) riskCounts[r]++;
    else riskCounts.Medium++;
  });

  const avgTimeline = validSummaryCount > 0 ? (totalWeeks / validSummaryCount).toFixed(1) : 0;
  const avgTeamFte = validSummaryCount > 0 ? (totalFte / validSummaryCount).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 dark:text-slate-400">Aggregating workspace portfolio analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-brand-500" />
            <span>Workspace Analytics & Forecasting</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Aggregated metrics derived deterministically from saved project estimation snapshots.
          </p>
        </div>

        <Button to="/new-estimate" variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
          New Estimate
        </Button>
      </div>

      {/* Empty State */}
      {totalProjects === 0 ? (
        <Card className="p-12 text-center bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 max-w-xl mx-auto">
          <FolderKanban className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Projects Estimated Yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Create your first project estimation to unlock velocity trends, risk distributions, and portfolio spend analytics.
          </p>
          <Button to="/new-estimate" variant="primary" size="md">
            Create First Estimate
          </Button>
        </Card>
      ) : (
        <>
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Portfolio Estimated Value</span>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {formatCurrencyINR(totalPortfolioCost)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Across {validSummaryCount} calculated projects
                </span>
              </div>
            </Card>

            <Card className="p-5 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Engineering Work Hours</span>
                <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-500">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {totalEffortHours.toLocaleString()}h
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {totalFeatures} total work-item features
                </span>
              </div>
            </Card>

            <Card className="p-5 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avg Delivery Duration</span>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {avgTimeline} Wks
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Critical path & buffer adjusted
                </span>
              </div>
            </Card>

            <Card className="p-5 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avg Staffing Velocity</span>
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-500">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {avgTeamFte} FTE
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Target multidisciplinary team size
                </span>
              </div>
            </Card>
          </div>

          {/* Breakdown Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Domain Breakdown */}
            <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-brand-500" />
                  <span>Domain Portfolio Distribution</span>
                </h3>
                <span className="text-xs text-slate-400">{Object.keys(domainCounts).length} Domains</span>
              </div>

              <div className="space-y-3">
                {Object.entries(domainCounts).map(([domain, count]) => {
                  const pct = Math.round((count / totalProjects) * 100);
                  return (
                    <div key={domain} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">{domain}</span>
                        <span className="text-slate-400">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Risk Distribution */}
            <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>Risk Profile Distribution</span>
                </h3>
                <span className="text-xs text-slate-400">{totalProjects} Projects</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-600 dark:text-emerald-400">Low Risk</span>
                    <span className="text-slate-400">{riskCounts.Low} Projects</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${totalProjects ? (riskCounts.Low / totalProjects) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-amber-600 dark:text-amber-400">Medium Risk</span>
                    <span className="text-slate-400">{riskCounts.Medium} Projects</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${totalProjects ? (riskCounts.Medium / totalProjects) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-rose-600 dark:text-rose-400">High Risk</span>
                    <span className="text-slate-400">{riskCounts.High} Projects</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${totalProjects ? (riskCounts.High / totalProjects) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Project Comparison Table */}
          <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-brand-500" />
              <span>Project Snapshot Overview</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Project Name</th>
                    <th className="py-2.5 px-3">Domain</th>
                    <th className="py-2.5 px-3">Latest Version</th>
                    <th className="py-2.5 px-3">Estimated Cost</th>
                    <th className="py-2.5 px-3">Effort</th>
                    <th className="py-2.5 px-3">Timeline</th>
                    <th className="py-2.5 px-3">Risk</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {projects.map((p) => {
                    const s = p.summary || {};
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                          {p.name}
                        </td>
                        <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                          {p.domain}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-brand-500">
                          {p.latestVersionTag || 'v1'}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                          {s.expectedCost ? formatCurrencyINR(s.expectedCost) : '--'}
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                          {s.expectedEffortHours ? `${s.expectedEffortHours}h` : '--'}
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                          {s.timelineWeeks ? `${s.timelineWeeks} Wks` : '--'}
                        </td>
                        <td className="py-3 px-3">
                          <Badge
                            variant={s.riskLevel === 'High' ? 'danger' : s.riskLevel === 'Low' ? 'success' : 'warning'}
                            size="sm"
                          >
                            {s.riskLevel || 'Medium'}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Link
                            to={`/projects/${p.id}`}
                            className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
