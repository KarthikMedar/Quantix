import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  IndianRupee, 
  Layers, 
  AlertTriangle, 
  ShieldCheck, 
  Eye,
  Filter
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { FeatureEstimateDetails } from './FeatureEstimateDetails';

export const FeatureEstimateTable = ({ features = [] }) => {
  const [expandedId, setExpandedId] = useState(features[0]?.id || null);
  const [filterPriority, setFilterPriority] = useState('ALL');

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getComplexityBadge = (level) => {
    switch (level?.toUpperCase()) {
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

  const filteredFeatures = filterPriority === 'ALL'
    ? features
    : features.filter((f) => f.priority === filterPriority);

  return (
    <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-4">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-500" />
            Feature Estimation & Work Breakdown Table
          </h3>
          <p className="text-xs text-slate-400">
            Click any row to inspect three-point PERT math, 9 complexity dimensions, and dependency drivers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="text-xs rounded-lg px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-none focus:border-brand-500"
          >
            <option value="ALL">All Priorities ({features.length})</option>
            <option value="Must Have">Must Have</option>
            <option value="Important">Important</option>
            <option value="Nice to Have">Nice to Have</option>
          </select>
        </div>
      </div>

      {/* Table Structure */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left text-xs min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3 w-8"></th>
              <th className="py-3 px-3">Feature Name</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3">Complexity</th>
              <th className="py-3 px-3">Expected Effort</th>
              <th className="py-3 px-3">Effort Range</th>
              <th className="py-3 px-3">Estimated Cost</th>
              <th className="py-3 px-3">Dependencies</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredFeatures.map((feat) => {
              const isExpanded = expandedId === feat.id;
              return (
                <React.Fragment key={feat.id}>
                  <tr
                    onClick={() => toggleExpand(feat.id)}
                    className={`cursor-pointer transition-colors ${
                      isExpanded
                        ? 'bg-brand-50/40 dark:bg-brand-950/30'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Expand icon */}
                    <td className="py-3.5 px-3 text-slate-400">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-brand-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </td>

                    {/* Feature Name & Large Badge */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {feat.name}
                        </span>
                        {feat.isLargeFeature && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            Large
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800">
                          {feat.source || 'AI Suggested'}
                        </span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-3">
                      <Badge variant={getPriorityBadge(feat.priority)} size="sm">
                        {feat.priority}
                      </Badge>
                    </td>

                    {/* Complexity */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <Badge variant={getComplexityBadge(feat.complexityLevel)} size="sm">
                          {feat.complexityLevel}
                        </Badge>
                        <span className="font-mono text-slate-400 text-[11px]">
                          ({feat.complexityScore})
                        </span>
                      </div>
                    </td>

                    {/* Expected Effort */}
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {feat.effortHours} hrs
                    </td>

                    {/* Effort Range */}
                    <td className="py-3.5 px-3 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                      {feat.effortRange || `${feat.lowEffortHours || feat.effortHours}h – ${feat.highEffortHours || feat.effortHours}h`}
                    </td>

                    {/* Cost */}
                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {feat.formattedCost}
                    </td>

                    {/* Dependencies */}
                    <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 max-w-[150px] truncate">
                      {feat.dependencies?.length > 0 ? (
                        <span className="font-mono text-[11px]">
                          {feat.dependencies.join(', ')}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Row Content */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={8} className="p-0 border-b border-slate-200 dark:border-slate-800">
                        <FeatureEstimateDetails feature={feat} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
