import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '../common/Button';

export const UnsavedChangesModal = ({
  isOpen,
  onStay,
  onLeave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-navy-700 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Unsaved Project Changes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You have modified this project since your last saved version.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            Leaving will keep your unsaved edits in your working draft, but an immutable historical snapshot has not been created yet. Would you like to stay and save as a new version?
          </p>

          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={onLeave}>
              Leave Without Saving
            </Button>
            <Button variant="primary" onClick={onStay}>
              Stay on Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
