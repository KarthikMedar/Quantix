import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  Layers, 
  HelpCircle, 
  Check, 
  Copy,
  Tag,
  Link2
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { AiRequirementModal } from './AiRequirementModal';
import { AIComplexitySuggestion } from '../estimation/AIComplexitySuggestion';
import { AIMissingFeaturesModal } from '../estimation/AIMissingFeaturesModal';
import { useProjectEstimation } from '../../context/ProjectEstimationContext';
import { useToast } from '../../context/ToastContext';

export const Step2FeatureManagement = ({ onNext, onPrev }) => {
  const { 
    project, 
    features, 
    addFeature, 
    addFeaturesBulk,
    updateFeature, 
    deleteFeature, 
    moveFeature 
  } = useProjectEstimation();
  const { showToast } = useToast();

  // Phase 8 AI Modal States
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isMissingModalOpen, setIsMissingModalOpen] = useState(false);
  const [customFactors, setCustomFactors] = useState(null);

  // New feature input state
  const [featureName, setFeatureName] = useState('');
  const [featureDescription, setFeatureDescription] = useState('');
  const [featureCategory, setFeatureCategory] = useState('Core Functionality');
  const [featurePriority, setFeaturePriority] = useState('Must Have');
  const [featureDependencies, setFeatureDependencies] = useState([]);
  const [inputError, setInputError] = useState('');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Modal State
  const [editingFeature, setEditingFeature] = useState(null);

  // Delete Confirmation State
  const [featureToDelete, setFeatureToDelete] = useState(null);

  // Category & Priority Options
  const CATEGORIES = [
    'Authentication',
    'User Management',
    'Core Functionality',
    'Payment',
    'Communication',
    'Administration',
    'Analytics',
    'AI/ML',
    'Security',
    'Integration',
    'Other',
  ];

  const PRIORITIES = [
    'Must Have',
    'Important',
    'Nice to Have',
    'Optional',
  ];

  // Quick suggestion features tailored to the user's project or common software
  const SUGGESTED_FEATURES = useMemo(() => {
    return [
      {
        name: 'User Registration',
        description: 'Allow new users to sign up securely, verify email/phone, and create their initial account.',
        category: 'Authentication',
        priority: 'Must Have',
      },
      {
        name: 'Restaurant Management',
        description: 'Store profiles, menu catalog management, pricing tiers, and operating hour controls.',
        category: 'Core Functionality',
        priority: 'Must Have',
      },
      {
        name: 'Food Search',
        description: 'Full-text menu search, cuisine filters, allergen tags, and sorting by rating/distance.',
        category: 'Core Functionality',
        priority: 'Must Have',
      },
      {
        name: 'Shopping Cart',
        description: 'Item customization, cart persistence, coupon discounts, and order cost calculation.',
        category: 'Core Functionality',
        priority: 'Must Have',
      },
      {
        name: 'Payment Gateway',
        description: 'Secure credit card, UPI/net-banking, and digital wallet checkout with webhook receipts.',
        category: 'Payment',
        priority: 'Must Have',
      },
      {
        name: 'Order Tracking',
        description: 'Real-time GPS delivery tracking, estimated arrival times, and courier contact details.',
        category: 'Core Functionality',
        priority: 'Important',
      },
      {
        name: 'Push Notifications',
        description: 'Automated order status alerts, delivery arrival pings, and promotional notifications.',
        category: 'Communication',
        priority: 'Important',
      },
      {
        name: 'Admin Dashboard',
        description: 'Platform metrics, dispute handling, restaurant verification, and revenue reporting.',
        category: 'Administration',
        priority: 'Must Have',
      },
    ];
  }, []);

  // Handle Add Feature
  const handleAddFeature = (e) => {
    e?.preventDefault();
    const trimmedName = featureName.trim();

    if (!trimmedName) {
      setInputError('Feature name is required.');
      return;
    }

    // Check duplicate
    const isDuplicate = features.some(
      (f) => f.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      setInputError('A feature with this name already exists in your project.');
      showToast(`Warning: "${trimmedName}" is already listed.`, 'warning');
      return;
    }

    addFeature({
      name: trimmedName,
      description: featureDescription.trim(),
      category: featureCategory,
      priority: featurePriority,
      dependencies: featureDependencies,
      factors: customFactors,
      factorSource: customFactors ? 'ai' : 'manual',
    });

    // Reset inputs
    setFeatureName('');
    setFeatureDescription('');
    setFeatureCategory('Core Functionality');
    setFeaturePriority('Must Have');
    setFeatureDependencies([]);
    setCustomFactors(null);
    setInputError('');
    showToast(`Added feature: "${trimmedName}"`, 'success', 2000);
  };

  // Quick Add from Suggestion
  const handleApplySuggestion = (suggestion) => {
    const isExisting = features.some(
      (f) => f.name.toLowerCase() === suggestion.name.toLowerCase()
    );
    if (isExisting) {
      showToast(`"${suggestion.name}" is already in your feature list.`, 'info');
      return;
    }

    addFeature({
      name: suggestion.name,
      description: suggestion.description,
      category: suggestion.category,
      priority: suggestion.priority,
      dependencies: [],
    });
    showToast(`Added "${suggestion.name}"`, 'success', 2000);
  };

  // Handle Save Edit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingFeature.name.trim()) {
      showToast('Feature name cannot be empty.', 'error');
      return;
    }

    updateFeature(editingFeature.id, {
      name: editingFeature.name.trim(),
      description: editingFeature.description.trim(),
      category: editingFeature.category,
      priority: editingFeature.priority,
      dependencies: editingFeature.dependencies || [],
    });

    showToast('Feature updated successfully.', 'success');
    setEditingFeature(null);
  };

  // Handle Confirm Delete
  const handleConfirmDelete = () => {
    if (!featureToDelete) return;
    deleteFeature(featureToDelete.id);
    showToast(`Feature "${featureToDelete.name}" removed.`, 'info');
    setFeatureToDelete(null);
  };

  // Check validation before going to review
  const handleNext = () => {
    if (features.length === 0) {
      showToast('Please add at least one software feature before continuing.', 'error');
      return;
    }
    onNext();
  };

  // Filtered features for search
  const filteredFeatures = useMemo(() => {
    if (!searchQuery.trim()) return features;
    const q = searchQuery.toLowerCase();
    return features.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.description && f.description.toLowerCase().includes(q)) ||
        (f.category && f.category.toLowerCase().includes(q)) ||
        (f.priority && f.priority.toLowerCase().includes(q))
    );
  }, [features, searchQuery]);

  // Priority count breakdown
  const priorityCounts = useMemo(() => {
    const counts = { 'Must Have': 0, 'Important': 0, 'Nice to Have': 0, 'Optional': 0 };
    features.forEach((f) => {
      if (counts[f.priority] !== undefined) counts[f.priority]++;
    });
    return counts;
  }, [features]);

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'Must Have':
        return 'danger';
      case 'Important':
        return 'warning';
      case 'Nice to Have':
        return 'brand';
      case 'Optional':
        return 'neutral';
      default:
        return 'brand';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Step Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Define Your Software Features
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Add the features your software needs. Each feature will later be analyzed for complexity, effort and cost.
        </p>
      </div>

      {/* PHASE 8: AI REQUIREMENT & FEATURE GENERATOR BANNER */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-brand-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/10">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
            <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                AI Requirement & Feature Assistant
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/25">
                Phase 8
              </span>
            </div>
            <p className="text-xs sm:text-sm text-brand-100 mt-0.5 max-w-xl leading-relaxed">
              Paste raw PRD text, user stories, or client specs. Our AI extractor identifies features, categories, dependencies, and missing requirements automatically.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => setIsAiModalOpen(true)}
          className="bg-white text-brand-700 hover:bg-brand-50 font-bold shrink-0 shadow-md border-0"
          leftIcon={<Sparkles className="w-4 h-4 text-brand-600" />}
        >
          ✨ Extract Features with AI
        </Button>
      </div>

      {/* TOP SECTION: ADD FEATURE INPUT AREA */}
      <Card className="p-6 sm:p-8 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-5 shadow-sm">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand-500" />
            Add New Software Feature
          </h3>
          <span className="text-xs text-slate-400">
            Define individual user stories or technical capabilities
          </span>
        </div>

        <form onSubmit={handleAddFeature} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Feature Name */}
            <div className="md:col-span-6">
              <Input
                label="Feature Name"
                id="feature-name"
                placeholder="e.g. User Registration and Login"
                value={featureName}
                onChange={(e) => {
                  setFeatureName(e.target.value);
                  if (inputError) setInputError('');
                }}
                error={inputError}
                required
              />
            </div>

            {/* Category */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={featureCategory}
                onChange={(e) => setFeatureCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700/80 py-2.5 px-3 text-sm bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Priority
              </label>
              <select
                value={featurePriority}
                onChange={(e) => setFeaturePriority(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700/80 py-2.5 px-3 text-sm bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Feature Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Feature Description <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Describe what this feature should allow users to do, key workflows, or constraints."
              value={featureDescription}
              onChange={(e) => setFeatureDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700/80 p-3 text-sm bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 resize-none"
            />
          </div>

          {/* Dependencies (if features exist) */}
          {features.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Dependencies <span className="text-slate-400 font-normal">(Optional, select if this feature depends on another)</span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                {features.map((f) => {
                  const isDep = featureDependencies.includes(f.name);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        if (isDep) {
                          setFeatureDependencies(featureDependencies.filter((d) => d !== f.name));
                        } else {
                          setFeatureDependencies([...featureDependencies, f.name]);
                        }
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                        isDep
                          ? 'bg-brand-500 text-white border-brand-500'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {isDep ? `✓ ${f.name}` : `+ ${f.name}`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Complexity Suggestion Helper for active input */}
          {featureName.trim().length >= 3 && (
            <div className="pt-2">
              <AIComplexitySuggestion
                feature={{
                  name: featureName,
                  description: featureDescription,
                  category: featureCategory,
                }}
                project={project}
                onApplyFactors={(factors) => setCustomFactors(factors)}
              />
            </div>
          )}

          {/* Add Button */}
          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              + Add Feature
            </Button>
          </div>
        </form>

        {/* Feature suggestions chips & Missing Features Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Suggested features (click to quickly add):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_FEATURES.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleApplySuggestion(item)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/60 hover:text-brand-600 dark:hover:text-brand-400 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  + {item.name}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsMissingModalOpen(true)}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
          >
            What Might I Be Missing?
          </Button>
        </div>
      </Card>

      {/* MIDDLE SECTION: FEATURE LIST & CONTROLS */}
      <div className="space-y-4">
        {/* List Header, Count, and Search Box */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Project Features Scope
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
              Features Added: {features.length}
            </span>
          </div>

          {/* Search box */}
          {features.length > 0 && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          )}
        </div>

        {/* EMPTY STATE */}
        {features.length === 0 ? (
          <Card className="p-12 text-center max-w-lg mx-auto space-y-4 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-500 mx-auto flex items-center justify-center border border-brand-200 dark:border-brand-800">
              <Layers className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                No features added yet.
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Start by adding the main functionality your software project needs, or select from the suggestions above.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                document.getElementById('feature-name')?.focus();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              Add First Feature
            </button>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredFeatures.map((feat, index) => {
              const originalIndex = features.findIndex((f) => f.id === feat.id);
              const formattedNumber = originalIndex + 1 < 10 ? `0${originalIndex + 1}` : `${originalIndex + 1}`;

              return (
                <Card
                  key={feat.id}
                  className="p-5 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    {/* Header Row: Number + Name + Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {formattedNumber}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {feat.name}
                      </h4>
                      <Badge variant="neutral" size="sm">
                        {feat.category}
                      </Badge>
                      <Badge variant={getPriorityBadgeVariant(feat.priority)} size="sm">
                        {feat.priority}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feat.description || 'No detailed description provided.'}
                    </p>

                    {/* Dependencies if any */}
                    {feat.dependencies && feat.dependencies.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                        <Link2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                        <span className="font-medium">Depends on:</span>
                        <div className="flex flex-wrap gap-1">
                          {feat.dependencies.map((dep, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]"
                            >
                              {dep}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Column: Move up/down, Edit, Delete */}
                  <div className="flex items-center gap-1 shrink-0 self-end sm:self-start pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 w-full sm:w-auto justify-end">
                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={originalIndex === 0}
                      onClick={() => moveFeature(originalIndex, 'up')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move feature up"
                      aria-label="Move feature up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={originalIndex === features.length - 1}
                      onClick={() => moveFeature(originalIndex, 'down')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move feature down"
                      aria-label="Move feature down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => setEditingFeature({ ...feat })}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/60 transition-colors"
                      title="Edit feature"
                      aria-label="Edit feature"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setFeatureToDelete(feat)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete feature"
                      aria-label="Delete feature"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* BOTTOM SUMMARY CARD */}
      <Card className="p-6 bg-slate-50 dark:bg-slate-800/40 border-slate-200/90 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Feature Scope Summary
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">Project Title</span>
            <span className="font-bold text-slate-900 dark:text-white truncate block">
              {project.name || 'Untitled Project'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">Features Added</span>
            <span className="text-base font-bold text-brand-600 dark:text-brand-400">
              {features.length}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">Must Have</span>
            <span className="text-base font-bold text-rose-500">
              {priorityCounts['Must Have']}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">Important</span>
            <span className="text-base font-bold text-amber-500">
              {priorityCounts['Important']}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">Nice / Optional</span>
            <span className="text-base font-bold text-slate-600 dark:text-slate-300">
              {priorityCounts['Nice to Have'] + priorityCounts['Optional']}
            </span>
          </div>
        </div>
      </Card>

      {/* BOTTOM NAVIGATION */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
        <Button
          variant="outline"
          size="md"
          onClick={onPrev}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          ← Back
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="shadow-md"
        >
          Review Project →
        </Button>
      </div>

      {/* EDIT FEATURE MODAL */}
      {editingFeature && (
        <Modal
          isOpen={!!editingFeature}
          onClose={() => setEditingFeature(null)}
          title="Edit Feature"
          description="Update feature parameters and acceptance criteria."
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-left">
            <Input
              label="Feature Name"
              value={editingFeature.name}
              onChange={(e) =>
                setEditingFeature({ ...editingFeature, name: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={editingFeature.category}
                  onChange={(e) =>
                    setEditingFeature({ ...editingFeature, category: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  value={editingFeature.priority}
                  onChange={(e) =>
                    setEditingFeature({ ...editingFeature, priority: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={editingFeature.description}
                onChange={(e) =>
                  setEditingFeature({ ...editingFeature, description: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingFeature(null)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {featureToDelete && (
        <Modal
          isOpen={!!featureToDelete}
          onClose={() => setFeatureToDelete(null)}
          title="Delete this feature?"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-left">
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              This action will remove <strong>"{featureToDelete.name}"</strong> from the current project estimate.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFeatureToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Phase 8 AI Requirement & Feature Extractor Modal */}
      <AiRequirementModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onImportFeatures={(importedList) => {
          addFeaturesBulk(importedList);
        }}
        currentDomain={project.domain || 'General'}
        projectTitle={project.name || ''}
      />

      {/* Phase 8 AI Missing Features Modal */}
      <AIMissingFeaturesModal
        isOpen={isMissingModalOpen}
        onClose={() => setIsMissingModalOpen(false)}
        project={project}
        existingFeatures={features}
        onAddFeatures={(missingList) => {
          addFeaturesBulk(missingList);
        }}
      />
    </div>
  );
};
