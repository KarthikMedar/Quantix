import React, { useState } from 'react';
import { Bookmark, Sparkles, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { formatCurrencyINR } from '../../utils/formatters';

export const SaveVersionModal = ({
  isOpen,
  onClose,
  onSave,
  projectName = 'Project',
  nextVersionNumber = 1,
  summary = null,
}) => {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await onSave({ notes });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save version.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-navy-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/10 text-brand-500 rounded-lg">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Save Estimate Version
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create an immutable historical snapshot for {projectName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Version Tag Indicator */}
          <div className="flex items-center justify-between p-3.5 bg-brand-50/60 dark:bg-navy-800/60 rounded-xl border border-brand-100 dark:border-navy-700">
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Target Version</div>
              <div className="text-lg font-bold text-brand-600 dark:text-brand-400">
                Version {nextVersionNumber} (v{nextVersionNumber})
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Immutable Snapshot</span>
            </div>
          </div>

          {/* Summary Preview */}
          {summary && (
            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-navy-950/60 rounded-xl border border-slate-100 dark:border-navy-800 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Expected Cost</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {formatCurrencyINR(summary.expectedCost || 0)}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Effort</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {summary.expectedEffortHours || 0} hrs
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Timeline</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {summary.timelineWeeks || 0} wks
                </p>
              </div>
            </div>
          )}

          {/* Changelog / Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Version Notes / Changelog <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Added real-time tracking module; adjusted requested deadline to 14 weeks."
              rows={3}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Historical versions cannot be edited later. Future project changes will create Version {nextVersionNumber + 1}.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? (
                <>Saving Snapshot...</>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Save as Version {nextVersionNumber}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
