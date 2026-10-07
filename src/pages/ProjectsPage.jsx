import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  FolderKanban, 
  Clock, 
  IndianRupee, 
  Trash2, 
  Copy, 
  Eye, 
  Download, 
  Layers,
  Sparkles,
  ExternalLink,
  Users,
  ShieldCheck,
  History,
  Archive,
  RefreshCw,
  GitCompare,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';
import { useProjectEstimation } from '../context/ProjectEstimationContext';
import { projectApi } from '../services/projectApi';
import { formatCurrencyINR } from '../utils/formatters';
import { VersionHistoryList } from '../components/versions/VersionHistoryList';
import { VersionComparisonModal } from '../components/versions/VersionComparisonModal';
import { VersionSnapshotModal } from '../components/versions/VersionSnapshotModal';

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const { loadProject, useVersionAsStartingPoint } = useProjectEstimation();
  const { showToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'High Risk' | 'Archived'

  // Modal states
  const [activeHistoryProject, setActiveHistoryProject] = useState(null);
  const [projectVersions, setProjectVersions] = useState([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [viewedSnapshot, setViewedSnapshot] = useState(null);
  const [compareVersions, setCompareVersions] = useState(null); // { versionA, versionB }

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectApi.getAllProjects();
      setProjects(data);
    } catch (err) {
      showToast('Failed to load projects: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Open Version History Drawer/Modal
  const handleOpenVersionHistory = async (project) => {
    setActiveHistoryProject(project);
    setLoadingVersions(true);
    try {
      const vers = await projectApi.getProjectVersions(project.id);
      setProjectVersions(vers);
    } catch (err) {
      showToast('Failed to load version history: ' + err.message, 'error');
    } finally {
      setLoadingVersions(false);
    }
  };

  // Open Project in Results Dashboard
  const handleOpenInResults = async (project) => {
    try {
      await loadProject(project.id);
      navigate('/estimate-results');
      showToast(`Loaded "${project.name}" (v${project.latestVersionNumber || 1}) into Results Dashboard.`, 'info');
    } catch (err) {
      showToast('Failed to open project: ' + err.message, 'error');
    }
  };

  // Open Project in Project Details Page
  const handleOpenProjectDetails = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  // Duplicate Project
  const handleDuplicate = async (project) => {
    try {
      const cloned = await projectApi.duplicateProject(project.id);
      setProjects((prev) => [cloned, ...prev]);
      showToast(`Duplicated "${project.name}" as "${cloned.name}".`, 'success');
      fetchProjects();
    } catch (err) {
      showToast('Failed to duplicate project: ' + err.message, 'error');
    }
  };

  // Archive / Restore Project
  const handleToggleArchive = async (project) => {
    try {
      if (project.status === 'Archived') {
        await projectApi.unarchiveProject(project.id);
        showToast(`Restored "${project.name}" to Active projects.`, 'success');
      } else {
        await projectApi.archiveProject(project.id);
        showToast(`Archived "${project.name}". Historical versions preserved.`, 'info');
      }
      fetchProjects();
    } catch (err) {
      showToast('Failed to update project status: ' + err.message, 'error');
    }
  };

  // Safe starting point handler from snapshot
  const handleUseAsStartingPoint = (version) => {
    useVersionAsStartingPoint(version);
    setActiveHistoryProject(null);
    setViewedSnapshot(null);
    navigate('/new-estimate');
    showToast(`Loaded v${version.versionNumber} as active project draft. Recalculate to save a new version.`, 'info');
  };

  // Filter projects by search and status
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.domain && p.domain.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesStatus = true;
    if (statusFilter === 'Active') {
      matchesStatus = p.status === 'Active' || !p.status;
    } else if (statusFilter === 'High Risk') {
      matchesStatus = p.summary?.riskLevel === 'High' || (p.summary?.riskScore || 0) >= 65;
    } else if (statusFilter === 'Archived') {
      matchesStatus = p.status === 'Archived';
    } else if (statusFilter === 'All') {
      matchesStatus = p.status !== 'Archived'; // Don't show archived in All by default
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            My Projects & Estimate Portfolio
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage projects, explore immutable estimate versions (v1, v2, v3), and compare scope shifts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            to="/new-estimate"
            variant="primary"
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            New Estimate
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/90 dark:border-navy-700 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by name, domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Active', 'High Risk', 'Archived'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-colors border whitespace-nowrap
                ${
                  statusFilter === st
                    ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-navy-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-navy-700 hover:border-slate-300'
                }
              `}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 animate-pulse space-y-4">
              <div className="h-5 bg-slate-200 dark:bg-navy-800 rounded w-1/3"></div>
              <div className="h-4 bg-slate-100 dark:bg-navy-800/60 rounded w-2/3"></div>
              <div className="h-16 bg-slate-50 dark:bg-navy-950 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        /* Empty State */
        <Card className="p-12 text-center max-w-md mx-auto space-y-4 bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-700">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-navy-800 text-brand-500 mx-auto flex items-center justify-center">
            <FolderKanban className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {searchQuery ? 'No matching projects found' : 'No projects yet'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              {searchQuery
                ? 'Try adjusting your search query or filter settings.'
                : 'Create your first software estimate to understand cost, timeline, team, and risk.'}
            </p>
          </div>
          <div className="pt-2">
            <Button to="/new-estimate" variant="primary" size="sm">
              Create New Estimate
            </Button>
          </div>
        </Card>
      ) : (
        /* Projects Cards Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredProjects.map((p) => {
            const sum = p.summary || {};
            const isArchived = p.status === 'Archived';

            return (
              <div
                key={p.id}
                className={`group bg-white dark:bg-navy-900 rounded-2xl border transition-all duration-200 p-6 shadow-sm hover:shadow-md flex flex-col justify-between ${
                  isArchived
                    ? 'border-slate-200/60 dark:border-navy-800 opacity-70 bg-slate-50/50 dark:bg-navy-950/40'
                    : 'border-slate-200 dark:border-navy-700 hover:border-brand-500/30'
                }`}
              >
                <div>
                  {/* Top Badges & Meta */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 text-xs font-bold font-mono rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                        {p.latestVersionTag || `v${p.latestVersionNumber || 1}`} LATEST
                      </span>
                      <span className="px-2 py-0.5 text-[11px] rounded-md bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 font-medium">
                        {p.domain || 'Software'}
                      </span>
                      {isArchived && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          Archived
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {p.description || 'Deterministic software project estimate with structured scope breakdown.'}
                  </p>

                  {/* Metrics Summary Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 p-3 bg-slate-50/80 dark:bg-navy-950/60 rounded-xl border border-slate-100 dark:border-navy-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Latest Cost</span>
                      <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        {sum.expectedCost ? formatCurrencyINR(sum.expectedCost) : '₹--'}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Timeline</span>
                      <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        {sum.timelineWeeks ? `${sum.timelineWeeks} wks` : '--'}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Team / Risk</span>
                      <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        {sum.totalTeamFTE ? `${sum.totalTeamFTE} FTE` : '--'} • {sum.riskLevel || 'Med'}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Confidence</span>
                      <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        {sum.confidence ? `${sum.confidence}%` : '78%'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-navy-800">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenVersionHistory(p)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-700 transition-colors"
                      title="Inspect immutable snapshot history"
                    >
                      <History className="w-3.5 h-3.5 text-brand-500" />
                      <span>{p.versionCount || 1} {p.versionCount === 1 ? 'Version' : 'Versions'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDuplicate(p)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                      title="Clone Project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleArchive(p)}
                      className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                      title={isArchived ? 'Restore Project' : 'Archive Project'}
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenProjectDetails(p.id)}
                      className="text-xs"
                    >
                      Project Details
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenInResults(p)}
                      className="text-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1" />
                      Results Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Version History Modal / Drawer */}
      {activeHistoryProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-navy-700 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-800/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-500/10 text-brand-500 rounded-lg">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    Version History: {activeHistoryProject.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Immutable historical calculations. Select any 2 versions to launch comparison.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveHistoryProject(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              {loadingVersions ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  Loading version snapshots...
                </div>
              ) : (
                <VersionHistoryList
                  versions={projectVersions}
                  currentVersionNumber={activeHistoryProject.latestVersionNumber || 1}
                  onViewSnapshot={(v) => setViewedSnapshot(v)}
                  onUseAsStartingPoint={handleUseAsStartingPoint}
                  onLaunchCompare={(vA, vB) => setCompareVersions({ versionA: vA, versionB: vB })}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-800/50 shrink-0">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Deterministic reproducibility guaranteed</span>
              </div>
              <Button variant="primary" onClick={() => setActiveHistoryProject(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Snapshot Inspector Modal */}
      {viewedSnapshot && (
        <VersionSnapshotModal
          isOpen={Boolean(viewedSnapshot)}
          onClose={() => setViewedSnapshot(null)}
          version={viewedSnapshot}
          onUseAsStartingPoint={handleUseAsStartingPoint}
        />
      )}

      {/* Comparison Modal */}
      {compareVersions && (
        <VersionComparisonModal
          isOpen={Boolean(compareVersions)}
          onClose={() => setCompareVersions(null)}
          versionA={compareVersions.versionA}
          versionB={compareVersions.versionB}
        />
      )}
    </div>
  );
};
