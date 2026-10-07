import React, { useState, useEffect } from 'react';
import { Sparkles, X, PlusCircle, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { aiApi } from '../../services/aiApi';
import { useToast } from '../../context/ToastContext';

export const AIMissingFeaturesModal = ({
  isOpen,
  onClose,
  project,
  existingFeatures = [],
  onAddFeatures,
}) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [missingFeatures, setMissingFeatures] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState(new Set());
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      handleFetchMissing();
    } else {
      setMissingFeatures([]);
      setSelectedIndices(new Set());
      setError(null);
    }
  }, [isOpen]);

  const handleFetchMissing = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiApi.suggestMissingFeatures(project, existingFeatures);
      const list = result.missing_features || [];
      setMissingFeatures(list);
      // Default: select all
      setSelectedIndices(new Set(list.map((_, idx) => idx)));
    } catch (err) {
      console.warn('Missing features error:', err);
      setError(err.message || 'AI service unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const toggleSelect = (idx) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleConfirmAdd = () => {
    const selected = missingFeatures.filter((_, idx) => selectedIndices.has(idx));
    if (!selected.length) {
      showToast('Select at least one feature to add.', 'warning');
      return;
    }

    const formatted = selected.map((s, idx) => ({
      id: `feat_missing_${Date.now()}_${idx}`,
      name: s.name,
      description: s.description || s.reason,
      category: s.suggestedCategory || 'Core Functionality',
      priority: s.suggestedPriority || 'Important',
      source: 'AI Missing Feature Suggestion',
      dependencies: [],
    }));

    onAddFeatures(formatted);
    showToast(`Added ${formatted.length} missing features to your project!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-navy-700 flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-navy-800 bg-slate-50/60 dark:bg-navy-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                What Might You Be Missing?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI gap analysis comparing your scope against production standards.
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {isLoading ? (
            <div className="py-12 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-brand-500 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Scanning project domain & detecting missing technical modules...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : missingFeatures.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Comprehensive Feature Roster!
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No glaring architectural omissions detected based on your current project definition.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Identified {missingFeatures.length} candidate capabilities:</span>
                <span>{selectedIndices.size} selected</span>
              </div>

              <div className="space-y-2">
                {missingFeatures.map((item, idx) => {
                  const isSelected = selectedIndices.has(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleSelect(idx)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                        isSelected
                          ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                          : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 shrink-0">
                            {item.suggestedCategory}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          {item.description}
                        </p>
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 italic">
                          Why: {item.reason}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-navy-800 bg-slate-50/60 dark:bg-navy-800/60 shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={selectedIndices.size === 0 || isLoading}
            onClick={handleConfirmAdd}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Add {selectedIndices.size} Selected to Project
          </Button>
        </div>
      </div>
    </div>
  );
};
