import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Check, 
  AlertTriangle, 
  Layers, 
  FileText, 
  Cpu, 
  ArrowRight, 
  Key, 
  ShieldCheck, 
  PlusCircle, 
  HelpCircle,
  Clock,
  Zap
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { requirementAnalyzer, REQUIREMENT_TEMPLATES } from '../../services/requirementAnalyzer';
import { useToast } from '../../context/ToastContext';

export const AiRequirementModal = ({
  isOpen,
  onClose,
  onImportFeatures,
  currentDomain = 'General',
  projectTitle = '',
}) => {
  const { showToast } = useToast();

  const [promptText, setPromptText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [engineMode, setEngineMode] = useState('heuristic'); // 'heuristic' | 'gemini'
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('estimateai_gemini_api_key') || '' : '';
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState(new Set());

  if (!isOpen) return null;

  // Handle template selection
  const handleApplyTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    const tmpl = REQUIREMENT_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      setPromptText(tmpl.prompt);
      setAnalysisResult(null);
    }
  };

  // Save API key
  const handleSaveApiKey = (key) => {
    setGeminiApiKey(key);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('estimateai_gemini_api_key', key);
    }
  };

  // Run analysis
  const handleAnalyze = async () => {
    if (!promptText.trim()) {
      showToast('Please enter project requirements or pick a template.', 'error');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await requirementAnalyzer.analyzeRequirements(
        {
          title: projectTitle,
          description: promptText,
          domain: currentDomain,
          requirementsText: promptText,
        },
        {
          mode: engineMode,
          apiKey: geminiApiKey,
        }
      );

      setAnalysisResult(result);
      // Default: select all extracted features
      setSelectedFeatureIds(new Set(result.features.map((f) => f.id)));
      showToast(`Extracted ${result.features.length} candidate features!`, 'success');
    } catch (err) {
      console.error('Analysis failed:', err);
      showToast(`Analysis failed: ${err.message}`, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle single feature selection
  const toggleFeatureSelection = (id) => {
    setSelectedFeatureIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Select / Deselect All
  const handleSelectAll = (select) => {
    if (!analysisResult) return;
    if (select) {
      setSelectedFeatureIds(new Set(analysisResult.features.map((f) => f.id)));
    } else {
      setSelectedFeatureIds(new Set());
    }
  };

  // Add a detected missing requirement as a candidate feature
  const handleAddMissingRequirement = (missing) => {
    if (!analysisResult) return;
    const newFeature = {
      id: `feat_missing_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: missing.name,
      description: missing.reason,
      category: missing.suggestedCategory || 'Core Functionality',
      priority: missing.suggestedPriority || 'Important',
      complexityLevel: 'Medium',
      dependencies: [],
      source: 'AI Missing Requirement Recommendation',
      order: (analysisResult.features.length || 0) + 1,
    };

    setAnalysisResult((prev) => ({
      ...prev,
      features: [...prev.features, newFeature],
      missingRequirements: prev.missingRequirements.filter((m) => m.id !== missing.id),
    }));

    setSelectedFeatureIds((prev) => new Set([...prev, newFeature.id]));
    showToast(`Added "${missing.name}" to selection!`, 'success');
  };

  // Import into Wizard
  const handleConfirmImport = () => {
    if (!analysisResult || selectedFeatureIds.size === 0) {
      showToast('Select at least one feature to import.', 'warning');
      return;
    }

    const featuresToImport = analysisResult.features.filter((f) => selectedFeatureIds.has(f.id));
    onImportFeatures(featuresToImport);
    showToast(`Successfully imported ${featuresToImport.length} features!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-navy-700 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-navy-800 bg-slate-50/60 dark:bg-navy-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-indigo-500 text-white rounded-xl shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  AI Requirement & Feature Extractor
                </h3>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/60">
                  Phase 8
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste natural-language specs or user stories to generate structured feature modules.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Options: Templates & Engine Mode */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Quick Template Examples:
              </label>
              {/* Engine Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Engine:</span>
                <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700">
                  <button
                    type="button"
                    onClick={() => setEngineMode('heuristic')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                      engineMode === 'heuristic'
                        ? 'bg-white dark:bg-navy-900 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    ⚡ Smart NLP (Offline)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEngineMode('gemini')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                      engineMode === 'gemini'
                        ? 'bg-white dark:bg-navy-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    ✨ Google Gemini
                  </button>
                </div>
              </div>
            </div>

            {/* Template Pills */}
            <div className="flex flex-wrap gap-1.5">
              {REQUIREMENT_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all text-left flex items-center gap-1.5 ${
                    selectedTemplate === tmpl.id
                      ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 font-medium'
                      : 'bg-slate-50 dark:bg-navy-800 border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:border-brand-300'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  {tmpl.title}
                </button>
              ))}
            </div>

            {/* Optional Gemini API Key field when Gemini mode selected */}
            {engineMode === 'gemini' && (
              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs shrink-0">
                  <Key className="w-4 h-4" />
                  <span>Gemini API Key:</span>
                </div>
                <input
                  type="password"
                  placeholder="Paste your Google Gemini API key (or leave blank to fallback to Smart NLP)"
                  value={geminiApiKey}
                  onChange={(e) => handleSaveApiKey(e.target.value)}
                  className="flex-1 w-full text-xs px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Prompt Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Project Requirements / PRD Notes:
              </label>
              <span className="text-[11px] text-slate-400">
                {promptText.length} characters
              </span>
            </div>
            <textarea
              rows={6}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Paste raw user stories, PRD bullet points, client RFP excerpts, or high-level architecture thoughts here..."
              className="w-full text-xs font-mono p-3 rounded-2xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-y leading-relaxed"
            />
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="md"
              disabled={isAnalyzing || !promptText.trim()}
              onClick={handleAnalyze}
              leftIcon={<Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />}
            >
              {isAnalyzing ? 'Analyzing Requirements...' : '✨ Analyze & Generate Features'}
            </Button>
          </div>

          {/* Results Tray */}
          {analysisResult && (
            <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-navy-800 animate-fadeIn">
              {/* Summary Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-brand-500/5 dark:bg-brand-500/10 rounded-2xl border border-brand-500/20">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Generated {analysisResult.features.length} Candidate Features
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Engine: {analysisResult.metadata.aiEngine} • Confidence: {analysisResult.metadata.confidence}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectAll(true)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:text-brand-600"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectAll(false)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:text-brand-600"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Feature Selection Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Features to Import into Project:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {analysisResult.features.map((feat) => {
                    const isSelected = selectedFeatureIds.has(feat.id);
                    return (
                      <div
                        key={feat.id}
                        onClick={() => toggleFeatureSelection(feat.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                          isSelected
                            ? 'bg-brand-50/60 dark:bg-brand-950/40 border-brand-400 dark:border-brand-700 shadow-xs'
                            : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="pt-0.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // handled by parent onClick
                            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {feat.name}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 shrink-0">
                              {feat.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {feat.description}
                          </p>
                          <div className="flex items-center gap-2 pt-1 text-[10px]">
                            <span className={`font-semibold ${
                              feat.priority === 'Must Have'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-slate-500'
                            }`}>
                              ● {feat.priority}
                            </span>
                            <span className="text-slate-400">• Complexity: {feat.complexityLevel || 'Medium'}</span>
                            {feat.dependencies && feat.dependencies.length > 0 && (
                              <span className="text-brand-500">• {feat.dependencies.length} dep</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detected Missing Requirements */}
              {analysisResult.missingRequirements && analysisResult.missingRequirements.length > 0 && (
                <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 rounded-2xl border border-amber-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <h5 className="text-xs font-bold">
                      Domain Gaps & Missing Requirements Detected ({analysisResult.missingRequirements.length})
                    </h5>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {analysisResult.missingRequirements.map((missing) => (
                      <div
                        key={missing.id || missing.name}
                        className="p-3 bg-white dark:bg-navy-900 rounded-xl border border-amber-200 dark:border-amber-900/50 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {missing.name}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {missing.reason}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddMissingRequirement(missing)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 transition-colors"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detected Architectural Risks */}
              {analysisResult.detectedRisks && analysisResult.detectedRisks.length > 0 && (
                <div className="p-4 bg-slate-50 dark:bg-navy-950/60 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-2">
                  <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-500" />
                    Architectural & Engineering Risks Identified
                  </h5>
                  <div className="space-y-1.5">
                    {analysisResult.detectedRisks.map((risk, idx) => (
                      <div key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-brand-500 font-bold">•</span>
                        <span>
                          <strong className="text-slate-900 dark:text-slate-200">{risk.type}:</strong> {risk.risk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-navy-800 bg-slate-50/60 dark:bg-navy-800/60 shrink-0">
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={!analysisResult || selectedFeatureIds.size === 0}
            onClick={handleConfirmImport}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Import {selectedFeatureIds.size} Selected Features
          </Button>
        </div>
      </div>
    </div>
  );
};
