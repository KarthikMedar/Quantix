import React from 'react';
import { Plus, Sparkles, Check, ArrowRight, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const MissingFeatures = ({ suggestions = [], onAddFeature, needsRecalculation, onRecalculate }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Potentially Missing Requirements & Modules
          </h3>
          <p className="text-xs text-slate-400">
            Domain-specific features frequently required for comprehensive production deployment.
          </p>
        </div>

        {needsRecalculation && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-500 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Recalculation pending
            </span>
            <Button variant="primary" size="sm" onClick={onRecalculate}>
              Recalculate Now
            </Button>
          </div>
        )}
      </div>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {suggestions.map((sug, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between gap-3 hover:border-slate-300 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  {sug.name}
                </span>
                <Badge variant="purple" size="sm">
                  {sug.category}
                </Badge>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                {sug.description}
              </p>
            </div>

            <div className="pt-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium">
                {sug.priority || 'Important'}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddFeature(sug)}
                leftIcon={<Plus className="w-3.5 h-3.5 text-brand-500" />}
                className="text-xs py-1 px-2.5 h-7"
              >
                Add Feature
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
