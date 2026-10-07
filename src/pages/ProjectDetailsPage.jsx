import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  FolderKanban, 
  Clock, 
  IndianRupee, 
  Edit3, 
  RefreshCw, 
  History, 
  GitCompare, 
  PlusCircle, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2,
  Copy,
  Archive,
  Bookmark
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useToast } from '../context/ToastContext';
import { useProjectEstimation } from '../context/ProjectEstimationContext';
import { projectApi } from '../services/projectApi';
import { formatCurrencyINR } from '../utils/formatters';
import { VersionHistoryList } from '../components/versions/VersionHistoryList';
import { VersionSnapshotModal } from '../components/versions/VersionSnapshotModal';
import { VersionComparisonModal } from '../components/versions/VersionComparisonModal';
import { SaveVersionModal } from '../components/versions/SaveVersionModal';

export const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { loadProject, useVersionAsStartingPoint, setCurrentStep } = useProjectEstimation();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [viewedSnapshot, setViewedSnapshot] = useState(null);
  const [compareVersions, setCompareVersions] = useState(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const fetchProjectDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectApi.getProjectById(projectId);
      setProject(data);
    } catch (err) {
      setError(err.message || 'Failed to load project.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  // Open in Results Dashboard
  const handleOpenResults = async () => {
    try {
      await loadProject(projectId);
      navigate('/estimate-results');
    } catch (err) {
      showToast('Error opening project: ' + err.message, 'error');
    }
  };

  // Jump to Wizard Step 1 for editing
  const handleEditProject = async () => {
    try {
      await loadProject(projectId);
      setCurrentStep(1);
      navigate('/new-estimate');
    } catch (err) {
      showToast('Error opening editor: ' + err.message, 'error');
    }
  };

  // Starting point handler
  const handleUseAsStartingPoint = (version) => {
    useVersionAsStartingPoint(version);
    setViewedSnapshot(null);
    navigate('/new-estimate');
    showToast(`Loaded v${version.versionNumber} into editor. Recalculate and save to create a new version.`, 'info');
  };

  if (loading) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500">Loading project details and version history...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl w-14 h-14 mx-auto flex items-center justify-center">
          <FolderKanban className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Project Not Found</h3>
        <p className="text-xs text-slate-500">{error || 'The requested project could not be located.'}</p>
        <Button to="/projects" variant="primary" size="sm">
          Back to My Projects
        </Button>
      </div>
    );
  }

  const latestVersion = project.versions?.[0] || null;
  const summary = latestVersion?.summary || project.summary || {};
  const currentFeatures = project.inputDraft?.features || latestVersion?.inputSnapshot?.features || [];

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Back button */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Projects</span>
        </Link>
      </div>

      {/* Project Header Card */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 text-xs font-bold font-mono rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                v{project.latestVersionNumber || 1} LATEST
              </span>
              <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
                {project.domain || 'Software'}
              </span>
              <span className="px-2 py-0.5 text-xs font-mono rounded-md bg-slate-100 dark:bg-navy-800 text-slate-400">
                {project.id}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {project.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              {project.description || 'Deterministic software project estimate with structured scope breakdown.'}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>Last Snapshot: {new Date(project.updatedAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{project.versionCount || project.versions?.length || 1} Total Versions</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleEditProject}
              className="text-xs"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1.5" />
              Edit Project Draft
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleOpenResults}
              className="text-xs shadow-md"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Open in Results Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Latest Estimate Summary (6 KPI Cards) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Latest Saved Estimate Summary (v{project.latestVersionNumber || 1})
          </h2>
          <span className="text-xs text-slate-500">
            Engine v{latestVersion?.engineVersion || '1.0.0'} • Rate v{latestVersion?.rateVersion || '1.0.0'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Cost</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {formatCurrencyINR(summary.expectedCost || 0)}
            </p>
            <span className="text-[10px] text-slate-400">
              {formatCurrencyINR(summary.lowCost || 0)} – {formatCurrencyINR(summary.highCost || 0)}
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Effort</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {summary.expectedEffortHours || 0} hrs
            </p>
            <span className="text-[10px] text-slate-400">
              {summary.lowEffortHours || 0}h – {summary.highEffortHours || 0}h
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400">Timeline</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {summary.timelineWeeks || 0} wks
            </p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Feasible Schedule
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400">Team Size</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {summary.totalTeamFTE || 0} FTE
            </p>
            <span className="text-[10px] text-slate-400">
              {currentFeatures.length} features
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400">Project Risk</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {summary.riskLevel || 'Medium'}
            </p>
            <span className="text-[10px] text-slate-400 font-mono">
              Score: {summary.riskScore || 0}/100
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400">Confidence</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {summary.confidence || 0}%
            </p>
            <span className="text-[10px] text-slate-400">
              Deterministic PERT
            </span>
          </div>
        </div>
      </div>

      {/* Version History Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-brand-500" />
              <span>Immutable Version History</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each version is an immutable snapshot of scope, PERT effort, and role costs at that point in time.
            </p>
          </div>
        </div>

        <VersionHistoryList
          versions={project.versions || []}
          currentVersionNumber={project.latestVersionNumber || 1}
          onViewSnapshot={(v) => setViewedSnapshot(v)}
          onUseAsStartingPoint={handleUseAsStartingPoint}
          onLaunchCompare={(vA, vB) => setCompareVersions({ versionA: vA, versionB: vB })}
        />
      </div>

      {/* Current Features List in Draft */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Working Features ({currentFeatures.length} Modules)
            </h3>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEditProject}
            className="text-xs"
          >
            Manage Features
          </Button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-navy-800 border border-slate-200 dark:border-navy-800 rounded-xl overflow-hidden">
          {currentFeatures.map((f, i) => (
            <div key={i} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-navy-850 transition-colors">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white mr-2">{f.name}</span>
                <span className="text-slate-400 text-[11px] mr-2">({f.category})</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
                  {f.priority || 'Must Have'}
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {f.estimatedHours || (f.threePoint?.expected) || '--'}h
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

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
