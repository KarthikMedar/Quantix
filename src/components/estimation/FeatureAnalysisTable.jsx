import React, { useState } from 'react';
import { Eye, Clock, IndianRupee, HelpCircle, ChevronRight, Layers } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { EstimationReasoning } from './EstimationReasoning';

export const FeatureAnalysisTable = ({ featureEstimates = [] }) => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const getComplexityBadge = (level) => {
    switch (level) {
      case 'VERY HIGH':
        return 'danger';
      case 'HIGH':
        return 'purple';
      case 'MEDIUM':
        return 'warning';
      default:
        return 'success';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Must Have':
        return 'danger';
      case 'Important':
        return 'warning';
      case 'Nice to Have':
        return 'brand';
      default:
        return 'neutral';
    }
  };

  return (
    <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-500" />
            Detailed Feature Complexity & Effort Analysis
          </h3>
          <p className="text-xs text-slate-400">
            Click "View Details" on any feature to inspect the 9 complexity factors and architectural drivers.
          </p>
        </div>
        <span className="text-xs text-slate-500 font-semibold">
          {featureEstimates.length} Features Evaluated
        </span>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left text-xs min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-2">#</th>
              <th className="py-3 px-3">Feature Name</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Complexity Level</th>
              <th className="py-3 px-3">Score</th>
              <th className="py-3 px-3">Estimated Effort</th>
              <th className="py-3 px-3">Estimated Cost</th>
              <th className="py-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {featureEstimates.map((feat, idx) => (
              <tr
                key={feat.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-3.5 px-2 font-mono text-slate-400 font-bold">
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </td>

                <td className="py-3.5 px-3">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {feat.name}
                  </span>
                  {feat.description && (
                    <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                      {feat.description}
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-3">
                  <Badge variant="neutral" size="sm">
                    {feat.category}
                  </Badge>
                </td>

                <td className="py-3.5 px-3">
                  <Badge variant={getComplexityBadge(feat.complexityLevel)} size="sm">
                    {feat.complexityLevel}
                  </Badge>
                </td>

                <td className="py-3.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                  {feat.complexityScore} <span className="text-[10px] text-slate-400 font-normal">/ {feat.maxScore}</span>
                </td>

                <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                  <span className="inline-flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-brand-500" />
                    {feat.effortHours} hrs
                  </span>
                </td>

                <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                  {feat.formattedCost}
                </td>

                <td className="py-3.5 px-2 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFeature(feat)}
                    leftIcon={<Eye className="w-3.5 h-3.5 text-brand-500" />}
                    className="text-xs py-1"
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Reasoning Modal */}
      {selectedFeature && (
        <EstimationReasoning
          isOpen={!!selectedFeature}
          onClose={() => setSelectedFeature(null)}
          featureEstimate={selectedFeature}
        />
      )}
    </Card>
  );
};
