import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Cpu, 
  Sparkles, 
  Layers, 
  Users, 
  Clock, 
  IndianRupee, 
  ShieldAlert, 
  Lightbulb, 
  Download, 
  RefreshCw, 
  Edit3, 
  PlusCircle, 
  CheckCircle2, 
  FolderPlus, 
  ArrowRight, 
  GitCommit,
  Settings,
  HelpCircle,
  AlertTriangle,
  Bookmark,
  History
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useProjectEstimation } from '../context/ProjectEstimationContext';
import { useToast } from '../context/ToastContext';
import { projectService } from '../services/projectService';
import { estimateProject } from '../services/estimation/estimationEngine.js';
import { projectApi } from '../services/projectApi';

// Phase 4 Result Dashboard Components
import { EstimateSummary } from '../components/results/EstimateSummary';
import { FeasibilityBanner } from '../components/results/FeasibilityBanner';
import { CostBreakdown } from '../components/results/CostBreakdown';
import { EffortBreakdown } from '../components/results/EffortBreakdown';
import { TeamBreakdown } from '../components/results/TeamBreakdown';
import { FeatureEstimateTable } from '../components/results/FeatureEstimateTable';
import { CriticalPath } from '../components/results/CriticalPath';
import { DependencyGraph } from '../components/results/DependencyGraph';
import { Timeline } from '../components/results/Timeline';
import { RiskPanel } from '../components/results/RiskPanel';
import { ConfidencePanel } from '../components/results/ConfidencePanel';
import { AssumptionsPanel } from '../components/results/AssumptionsPanel';
import { Recommendations } from '../components/results/Recommendations';
import { MissingFeatures } from '../components/results/MissingFeatures';
import { ExplanationPanel } from '../components/results/ExplanationPanel';

// Phase 6 Version Management Components
import { SaveVersionModal } from '../components/versions/SaveVersionModal';
import { VersionHistoryList } from '../components/versions/VersionHistoryList';
import { VersionSnapshotModal } from '../components/versions/VersionSnapshotModal';
import { VersionComparisonModal } from '../components/versions/VersionComparisonModal';

// Phase 7 What-If Scenario Component
import { WhatIfScenarioPanel } from '../components/results/WhatIfScenarioPanel';

// Phase 8 AI Components
import { AIInsightsCard } from '../components/results/AIInsightsCard';
import { AIExplanationModal } from '../components/results/AIExplanationModal';
import { AIMissingFeaturesModal } from '../components/estimation/AIMissingFeaturesModal';

export const EstimateResults = () => {
  const navigate = useNavigate();
  const { 
    project, 
    features, 
    estimationResult, 
    needsRecalculation,
    hasUnsavedChanges,
    currentProjectId,
    currentVersionNumber,
    updateProject,
    runEstimation, 
    addFeature,
    addFeaturesBulk,
    loadDemoPreset,
    saveCurrentAsNewVersion,
    useVersionAsStartingPoint,
    setCurrentStep, 
    resetDraft 
  } = useProjectEstimation();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('all');
  const [isSavedToPortfolio, setIsSavedToPortfolio] = useState(false);
  const [activeExplainModal, setActiveExplainModal] = useState(null); // 'cost' | 'timeline' | 'team' | 'risk' | 'confidence'
  const [isLoading, setIsLoading] = useState(false);

  // Phase 6 Modal States
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [projectVersions, setProjectVersions] = useState([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [viewedSnapshot, setViewedSnapshot] = useState(null);
  const [compareVersions, setCompareVersions] = useState(null);

  // Phase 8 AI Modal States
  const [isAiExplainOpen, setIsAiExplainOpen] = useState(false);
  const [isMissingFeaturesOpen, setIsMissingFeaturesOpen] = useState(false);

  // Fallback calculation if not yet cached
  const result = estimationResult || (project && features?.length > 0 ? estimateProject(project, features) : null);

  // Recalculate handler
  const handleRecalculate = async () => {
    setIsLoading(true);
    try {
      await runEstimation();
      showToast('Estimate recalculated successfully!', 'success');
    } catch (err) {
      showToast('Recalculation error: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Add missing feature handler
  const handleAddMissingFeature = (sug) => {
    addFeature({
      name: sug.name,
      description: sug.description,
      category: sug.category,
      priority: sug.priority || 'Important',
      source: 'AI Suggested',
      dependencies: [],
    });
    showToast(`Added feature: "${sug.name}". Recalculation pending.`, 'info');
  };

  // Jump to Wizard Step 1 for editing
  const handleEditProjectInfo = () => {
    setCurrentStep(1);
    navigate('/new-estimate');
  };

  // Jump to Wizard Step 2 for feature changes
  const handleEditFeatures = () => {
    setCurrentStep(2);
    navigate('/new-estimate');
  };

  // Phase 6 Save Modal Trigger
  const handleOpenSaveModal = () => {
    setIsSaveModalOpen(true);
  };

  // Phase 6 Save Version Confirm
  const handleSaveVersionConfirm = async ({ notes }) => {
    try {
      const saved = await saveCurrentAsNewVersion({ notes });
      setIsSavedToPortfolio(true);
      showToast(`Estimate saved successfully as Version ${saved.versionNumber} (v${saved.versionNumber})!`, 'success');
    } catch (err) {
      showToast('Failed to save version: ' + err.message, 'error');
      throw err;
    }
  };

  // Phase 6 Open Version History Modal
  const handleOpenVersionHistory = async () => {
    setIsHistoryModalOpen(true);
    setLoadingVersions(true);
    try {
      const vers = await projectApi.getProjectVersions(currentProjectId);
      setProjectVersions(vers);
    } catch (err) {
      showToast('Failed to load version history: ' + err.message, 'error');
    } finally {
      setLoadingVersions(false);
    }
  };

  // Phase 6 Starting Point Handler
  const handleUseAsStartingPoint = (version) => {
    useVersionAsStartingPoint(version);
    setIsHistoryModalOpen(false);
    setViewedSnapshot(null);
    navigate('/new-estimate');
    showToast(`Loaded v${version.versionNumber} into editor. Recalculate to save a new version snapshot.`, 'info');
  };

  // Phase 7 What-If Scenario Handlers
  const handleApplyScenarioToDraft = (scenarioUpdates) => {
    updateProject(scenarioUpdates);
    showToast(`Applied scenario parameters (Timeline: ${scenarioUpdates.requestedTimelineWeeks}w, Platforms: ${scenarioUpdates.platforms.join(', ')}) to working draft.`, 'success');
  };

  const handleSaveScenarioAsVersion = (scenarioResult, meta = {}) => {
    handleOpenSaveModal();
  };

  // Export estimate as JSON file
  const handleExportJSON = () => {
    if (!result) return;
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
      const downloadAnchor = document.createElement('a');
      const filename = `estimateai-${(result.projectSummary.name || 'project').toLowerCase().replace(/\s+/g, '-')}-estimate-v1.json`;
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Estimation report exported as JSON!', 'info');
    } catch (err) {
      showToast('Export failed: ' + err.message, 'error');
    }
  };

  // If no project or features available
  if (!result) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <Card className="p-8 bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 mx-auto flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            No Active Estimation Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Please start a new estimation project and add your software features to generate a complete architectural estimate.
          </p>
          <div className="pt-6 flex justify-center gap-3">
            <Button
              variant="primary"
              onClick={() => {
                loadDemoPreset('food-delivery');
              }}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Load Food Delivery Demo
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                resetDraft();
                navigate('/new-estimate');
              }}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              New Estimate
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const {
    projectSummary,
    summary,
    projectComplexity,
    features: resultFeatures,
    totalEffort,
    resources,
    timeline,
    criticalPath,
    dependencies,
    costBreakdown,
    risks,
    riskAnalysis,
    confidence,
    recommendations,
    missingFeatureSuggestions,
    assumptions,
    explanations,
    engineVersion,
    rateVersion,
    generatedAt,
  } = result;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn py-4 pb-20 px-2 sm:px-4">
      {/* 0. Demo Preset Switcher Banner */}
      <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <span className="font-bold text-brand-600 dark:text-brand-400">Demo Scenario:</span>
          <span>{projectSummary.name} ({resultFeatures.length} features • {projectSummary.platforms?.join(', ')})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Switch Preset:</span>
          <button
            type="button"
            onClick={() => loadDemoPreset('food-delivery')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              projectSummary.name.toLowerCase().includes('food')
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Food Delivery
          </button>
          <button
            type="button"
            onClick={() => loadDemoPreset('ecommerce')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              projectSummary.name.toLowerCase().includes('commerce')
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            E-Commerce
          </button>
        </div>
      </div>

      {/* 1. Feasibility Warning Banner (Prominent per Section 11) */}
      <FeasibilityBanner deadlineCheck={timeline.deadlineCheck} />

      {/* 2. Executive Summary Header & 6 KPI Cards (Section 9 & 10) */}
      <EstimateSummary
        projectSummary={projectSummary}
        summary={summary}
        engineVersion={engineVersion}
        rateVersion={rateVersion}
        generatedAt={generatedAt}
        versionNumber={currentVersionNumber || 1}
        hasUnsavedChanges={hasUnsavedChanges}
        onRecalculate={handleRecalculate}
        onEditEstimate={handleEditProjectInfo}
        onSaveToPortfolio={handleOpenSaveModal}
        onOpenVersionHistory={handleOpenVersionHistory}
        onExportJSON={handleExportJSON}
        isSaved={!hasUnsavedChanges}
        onOpenExplain={(type) => setActiveExplainModal(type)}
      />

      {/* 2.5. Phase 8: AI Executive Insights Card */}
      <AIInsightsCard
        estimateResult={estimationResult || result}
        onOpenExplain={() => setIsAiExplainOpen(true)}
        onOpenMissingFeatures={() => setIsMissingFeaturesOpen(true)}
      />

      {/* 3. Segmented Tab Selector */}
      <div className="flex items-center overflow-x-auto no-scrollbar gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold">
        {[
          { id: 'all', label: 'All Analysis Views' },
          { id: 'ai-insights', label: '✨ AI Insights' },
          { id: 'cost', label: 'Build Cost & OPEX' },
          { id: 'what-if', label: 'What-If Scenarios' },
          { id: 'features', label: 'Feature Breakdown & PERT' },
          { id: 'critical-path', label: 'Critical Path & Dependencies' },
          { id: 'timeline', label: 'Timeline & Schedule' },
          { id: 'team', label: 'Team & Headcount' },
          { id: 'risks', label: 'Risks & Confidence' },
          { id: 'assumptions', label: 'Assumptions & Rules' },
          { id: 'recommendations', label: 'Recommendations' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Detail Panels */}
      <div className="space-y-8">
        {/* Cost & Financials */}
        {(activeTab === 'all' || activeTab === 'cost') && (
          <div className="space-y-4">
            <CostBreakdown
              costData={costBreakdown}
              onOpenExplain={(type) => setActiveExplainModal(type)}
            />
          </div>
        )}

        {/* Phase 7: What-If Scenario Analysis Panel */}
        {(activeTab === 'all' || activeTab === 'what-if') && (
          <div className="space-y-4">
            <WhatIfScenarioPanel
              project={project}
              features={features}
              baselineResult={result}
              onApplyScenarioToDraft={handleApplyScenarioToDraft}
              onSaveScenarioAsVersion={handleSaveScenarioAsVersion}
            />
          </div>
        )}

        {/* Feature Breakdown & PERT Three-Point Math */}
        {(activeTab === 'all' || activeTab === 'features') && (
          <div className="space-y-4">
            <FeatureEstimateTable features={resultFeatures} />
          </div>
        )}

        {/* Critical Path & Dependencies */}
        {(activeTab === 'all' || activeTab === 'critical-path') && (
          <div className="space-y-4">
            <CriticalPath
              criticalPath={criticalPath}
              dependencies={dependencies}
            />
            <DependencyGraph dependencies={dependencies} />
          </div>
        )}

        {/* Timeline & Gantt Schedule */}
        {(activeTab === 'all' || activeTab === 'timeline') && (
          <div className="space-y-4">
            <Timeline
              timelineData={timeline}
              onOpenExplain={(type) => setActiveExplainModal(type)}
            />
          </div>
        )}

        {/* Team & Discipline Hours */}
        {(activeTab === 'all' || activeTab === 'team') && (
          <div className="space-y-4">
            <TeamBreakdown
              resources={resources}
              totalHeadcount={summary.totalTeamFTE}
              totalHours={summary.expectedEffortHours}
              onOpenExplain={(type) => setActiveExplainModal(type)}
            />
            <EffortBreakdown totalEffort={totalEffort} />
          </div>
        )}

        {/* Risks & Deterministic Confidence */}
        {(activeTab === 'all' || activeTab === 'risks') && (
          <div className="space-y-4">
            <RiskPanel
              riskAnalysis={riskAnalysis}
              onOpenExplain={(type) => setActiveExplainModal(type)}
            />
            <ConfidencePanel
              confidenceData={confidence}
              onOpenExplain={(type) => setActiveExplainModal(type)}
            />
          </div>
        )}

        {/* Missing Requirements Suggestions */}
        {(activeTab === 'all' || activeTab === 'features') && (
          <div className="space-y-4">
            <MissingFeatures
              suggestions={missingFeatureSuggestions}
              onAddFeature={handleAddMissingFeature}
              needsRecalculation={needsRecalculation}
              onRecalculate={handleRecalculate}
            />
          </div>
        )}

        {/* Recommendations */}
        {(activeTab === 'all' || activeTab === 'recommendations') && (
          <div className="space-y-4">
            <Recommendations recommendations={recommendations} />
          </div>
        )}

        {/* Calibration Assumptions & Architecture Rules */}
        {(activeTab === 'all' || activeTab === 'assumptions') && (
          <div className="space-y-4">
            <AssumptionsPanel assumptions={assumptions} />
          </div>
        )}
      </div>

      {/* 5. Bottom Navigation Footer */}
      <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Need to adjust requirements or add more features?
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You can return to any wizard step at any time; your inputs and feature definitions are autosaved.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              resetDraft();
              navigate('/new-estimate');
            }}
            leftIcon={<PlusCircle className="w-4 h-4" />}
            className="flex-1 sm:flex-none"
          >
            New Estimate
          </Button>

          <Button
            to="/projects"
            variant="primary"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="flex-1 sm:flex-none shadow-md"
          >
            View in Portfolio
          </Button>
        </div>
      </Card>

      {/* 6. Explainability Modal Interaction (Section 13) */}
      <ExplanationPanel
        isOpen={!!activeExplainModal}
        onClose={() => setActiveExplainModal(null)}
        title={
          activeExplainModal === 'cost'
            ? 'Build Cost Calculation Rationale'
            : activeExplainModal === 'timeline'
            ? 'Timeline & Phase Pacing Rationale'
            : activeExplainModal === 'team'
            ? 'Team Headcount & Role Sizing Rationale'
            : activeExplainModal === 'risk'
            ? 'Risk Rating Rationale'
            : 'Confidence Rating Rationale'
        }
        explanations={
          activeExplainModal === 'cost'
            ? explanations.cost
            : activeExplainModal === 'timeline'
            ? explanations.timeline
            : activeExplainModal === 'team'
            ? explanations.team
            : activeExplainModal === 'risk'
            ? riskAnalysis.specificReasons
            : explanations.confidence
        }
      />

      {/* 7. Phase 6: Save Version Modal */}
      <SaveVersionModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveVersionConfirm}
        projectName={projectSummary.name}
        nextVersionNumber={(currentVersionNumber || 1) + 1}
        summary={summary}
      />

      {/* 8. Phase 6: Version History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-navy-700 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-800/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-500/10 text-brand-500 rounded-lg">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    Version History: {projectSummary.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Immutable estimate snapshots. Select any 2 versions to launch side-by-side comparison.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {loadingVersions ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  Loading version snapshots...
                </div>
              ) : (
                <VersionHistoryList
                  versions={projectVersions}
                  currentVersionNumber={currentVersionNumber || 1}
                  onViewSnapshot={(v) => setViewedSnapshot(v)}
                  onUseAsStartingPoint={handleUseAsStartingPoint}
                  onLaunchCompare={(vA, vB) => setCompareVersions({ versionA: vA, versionB: vB })}
                />
              )}
            </div>

            <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-800/50 shrink-0">
              <Button variant="primary" onClick={() => setIsHistoryModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Phase 6: Snapshot Viewer Modal */}
      {viewedSnapshot && (
        <VersionSnapshotModal
          isOpen={Boolean(viewedSnapshot)}
          onClose={() => setViewedSnapshot(null)}
          version={viewedSnapshot}
          onUseAsStartingPoint={handleUseAsStartingPoint}
        />
      )}

      {/* 10. Phase 6: Comparison Modal */}
      {compareVersions && (
        <VersionComparisonModal
          isOpen={Boolean(compareVersions)}
          onClose={() => setCompareVersions(null)}
          versionA={compareVersions.versionA}
          versionB={compareVersions.versionB}
        />
      )}

      {/* 11. Phase 8: AI Estimate Explanation Modal */}
      {isAiExplainOpen && (
        <AIExplanationModal
          isOpen={isAiExplainOpen}
          onClose={() => setIsAiExplainOpen(false)}
          estimateResult={estimationResult || result}
        />
      )}

      {/* 12. Phase 8: AI Missing Features Modal */}
      {isMissingFeaturesOpen && (
        <AIMissingFeaturesModal
          isOpen={isMissingFeaturesOpen}
          onClose={() => setIsMissingFeaturesOpen(false)}
          project={project}
          existingFeatures={features}
          onAddFeatures={(missingList) => {
            addFeaturesBulk(missingList);
          }}
        />
      )}
    </div>
  );
};
